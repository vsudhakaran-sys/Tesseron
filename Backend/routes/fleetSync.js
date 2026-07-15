const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const upload = require('../middleware/upload');
const { translationService, translationProgress } = require('../services/translationService');
const { suggestMappings } = require('../services/mappingService');
const {
    readFullFile,
    applyMappings,
    storeFleetData,
    saveUploadHistory,
    updateUploadHistory,
    getHistory,
    getDrivers,
    getDriverById,
    getTripsByDriver,
    getMaintenance,
    getRecordsByUpload,
    exportUploadAsExcel,
} = require('../services/dataService');

// In-memory job store: jobId -> { filePath, detectedLang, filename, fileSize }
const activeJobs = new Map();

// ─── File structure extraction (preview only) ─────────────────────────────────

function analyzeExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const structure = {};
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
        if (data.length > 0) {
            structure[sheetName] = {
                headers: (data[0] || []).map(h => (h !== null ? String(h) : '')).filter(Boolean),
                rowCount: data.length - 1,
                sampleData: data.slice(1, 6),
            };
        }
    });
    return structure;
}

function analyzeCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        let headers = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', h => { headers = h; })
            .on('data', row => { if (rows.length < 5) rows.push(row); })
            .on('end', () => {
                resolve({
                    Sheet1: {
                        headers,
                        rowCount: rows.length,
                        sampleData: rows.map(r => headers.map(h => r[h])),
                    },
                });
            })
            .on('error', reject);
    });
}

function analyzeJSONFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : [data];
    const headers = arr.length > 0 ? Object.keys(arr[0]) : [];
    return {
        Sheet1: {
            headers,
            rowCount: arr.length,
            sampleData: arr.slice(0, 5).map(row => headers.map(h => row[h])),
        },
    };
}

async function extractFileStructure(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls') return analyzeExcelFile(filePath);
    if (ext === '.csv') return analyzeCSVFile(filePath);
    if (ext === '.json') return analyzeJSONFile(filePath);
    throw new Error(`Unsupported file type: ${ext}`);
}

// ─── POST /preview ────────────────────────────────────────────────────────────

router.post('/preview', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path: filePath, originalname, size } = req.file;
    const forceLang = req.body.language || null; // optional override
    const previewStart = Date.now();

    console.log(`[DEBUG][PREVIEW] ============================================================`);
    console.log(`[DEBUG][PREVIEW] STEP 1/5: File received`);
    console.log(`[DEBUG][PREVIEW]   file:      ${originalname}`);
    console.log(`[DEBUG][PREVIEW]   size:      ${(size / 1024).toFixed(1)} KB`);
    console.log(`[DEBUG][PREVIEW]   forceLang: ${forceLang || '(none)'}`);
    console.log(`[DEBUG][PREVIEW]   tempPath:  ${filePath}`);

    try {
        // 1. Extract structure
        const fileStructure = await extractFileStructure(filePath);

        console.log(`[DEBUG][PREVIEW] STEP 2/5: File structure extracted`);
        for (const [sheetName, sheet] of Object.entries(fileStructure)) {
            console.log(`[DEBUG][PREVIEW]   sheet "${sheetName}": ${sheet.rowCount} rows, ${sheet.headers.length} headers`);
            console.log(`[DEBUG][PREVIEW]   headers: ${JSON.stringify(sheet.headers)}`);
        }

        // 2. Detect language from first sheet headers
        const firstSheet = Object.values(fileStructure)[0];
        const sampleText = firstSheet ? firstSheet.headers.join(' ') : '';
        const detectedLang = forceLang || await translationService.detectLanguage(sampleText);

        console.log(`[DEBUG][PREVIEW] STEP 3/5: Language detected: "${detectedLang}" (sampleText: "${sampleText.substring(0, 80)}")`);

        // 3. Translate headers (if foreign language)
        let translatedHeaderMap = {};
        if (detectedLang !== 'en') {
            const allHeaders = Object.values(fileStructure).flatMap(s => s.headers);
            console.log(`[DEBUG][PREVIEW] STEP 4/5: Translating ${allHeaders.length} headers from "${detectedLang}" to English...`);
            translatedHeaderMap = await translationService.translateHeaders(allHeaders, detectedLang);
            const changedCount = Object.entries(translatedHeaderMap).filter(([k, v]) => k !== v).length;
            console.log(`[DEBUG][PREVIEW]   ${changedCount}/${allHeaders.length} headers changed by translation`);
        } else {
            console.log(`[DEBUG][PREVIEW] STEP 4/5: Skipping header translation (language is English)`);
        }

        // 4. Generate mapping suggestions
        const suggestions = suggestMappings(fileStructure, translatedHeaderMap, detectedLang);

        console.log(`[DEBUG][PREVIEW] STEP 5/5: Mapping suggestions generated`);
        for (const [sheetName, sheetSuggestions] of Object.entries(suggestions)) {
            const matched = Object.values(sheetSuggestions).filter(s => s.suggestedField).length;
            const total = Object.keys(sheetSuggestions).length;
            console.log(`[DEBUG][PREVIEW]   sheet "${sheetName}": ${matched}/${total} headers matched`);
            for (const [header, s] of Object.entries(sheetSuggestions)) {
                if (s.suggestedField) {
                    console.log(`[DEBUG][PREVIEW]     "${header}" -> "${s.suggestedField}" (${s.confidence}%${s.isForeignHeader ? ', via translation' : ''})`);
                } else {
                    console.log(`[DEBUG][PREVIEW]     "${header}" -> NO MATCH`);
                }
            }
        }

        // 5. Store job for process step
        const jobId = uuidv4();
        activeJobs.set(jobId, {
            filePath,
            detectedLang,
            filename: originalname,
            fileSize: size,
        });

        // Clean up old jobs (older than 2 hours)
        const TWO_HOURS = 2 * 60 * 60 * 1000;
        for (const [id, job] of activeJobs.entries()) {
            if (Date.now() - job.createdAt > TWO_HOURS) activeJobs.delete(id);
        }
        activeJobs.get(jobId).createdAt = Date.now();

        console.log(`[DEBUG][PREVIEW] DONE in ${Date.now() - previewStart}ms | jobId: ${jobId}`);
        console.log(`[DEBUG][PREVIEW] ============================================================`);

        res.json({
            jobId,
            detectedLang,
            fileStructure,
            translatedHeaderMap,
            suggestions,
        });
    } catch (err) {
        console.error(`[DEBUG][PREVIEW] ERROR after ${Date.now() - previewStart}ms:`, err.message);
        console.error(err.stack);
        // Clean up temp file on error
        fs.unlink(filePath, () => {});
        res.status(500).json({ error: err.message || 'Preview failed' });
    }
});

