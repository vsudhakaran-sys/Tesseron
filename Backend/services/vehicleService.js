const { pool } = require('./dataService');

// Columns client may write. vehicle_id is the PK (required on create).
const VEHICLE_COLUMNS = [
    'plate', 'make', 'model', 'year', 'type', 'status', 'odometer_km',
    'acquisition_date', 'last_service_date', 'last_service_odometer_km',
    'assigned_driver_id',
];

async function getAllVehicles() {
    const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY vehicle_id ASC');
    return rows;
}

async function getVehicleById(vehicleId) {
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
    return rows[0] || null;
}

async function createVehicle(data) {
    if (!data.vehicle_id) throw new Error('vehicle_id is required');

    const cols = ['vehicle_id'];
    const params = [data.vehicle_id];
    for (const col of VEHICLE_COLUMNS) {
        if (data[col] !== undefined) {
            cols.push(col);
            params.push(data[col] === '' ? null : data[col]);
        }
    }

    const placeholders = cols.map(() => '?').join(', ');
    const escapedCols = cols.map(c => `\`${c}\``).join(', ');
    await pool.query(`INSERT INTO vehicles (${escapedCols}) VALUES (${placeholders})`, params);
    return getVehicleById(data.vehicle_id);
}

async function updateVehicle(vehicleId, data) {
    const sets = [];
    const params = [];
    for (const col of VEHICLE_COLUMNS) {
        if (data[col] !== undefined) {
            sets.push(`\`${col}\` = ?`);
            params.push(data[col] === '' ? null : data[col]);
        }
    }
    if (sets.length === 0) return getVehicleById(vehicleId);

    params.push(vehicleId);
    await pool.query(`UPDATE vehicles SET ${sets.join(', ')} WHERE vehicle_id = ?`, params);
    return getVehicleById(vehicleId);
}

async function deleteVehicle(vehicleId) {
    const [result] = await pool.query('DELETE FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
    return result.affectedRows > 0;
}

module.exports = {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
};
