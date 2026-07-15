const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { FLEETSYNC_FIELD_DEFINITIONS } = require('./mappingService');

const pool = mysql.createPool({
    host:             process.env.DB_HOST     || 'localhost',
    port:             parseInt(process.env.DB_PORT || '3306'),
    database:         process.env.DB_NAME,
    user:             process.env.DB_USER,
    password:         process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit:  10,
    queueLimit:       0,
});

// All fleetsync columns in DB order (matches your pgAdmin table)
const FLEETSYNC_COLUMNS = [
    'station_name', 'service_station_location', 'station_number', 'transaction_number',
    'service_country', 'cost_group', 'product_group', 'product_type', 'product_code',
    'payment_currency', 'unit', 'quantity', 'price_per_unit', 'net_base_value',
    'net_service_value', 'net_purchase_value', 'currency_of_service',
    'value_in_payment_currency', 'value_in_service_country_currency', 'vat',
    'price_per_unit_gross', 'net_discount', 'vehicle_number', 'billing_date',
    'bill_number', 'invoice_number', 'ticket_number_dkv', 'postcode_of_station',
    'gross_base_value', 'kostenstelle_1', 'kostenstelle_2', 'abrechnungsobjekt_nummer',
    'country_of_invoice', 'odometer', 'gross_discount', 'alter_terminal', 'client_number',
    'transaction_date', 'transaction_time', 'distance_since_last_fill', 'year_month',
    'energy_type',
];

// ─── Date Parsing ─────────────────────────────────────────────────────────────

function parseFleetDate(dateStr) {
    if (dateStr === null || dateStr === undefined || dateStr === '') return null;
    if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

    const str = String(dateStr).trim();

    // DD/MM/YYYY
    const ddmmyyyy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
        const d = new Date(parseInt(ddmmyyyy[3]), parseInt(ddmmyyyy[2]) - 1, parseInt(ddmmyyyy[1]));
        return isNaN(d.getTime()) ? null : d;
    }

    // YYYY-MM-DD (ISO date part only)
    const isoDate = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoDate) {
        const d = new Date(parseInt(isoDate[1]), parseInt(isoDate[2]) - 1, parseInt(isoDate[3]));
        return isNaN(d.getTime()) ? null : d;
    }

    // DD.MM.YYYY (German)
    const ddmmyyyy_dot = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (ddmmyyyy_dot) {
        const d = new Date(parseInt(ddmmyyyy_dot[3]), parseInt(ddmmyyyy_dot[2]) - 1, parseInt(ddmmyyyy_dot[1]));
        return isNaN(d.getTime()) ? null : d;
    }

    // Excel serial number
    if (!isNaN(str) && str.length <= 6 && /^\d+$/.test(str)) {
        const serial = parseInt(str);
        if (serial > 1000 && serial < 100000) {
            const d = new Date((serial - 25569) * 86400 * 1000);
            if (!isNaN(d.getTime())) return d;
        }
    }

    // Fallback: try raw Date constructor (handles ISO T-strings like "2026-03-21T18:00:00Z")
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
}

function deriveYearMonth(date) {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function parseNumber(val) {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') return val;
    
    let s = String(val).trim();
    // 1. Remove currency symbols and other non-numeric text, but keep signs, digits, and separators
    s = s.replace(/[^0-9,.\-+]/g, '');
    
    // 2. Guess decimal vs thousands separators
    const hasComma = s.includes(',');
    const hasDot = s.includes('.');

    if (hasComma && hasDot) {
        if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
            // "1.234,56" style (European)
            s = s.replace(/\./g, '').replace(',', '.');
        } else {
            // "1,234.56" style (US/UK)
            s = s.replace(/,/g, '');
        }
    } else if (hasComma) {
        // Only commas. If it's something like "1,234", is it 1234 or 1.234?
        // Most common for fuel data is "123,45" -> 123.45
        // If there's only one comma, we treat it as a decimal point.
        s = s.replace(',', '.');
    }
    
    const num = parseFloat(s);
    return isNaN(num) ? null : num;
}

function normalizeEnergyType(val) {
    if (!val) return 'Unknown';
    const s = String(val).toLowerCase().trim();
    
    // Electric variants
    if (s.includes('electric') || s.includes('elektro') || s.includes('kwh') || s.includes('charging') || s.includes('ev')) {
        return 'Electric';
    }
    
    // Fuel variants (Diesel, Petrol, etc. mapped to Fuel for dashboard consistency)
    if (s.includes('fuel') || s.includes('diesel') || s.includes('petrol') || s.includes('benzin') || s.includes('gas') || s.includes('kraftstoff') || s.includes('otto')) {
        return 'Fuel';
    }
    
    // Service variants
    if (s.includes('service') || s.includes('wash') || s.includes('shop') || s.includes('toll') || s.includes('parking') || s.includes('adblue')) {
        return 'Service';
    }
    
    return 'Unknown';
}

