const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { DetectDominantLanguageCommand } = require('@aws-sdk/client-comprehend');
const { bedrockClient, comprehendClient, isConfigured } = require('../config/awsConfig');
const { EventEmitter } = require('events');
const pLimit = require('p-limit');

const BEDROCK_CONCURRENCY = parseInt(process.env.BEDROCK_CONCURRENCY_LIMIT || '3', 10);
const ACTIVE_MODEL = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-haiku-20241022-v1:0';
const ENABLE_AI = process.env.ENABLE_AI_TRANSLATION !== 'false';
const ENABLE_CONTENT = process.env.ENABLE_CONTENT_TRANSLATION !== 'false';

console.log(`🤖 Translation model: ${ACTIVE_MODEL} | Concurrency: ${BEDROCK_CONCURRENCY}`);

// Global SSE progress emitter
const translationProgress = new EventEmitter();
translationProgress.setMaxListeners(100);

class TranslationService {
    constructor() {
        this._bedrockAccessDenied = false;
    }

    // ─── Language Detection ────────────────────────────────────────────────

    detectLanguageByCharacters(text) {
        if (!text || text.trim().length === 0) return 'en';
        if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
        if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return 'ko';
        if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
        if (/[\u0400-\u04FF]/.test(text)) return 'ru';
        if (/[\u0600-\u06FF]/.test(text)) return 'ar';
        return null;
    }

    async detectLanguage(text) {
        const charLang = this.detectLanguageByCharacters(text);
        if (charLang) return charLang;

        if (!isConfigured || !comprehendClient) return 'en';
        try {
            const cmd = new DetectDominantLanguageCommand({ Text: text.substring(0, 300) });
            const res = await comprehendClient.send(cmd);
            const top = res.Languages?.sort((a, b) => b.Score - a.Score)[0];
            return top?.LanguageCode || 'en';
        } catch {
            return 'en';
        }
    }

    // ─── Header Translation ────────────────────────────────────────────────

    async translateHeaders(headers, sourceLang) {
        if (!ENABLE_AI || sourceLang === 'en' || !this._canTranslate()) {
            return Object.fromEntries(headers.map(h => [h, h]));
        }

        const prompt = `You are a professional translator for fleet management data.
Translate these column headers from ${sourceLang} to English.
Return ONLY a JSON object where keys are the original headers and values are the English translations.
Keep abbreviations, codes, and numbers unchanged.
Headers: ${JSON.stringify(headers)}`;

        try {
            const body = await this._invokeModel(prompt);
            const jsonMatch = body.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON object in response');
            const parsed = JSON.parse(jsonMatch[0]);
            // Ensure all headers are covered (fallback to original if missing)
            const result = {};
            headers.forEach(h => { result[h] = parsed[h] || h; });
            return result;
        } catch (err) {
            console.warn('Header translation failed:', err.message);
            return Object.fromEntries(headers.map(h => [h, h]));
        }
    }

    // ─── Selective Column Content Translation ──────────────────────────────

    /**
     * Translates only the values in the specified columns for each row.
     * Other columns are passed through unchanged.
     *
     * @param {Object[]} rows - Array of row objects keyed by original header
     * @param {string[]} translateColumns - Original header names to translate
     * @param {string} sourceLang - Source language code
     * @param {string} jobId - For SSE progress emission
     * @returns {Object[]} Rows with translated values in selected columns
     */
    async translateSelectiveColumns(rows, translateColumns, sourceLang, jobId) {
        if (!translateColumns || translateColumns.length === 0) return rows;
        if (!ENABLE_CONTENT || !ENABLE_AI || sourceLang === 'en' || !this._canTranslate()) {
            return rows;
        }

        const BATCH_SIZE = 25;
        const result = rows.map(r => ({ ...r }));
        const limit = pLimit(BEDROCK_CONCURRENCY);
        const totalBatches = Math.ceil(rows.length / BATCH_SIZE);
        let completedBatches = 0;

        const batchTasks = [];

        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batchStart = i;
            const batchEnd = Math.min(i + BATCH_SIZE, rows.length);

            batchTasks.push(limit(async () => {
                // Extract only translateColumns values from each row in this batch
                const subsets = [];
                const indices = [];

                for (let j = batchStart; j < batchEnd; j++) {
                    const subset = {};
                    translateColumns.forEach(col => {
                        const val = rows[j][col];
                        if (val !== null && val !== undefined) {
                            const str = String(val).trim();
                            // Skip pure numbers, dates, IDs — only translate text
                            if (str && !/^[\d.,\-\/:]+$/.test(str) && str.length > 1) {
                                subset[col] = str;
                            }
                        }
                    });
                    if (Object.keys(subset).length > 0) {
                        subsets.push(subset);
                        indices.push(j);
                    }
                }

                if (subsets.length > 0) {
                    try {
                        const translated = await this._translateBatch(subsets, sourceLang);
                        translated.forEach((translatedRow, idx) => {
                            if (indices[idx] !== undefined) {
                                Object.assign(result[indices[idx]], translatedRow);
                            }
                        });
                    } catch (err) {
                        console.error(`Batch translation error (rows ${batchStart}-${batchEnd}):`, err.message);
                        // Keep original values on error
                    }
                }

                completedBatches++;
                const progress = 25 + Math.round((completedBatches / totalBatches) * 55);
                translationProgress.emit(jobId, { phase: 'translating', progress });
            }));
        }

        await Promise.all(batchTasks);
        return result;
    }

    // ─── Internal helpers ─────────────────────────────────────────────────

    _canTranslate() {
        return isConfigured && bedrockClient && ENABLE_AI && !this._bedrockAccessDenied;
    }

    async _translateBatch(batchData, sourceLang) {
        const prompt = `You are a professional translator for fleet management data.
Translate the text values in this JSON array from ${sourceLang} to English.
RULES:
1. Return the EXACT same JSON structure and array length.
2. Translate only text values. Leave numbers, dates, IDs, and codes unchanged. For vehicle numbers that contain a place name prefix followed by a number (e.g. 東京-6150), translate the place name portion but keep the number (e.g. Tokyo-6150).
3. Output ONLY the raw JSON array — no markdown, no explanation.
Data: ${JSON.stringify(batchData)}`;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const body = await this._invokeModel(prompt);
                const jsonMatch = body.match(/\[[\s\S]*\]/);
                if (!jsonMatch) throw new Error('No JSON array in response');
                const parsed = JSON.parse(jsonMatch[0]);
                if (!Array.isArray(parsed) || parsed.length !== batchData.length) {
                    throw new Error('Array length mismatch in translation response');
                }
                return parsed;
            } catch (err) {
                if (attempt === 3) throw err;
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
            }
        }
    }

    async _invokeModel(prompt) {
        const command = new InvokeModelCommand({
            modelId: ACTIVE_MODEL,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        try {
            const response = await bedrockClient.send(command);
            const parsed = JSON.parse(Buffer.from(response.body).toString());
            return parsed.content[0].text.trim();
        } catch (err) {
            if (err.name === 'AccessDeniedException' || err.$metadata?.httpStatusCode === 403) {
                this._bedrockAccessDenied = true;
                console.error('❌ Bedrock access denied — AI translation disabled for this session');
            }
            throw err;
        }
    }
}

const translationService = new TranslationService();

module.exports = { translationService, translationProgress };
