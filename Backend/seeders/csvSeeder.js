require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { pool } = require('../services/dataService');

const CSV_DIR = path.join(__dirname, '..', 'csv');
const SCHEMA_PATH = path.join(__dirname, '..', 'config', 'schema.sql');

// Table config: file -> { table, columns[], nullable[] }
// nullable: columns where empty string should become NULL (dates/numbers/optional FKs)
const TABLES = [
    {
        file: 'vehicles.csv',
        table: 'vehicles',
        columns: [
            'vehicle_id', 'plate', 'make', 'model', 'year', 'type', 'status',
            'odometer_km', 'acquisition_date', 'last_service_date',
            'last_service_odometer_km', 'assigned_driver_id',
        ],
        nullable: [
            'year', 'odometer_km', 'acquisition_date', 'last_service_date',
            'last_service_odometer_km', 'assigned_driver_id',
        ],
    },
    {
        file: 'drivers.csv',
        table: 'drivers',
        columns: [
            'driver_id', 'name', 'license_class', 'hire_date', 'status',
            'assigned_vehicle_id',
        ],
        nullable: ['hire_date', 'assigned_vehicle_id'],
    },
    {
        file: 'maintenance.csv',
        table: 'maintenance',
        columns: [
            'record_id', 'vehicle_id', 'service_date', 'odometer_km',
            'service_type', 'cost', 'notes',
        ],
        nullable: ['service_date', 'odometer_km', 'cost', 'notes'],
    },
    {
        file: 'trips.csv',
        table: 'trips',
        columns: [
            'trip_id', 'vehicle_id', 'driver_id', 'trip_date', 'origin',
            'destination', 'distance_km', 'duration_hr', 'fuel_liters',
            'fuel_cost', 'purpose',
        ],
        nullable: [
            'trip_date', 'distance_km', 'duration_hr', 'fuel_liters', 'fuel_cost',
        ],
    },
];

const BATCH_SIZE = 500;

function readCsv(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows))
            .on('error', reject);
    });
}

function toValues(row, cfg) {
    const nullSet = new Set(cfg.nullable);
    return cfg.columns.map((col) => {
        const v = row[col];
        if (v === undefined || v === '') {
            return nullSet.has(col) ? null : v === undefined ? null : '';
        }
        return v;
    });
}

async function runSchema(conn) {
    const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    // split on ; at end of statements; execute each non-empty statement
    const statements = sql
        .split(/;\s*$/m)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    for (const stmt of statements) {
        await conn.query(stmt);
    }
}

async function seedTable(conn, cfg) {
    const filePath = path.join(CSV_DIR, cfg.file);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Skip ${cfg.file} — not found`);
        return;
    }

    const rows = await readCsv(filePath);
    if (rows.length === 0) {
        console.warn(`⚠️  ${cfg.file} empty — skip`);
        return;
    }

    const colList = cfg.columns.map((c) => `\`${c}\``).join(', ');
    const updateList = cfg.columns
        .slice(1) // skip PK
        .map((c) => `\`${c}\` = VALUES(\`${c}\`)`)
        .join(', ');

    let inserted = 0;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const values = batch.map((r) => toValues(r, cfg));
        const placeholders = batch
            .map(() => `(${cfg.columns.map(() => '?').join(', ')})`)
            .join(', ');
        const flat = values.flat();

        await conn.query(
            `INSERT INTO \`${cfg.table}\` (${colList}) VALUES ${placeholders}
             ON DUPLICATE KEY UPDATE ${updateList}`,
            flat
        );
        inserted += batch.length;
    }

    console.log(`✅ ${cfg.table}: ${inserted} rows`);
}

async function main() {
    const conn = await pool.getConnection();
    try {
        console.log('🔧 Ensuring schema...');
        await runSchema(conn);

        // Order matters if FK constraints added later: vehicles/drivers first.
        for (const cfg of TABLES) {
            await seedTable(conn, cfg);
        }

        console.log('🌱 CSV seed complete');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding CSV:', err);
        process.exit(1);
    } finally {
        conn.release();
    }
}

main();