function validateCurrency(val) {
    if (!val) return 'EUR';
    const s = String(val).toUpperCase().trim();
    // Only allow valid 3-letter ISO codes, otherwise fallback to EUR
    return /^[A-Z]{3}$/.test(s) ? s : 'EUR';
}

function parseFleetTime(timeVal) {
    if (timeVal === null || timeVal === undefined || timeVal === '') return null;

    const str = String(timeVal).trim();

    // Already in HH:MM:SS or HH:MM format
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
        return str;
    }

    // Excel time format: decimal between 0 and 1 (or slightly higher)
    const num = parseFloat(str);
    if (!isNaN(num) && num >= 0 && num <= 1.5) {
        const hours = Math.floor(num * 24);
        const minutes = Math.floor((num * 24 - hours) * 60);
        const seconds = Math.floor(((num * 24 - hours) * 60 - minutes) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Try parsing as string time-like value
    return null;
}

// ─── File Reading ─────────────────────────────────────────────────────────────

function readFullExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
        if (!data || data.length < 2) return;
        const headers = (data[0] || []).map(h => (h !== null ? String(h) : ''));
        const rows = data.slice(1).map(row => {
            const obj = {};
            headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? row[i] : null; });
            return obj;
        });
        result[sheetName] = { headers, rows };
    });
    return result;
}

function readFullCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        let headers = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', h => { headers = h; })
            .on('data', row => rows.push(row))
            .on('end', () => resolve({ Sheet1: { headers, rows } }))
            .on('error', reject);
    });
}

function readFullJSONFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    const data = Array.isArray(parsed) ? parsed : [parsed];
    if (data.length === 0) return { Sheet1: { headers: [], rows: [] } };
    const headers = Object.keys(data[0]);
    return { Sheet1: { headers, rows: data } };
}

async function readFullFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls') return readFullExcelFile(filePath);
    if (ext === '.csv') return readFullCSVFile(filePath);
    if (ext === '.json') return readFullJSONFile(filePath);
    throw new Error(`Unsupported file type: ${ext}`);
}

// ─── Row Mapping ──────────────────────────────────────────────────────────────

function applyMappings(fullFileData, mappings) {
    const records = [];

    for (const [sheetName, sheetData] of Object.entries(fullFileData)) {
        const sheetMappings = mappings[sheetName] || {};

        for (const row of sheetData.rows) {
            // Skip ghost rows that contain no actual data before any transformations | params : row | returns : void
            const hasRawData = Object.values(row).some(v => v !== null && v !== undefined && String(v).trim() !== '');
            if (!hasRawData) continue;

            const record = {};

            for (const [header, rawValue] of Object.entries(row)) {
                const mapping = sheetMappings[header];
                if (!mapping || !mapping.dbField) continue;

                const dbField = mapping.dbField;
                const fieldDef = FLEETSYNC_FIELD_DEFINITIONS[dbField];
                if (!fieldDef) continue;

                if (fieldDef.type === 'number') {
                    record[dbField] = parseNumber(rawValue);
                } else if (fieldDef.type === 'date') {
                    record[dbField] = parseFleetDate(rawValue);
                    if (dbField === 'transaction_date') {
                        record.year_month = deriveYearMonth(record[dbField]);
                    }
                } else if (dbField === 'transaction_time') {
                    record[dbField] = parseFleetTime(rawValue);
                } else if (dbField === 'energy_type') {
                    record[dbField] = normalizeEnergyType(rawValue);
                } else if (dbField === 'payment_currency') {
                    record[dbField] = validateCurrency(rawValue);
                } else if (dbField === 'year_month') {
                    // rawValue may be an Excel serial date number — convert via parseFleetDate
                    const parsed = parseFleetDate(rawValue);
                    record[dbField] = parsed ? deriveYearMonth(parsed) : (rawValue !== null && rawValue !== undefined ? String(rawValue).trim() || null : null);
                } else {
                    record[dbField] = rawValue !== null && rawValue !== undefined
                        ? String(rawValue).trim() || null
                        : null;
                }
            }

            if (record.transaction_date && !record.year_month) {
                record.year_month = deriveYearMonth(record.transaction_date);
            }

            // Skip entirely empty rows — only push if at least one mapped value is non-null | params : record | returns : void
            const hasData = Object.values(record).some(v => v !== null && v !== undefined && v !== '');
            if (Object.keys(record).length > 0 && hasData) records.push(record);
        }
    }

    return records;
}

// ─── DB Operations ────────────────────────────────────────────────────────────

const CHUNK_SIZE = 500;
const ALL_INSERT_COLS = ['upload_id', ...FLEETSYNC_COLUMNS];