// ─── POST /process ────────────────────────────────────────────────────────────

router.post('/process', async (req, res) => {
    const { jobId, mappings, translateColumns = [], detectedLang, uploaderName = '', uploaderEmail = '' } = req.body;

    console.log(`[DEBUG][PROCESS] ============================================================`);
    console.log(`[DEBUG][PROCESS] STEP 1/7: Process request received`);
    console.log(`[DEBUG][PROCESS]   jobId:           ${jobId}`);
    console.log(`[DEBUG][PROCESS]   detectedLang:    ${detectedLang || '(none)'}`);
    console.log(`[DEBUG][PROCESS]   translateColumns: ${JSON.stringify(translateColumns)}`);
    console.log(`[DEBUG][PROCESS]   uploaderName:    ${uploaderName || '(none)'}`);
    console.log(`[DEBUG][PROCESS]   uploaderEmail:   ${uploaderEmail || '(none)'}`);
    console.log(`[DEBUG][PROCESS]   mappings:        ${JSON.stringify(mappings)}`);

    if (!jobId || !mappings) {
        console.warn(`[DEBUG][PROCESS] ERROR: Missing jobId or mappings — aborting`);
        return res.status(400).json({ error: 'jobId and mappings are required' });
    }

    const job = activeJobs.get(jobId);
    if (!job) {
        console.warn(`[DEBUG][PROCESS] ERROR: jobId "${jobId}" not found in activeJobs`);
        return res.status(404).json({ error: 'Job not found. Please re-upload the file.' });
    }

    const { filePath, filename, fileSize } = job;
    console.log(`[DEBUG][PROCESS]   filePath:        ${filePath}`);
    console.log(`[DEBUG][PROCESS]   filename:        ${filename}`);
    console.log(`[DEBUG][PROCESS]   fileSize:        ${(fileSize / 1024).toFixed(1)} KB`);

    // Immediately return so the client can connect to SSE
    res.json({ jobId, message: 'Processing started' });

    // ── Background processing ────────────────────────────────────────────────
    (async () => {
        let uploadRecord = null;
        const processStart = Date.now();

        const emit = (phase, progress, extra = {}) => {
            translationProgress.emit(jobId, { phase, progress, ...extra });
        };

        try {
            // STEP 2: Create pending upload_history record
            console.log(`[DEBUG][PROCESS] STEP 2/7: Creating upload_history record in DB`);
            uploadRecord = await saveUploadHistory({
                filename,
                status: 'Processing',
                records: 0,
                size_mb: parseFloat((fileSize / (1024 * 1024)).toFixed(3)),
                source: 'Manual',
                uploader_name: uploaderName,
                uploader_email: uploaderEmail,
            });
            console.log(`[DEBUG][PROCESS]   upload_history record created: id=${uploadRecord.id}`);

            emit('reading', 5);

            // STEP 3: Read full file
            console.log(`[DEBUG][PROCESS] STEP 3/7: Reading full file from disk: ${filePath}`);
            const readStart = Date.now();
            const fullFileData = await readFullFile(filePath);
            const totalRows = Object.values(fullFileData).reduce((sum, s) => sum + (s.rows ? s.rows.length : 0), 0);
            console.log(`[DEBUG][PROCESS]   File read in ${Date.now() - readStart}ms`);
            for (const [sheetName, sheetData] of Object.entries(fullFileData)) {
                console.log(`[DEBUG][PROCESS]   sheet "${sheetName}": ${sheetData.rows ? sheetData.rows.length : 0} rows, headers: ${JSON.stringify(sheetData.headers || [])}`);
            }
            console.log(`[DEBUG][PROCESS]   Total rows across all sheets: ${totalRows}`);
            emit('mapping', 15);

            // STEP 4: Apply field mappings + type casting
            console.log(`[DEBUG][PROCESS] STEP 4/7: Applying field mappings`);
            const mappingStart = Date.now();
            let records = applyMappings(fullFileData, mappings);
            console.log(`[DEBUG][PROCESS]   Mappings applied in ${Date.now() - mappingStart}ms — ${records.length} record(s) produced`);
            if (records.length > 0) {
                console.log(`[DEBUG][PROCESS]   Sample record[0]: ${JSON.stringify(records[0])}`);
            }
            emit('translating', 25);

            // STEP 5: Selective column content translation
            if (translateColumns.length > 0 && detectedLang && detectedLang !== 'en') {
                console.log(`[DEBUG][PROCESS] STEP 5/7: Translating column content`);
                console.log(`[DEBUG][PROCESS]   Columns to translate: ${JSON.stringify(translateColumns)}`);
                console.log(`[DEBUG][PROCESS]   Source language: "${detectedLang}"`);
                const xlateStart = Date.now();

                // Flatten all rows into a single array for translation, then split back
                const allRows = Object.values(fullFileData).flatMap(s => s.rows);
                console.log(`[DEBUG][PROCESS]   Total rows to translate: ${allRows.length}`);
                const translatedRows = await translationService.translateSelectiveColumns(
                    allRows,
                    translateColumns,
                    detectedLang,
                    jobId,
                );
                console.log(`[DEBUG][PROCESS]   Translation complete in ${Date.now() - xlateStart}ms — ${translatedRows.length} rows returned`);

                // Re-build fullFileData with translated rows, then re-apply mappings
                let rowIdx = 0;
                const translatedFileData = {};
                for (const [sheetName, sheetData] of Object.entries(fullFileData)) {
                    translatedFileData[sheetName] = {
                        ...sheetData,
                        rows: translatedRows.slice(rowIdx, rowIdx + sheetData.rows.length),
                    };
                    rowIdx += sheetData.rows.length;
                }
                console.log(`[DEBUG][PROCESS]   Re-applying mappings after translation`);
                records = applyMappings(translatedFileData, mappings);
                console.log(`[DEBUG][PROCESS]   Post-translation mapping: ${records.length} record(s)`);
            } else {
                console.log(`[DEBUG][PROCESS] STEP 5/7: Skipping column translation (translateColumns=${JSON.stringify(translateColumns)}, lang="${detectedLang}")`);
            }

            emit('inserting', 82);

            // STEP 6: Bulk insert into DB
            console.log(`[DEBUG][PROCESS] STEP 6/7: Bulk inserting ${records.length} record(s) into DB (uploadId=${uploadRecord.id})`);
            const insertStart = Date.now();
            const inserted = await storeFleetData(records, uploadRecord.id);
            console.log(`[DEBUG][PROCESS]   DB insert complete in ${Date.now() - insertStart}ms — ${inserted} row(s) stored`);

            // STEP 7: Update history record to Success
            console.log(`[DEBUG][PROCESS] STEP 7/7: Updating upload_history id=${uploadRecord.id} -> status=Success, records=${inserted}`);
            await updateUploadHistory(uploadRecord.id, {
                status: 'Success',
                records: inserted,
            });
            console.log(`[DEBUG][PROCESS]   upload_history updated`);

            // Clean up temp file
            fs.unlink(filePath, () => {});
            activeJobs.delete(jobId);

            const totalMs = Date.now() - processStart;
            console.log(`[DEBUG][PROCESS] DONE in ${totalMs}ms | uploadId=${uploadRecord.id} | inserted=${inserted}`);
            console.log(`[DEBUG][PROCESS] ============================================================`);

            emit('complete', 100, { uploadId: uploadRecord.id, totalRecords: inserted });

        } catch (err) {
            console.error(`[DEBUG][PROCESS] ERROR after ${Date.now() - processStart}ms:`, err.message);
            console.error(err.stack);
            if (uploadRecord) {
                await updateUploadHistory(uploadRecord.id, {
                    status: 'Failed',
                    error_message: err.message,
                }).catch(() => {});
                console.error(`[DEBUG][PROCESS]   upload_history id=${uploadRecord.id} marked as Failed`);
            }
            fs.unlink(filePath, () => {});
            activeJobs.delete(jobId);
            console.error(`[DEBUG][PROCESS] ============================================================`);
            translationProgress.emit(jobId, { phase: 'error', progress: 0, error: err.message });
        }
    })();
});