async function storeFleetData(records, uploadId) {
    if (records.length === 0) return 0;

    const connection = await pool.getConnection();
    let inserted = 0;

    try {
        await connection.beginTransaction();

        for (let i = 0; i < records.length; i += CHUNK_SIZE) {
            const chunk = records.slice(i, i + CHUNK_SIZE);
            const valuePlaceholders = [];
            const params = [];

            for (const record of chunk) {
                const rowPlaceholders = ALL_INSERT_COLS.map(() => '?').join(', ');
                valuePlaceholders.push(`(${rowPlaceholders})`);
                ALL_INSERT_COLS.forEach(col => {
                    params.push(col === 'upload_id' ? uploadId : (record[col] ?? null));
                });
            }

            const escapedCols = ALL_INSERT_COLS.map(col => `\`${col}\``).join(', ');
            await connection.query(
                `INSERT INTO fleetsync (${escapedCols}) VALUES ${valuePlaceholders.join(', ')}`,
                params
            );
            inserted += chunk.length;
        }

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }

    return inserted;
}

async function saveUploadHistory(meta) {
    const { filename, status, records, size_mb, source, uploader_name, uploader_email } = meta;
    const [result] = await pool.query(
        `INSERT INTO upload_history (filename, status, records, size_mb, source, uploader_name, uploader_email)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [filename, status, records || 0, size_mb || 0, source || 'Manual', uploader_name || '', uploader_email || '']
    );
    const [rows] = await pool.query('SELECT * FROM upload_history WHERE id = ?', [result.insertId]);
    return rows[0];
}

async function updateUploadHistory(id, data) {
    const keys = Object.keys(data);
    const sets = keys.map((k, i) => `${k} = ?`).join(', ');
    await pool.query(
        `UPDATE upload_history SET ${sets} WHERE id = ?`,
        [...Object.values(data), id]
    );
    const [rows] = await pool.query('SELECT * FROM upload_history WHERE id = ?', [id]);
    return rows[0];
}

async function getHistory() {
    const [rows] = await pool.query('SELECT * FROM upload_history ORDER BY created_at DESC');
    return rows;
}

async function getDrivers() {
    const [rows] = await pool.query(`
        SELECT d.*,
               v.plate AS vehicle_plate,
               v.make  AS vehicle_make,
               v.model AS vehicle_model
        FROM drivers d
        LEFT JOIN vehicles v ON v.vehicle_id = d.assigned_vehicle_id
        ORDER BY d.driver_id ASC
    `);
    return rows;
}

async function getDriverById(driverId) {
    const [rows] = await pool.query(
        `SELECT d.*,
                v.plate AS vehicle_plate,
                v.make  AS vehicle_make,
                v.model AS vehicle_model,
                v.year  AS vehicle_year,
                v.type  AS vehicle_type,
                v.status AS vehicle_status,
                v.odometer_km AS vehicle_odometer_km
         FROM drivers d
         LEFT JOIN vehicles v ON v.vehicle_id = d.assigned_vehicle_id
         WHERE d.driver_id = ?`,
        [driverId]
    );
    return rows[0] || null;
}

async function getMaintenance() {
    const [rows] = await pool.query(`
        SELECT m.*,
               v.plate AS vehicle_plate,
               v.make  AS vehicle_make,
               v.model AS vehicle_model,
               v.odometer_km AS vehicle_odometer,
               v.last_service_date AS vehicle_last_service_date,
               v.last_service_odometer_km AS vehicle_last_service_odometer
        FROM maintenance m
        LEFT JOIN vehicles v ON v.vehicle_id = m.vehicle_id
        ORDER BY m.service_date DESC
    `);
    return rows;
}

async function getTripsByDriver(driverId) {
    const [rows] = await pool.query(
        `SELECT * FROM trips WHERE driver_id = ? ORDER BY trip_date DESC`,
        [driverId]
    );
    return rows;
}

async function getRecordsByUpload(uploadId) {
    const [rows] = await pool.query(
        'SELECT * FROM fleetsync WHERE upload_id = ? ORDER BY id ASC',
        [parseInt(uploadId)]
    );
    return rows;
}

async function deleteRecordsByUpload(uploadId) {
    await pool.query('DELETE FROM fleetsync WHERE upload_id = ?', [parseInt(uploadId)]);
}

async function exportUploadAsExcel(uploadId) {
    const records = await getRecordsByUpload(uploadId);
    if (records.length === 0) return null;

    const exportData = records.map(r => {
        const { id, upload_id, created_at, ...rest } = r;
        return rest;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FleetSync Data');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = {
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
    deleteRecordsByUpload,
    exportUploadAsExcel,
    parseFleetDate,
    parseFleetTime,
    parseNumber,
    pool,
};