// ─── GET /progress/:jobId (SSE) ───────────────────────────────────────────────

router.get('/progress/:jobId', (req, res) => {
    const { jobId } = req.params;

    // SSE headers — disable Nginx buffering so events stream in real-time | params : jobId | returns : SSE stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send a heartbeat immediately
    res.write(`data: ${JSON.stringify({ phase: 'connected', progress: 0 })}\n\n`);

    const onProgress = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        if (data.phase === 'complete' || data.phase === 'error') {
            translationProgress.removeListener(jobId, onProgress);
            // Grace period to ensure the browser receives the final event before connection closes
            setTimeout(() => res.end(), 500);
        }
    };

    translationProgress.on(jobId, onProgress);

    req.on('close', () => {
        translationProgress.removeListener(jobId, onProgress);
    });
});

// ─── GET /dashboard-stats ─────────────────────────────────────────────────────

router.get('/dashboard-stats', async (_req, res) => {
    const { pool } = require('../services/dataService');
    try {
        const [
            [totalsRows],
            [energyBreakdownRows],
            [topVehiclesRows],
            [topStationsRows],
            [monthlyTrendRows],
            [recentTxnsRows],
            [productGroupBreakdownRows],
        ] = await Promise.all([
            // Overall KPIs
            pool.query(`
                SELECT
                    COUNT(*)                                                          AS total_transactions,
                    COUNT(DISTINCT vehicle_number)                                    AS unique_vehicles,
                    COUNT(DISTINCT station_name)                                      AS unique_stations,
                    COALESCE(SUM(COALESCE(net_base_value, 0) + COALESCE(net_purchase_value, 0)), 0) AS total_spend,
                    COALESCE(SUM(CASE WHEN unit = 'L' THEN quantity ELSE 0 END), 0) AS total_fuel_liters,
                    COALESCE(AVG(CASE WHEN unit = 'L' AND price_per_unit > 0 THEN price_per_unit END), 0) AS avg_price_per_liter,
                    COALESCE(SUM(CASE WHEN unit = 'KWH' THEN quantity ELSE 0 END), 0) AS total_kwh,
                    COALESCE(SUM(CASE WHEN odometer IS NOT NULL AND odometer > 0 THEN odometer ELSE 0 END), 0) AS total_odometer,
                    COALESCE(AVG(CASE WHEN distance_since_last_fill > 0 THEN distance_since_last_fill ELSE NULL END), 0) AS avg_distance_between_fills
                FROM fleetsync
                WHERE transaction_date IS NOT NULL OR year_month IS NOT NULL
            `),

            // Energy type breakdown
            pool.query(`
                SELECT
                    COALESCE(energy_type, 'Unknown') AS energy_type,
                    COUNT(*)                    AS transactions,
                    COALESCE(SUM(COALESCE(net_base_value, 0) + COALESCE(net_purchase_value, 0)), 0) AS total_spend,
                    COALESCE(SUM(quantity), 0)       AS total_quantity
                FROM fleetsync
                WHERE transaction_date IS NOT NULL OR year_month IS NOT NULL
                GROUP BY COALESCE(energy_type, 'Unknown')
                ORDER BY total_spend DESC
            `),

            // Top 8 vehicles by total spend
            pool.query(`
                SELECT
                    vehicle_number,
                    COUNT(*)                     AS transactions,
                    COALESCE(SUM(COALESCE(net_base_value, 0) + COALESCE(net_purchase_value, 0)), 0) AS total_spend,
                    COALESCE(SUM(CASE WHEN unit = 'L' THEN quantity ELSE 0 END), 0) AS total_liters,
                    COALESCE(SUM(CASE WHEN unit = 'KWH' THEN quantity ELSE 0 END), 0) AS total_kwh,
                    MAX(transaction_date)             AS last_transaction,
                    MAX(odometer)                     AS last_odometer,
                    COALESCE(AVG(CASE WHEN distance_since_last_fill > 0 THEN distance_since_last_fill ELSE NULL END), 0) AS avg_distance_fill
                FROM fleetsync
                WHERE vehicle_number IS NOT NULL
                GROUP BY vehicle_number
                ORDER BY total_spend DESC
                LIMIT 8
            `),

            // Top 5 stations by volume
            pool.query(`
                SELECT
                    station_name,
                    service_station_location AS location,
                    COUNT(*)            AS visits,
                    COALESCE(SUM(quantity), 0) AS total_quantity,
                    COALESCE(SUM(COALESCE(net_base_value, 0) + COALESCE(net_purchase_value, 0)), 0) AS total_spend
                FROM fleetsync
                WHERE station_name IS NOT NULL
                GROUP BY station_name, service_station_location
                ORDER BY total_spend DESC
                LIMIT 5
            `),

            // Monthly trend (last 30 billing dates)
            pool.query(`
                SELECT
                    DATE(billing_date) AS billing_date,
                    COUNT(*) AS transactions,
                    COALESCE(SUM(net_purchase_value), 0) AS net_purchase_value,
                    COALESCE(SUM(CASE WHEN unit = 'L' THEN quantity ELSE 0 END), 0) AS fuel_liters
                FROM fleetsync
                WHERE billing_date IS NOT NULL
                GROUP BY DATE(billing_date)
                ORDER BY DATE(billing_date) DESC
                LIMIT 30
            `),

            // Recent 5 transactions
            pool.query(`
                SELECT
                    vehicle_number, station_name, service_station_location,
                    transaction_date, transaction_time, energy_type,
                    product_type, quantity, unit, net_base_value, payment_currency,
                    odometer, distance_since_last_fill
                FROM fleetsync
                ORDER BY transaction_date IS NULL, transaction_date DESC, transaction_time IS NULL, transaction_time DESC
                LIMIT 5
            `),

            // Product group spend breakdown
            pool.query(`
                SELECT
                    COALESCE(product_group, 'Unknown') AS product_group,
                    COUNT(*)                      AS transactions,
                    COALESCE(SUM(COALESCE(net_base_value, 0) + COALESCE(net_purchase_value, 0)), 0) AS total_spend
                FROM fleetsync
                GROUP BY COALESCE(product_group, 'Unknown')
                ORDER BY total_spend DESC
                LIMIT 6
            `),
        ]);

        res.json({
            totals: totalsRows[0],
            energyBreakdown: energyBreakdownRows,
            topVehicles: topVehiclesRows,
            topStations: topStationsRows,
            monthlyTrend: monthlyTrendRows.reverse(), // ascending order
            recentTransactions: recentTxnsRows,
            productGroupBreakdown: productGroupBreakdownRows,
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /history ─────────────────────────────────────────────────────────────

router.get('/history', async (_req, res) => {
    try {
        const history = await getHistory();
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /drivers ─────────────────────────────────────────────────────────────

router.get('/drivers', async (_req, res) => {
    try {
        const drivers = await getDrivers();
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /drivers/:driverId ───────────────────────────────────────────────────

router.get('/drivers/:driverId', async (req, res) => {
    try {
        const driver = await getDriverById(req.params.driverId);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(driver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /drivers/:driverId/trips ─────────────────────────────────────────────

router.get('/drivers/:driverId/trips', async (req, res) => {
    try {
        const trips = await getTripsByDriver(req.params.driverId);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /maintenance ─────────────────────────────────────────────────────────

router.get('/maintenance', async (_req, res) => {
    try {
        const records = await getMaintenance();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /data/:uploadId ──────────────────────────────────────────────────────

router.get('/data/:uploadId', async (req, res) => {
    try {
        const records = await getRecordsByUpload(req.params.uploadId);
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /download/:uploadId ──────────────────────────────────────────────────

router.get('/download/:uploadId', async (req, res) => {
    try {
        const buffer = await exportUploadAsExcel(req.params.uploadId);
        if (!buffer) {
            return res.status(404).json({ error: 'No records found for this upload' });
        }
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="fleetsync-upload-${req.params.uploadId}.xlsx"`);
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
