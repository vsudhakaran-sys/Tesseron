const { pool } = require('./dataService');

async function getAllDrivers() {
    const [rows] = await pool.query('SELECT * FROM drivers ORDER BY driver_id ASC');
    return rows;
}

async function getDriverById(driverId) {
    const [rows] = await pool.query('SELECT * FROM drivers WHERE driver_id = ?', [driverId]);
    return rows[0] || null;
}

// F2: only `active` drivers with no vehicle can be newly assigned.
async function getAssignableDrivers() {
    const [rows] = await pool.query(
        `SELECT * FROM drivers
         WHERE status = 'active' AND (assigned_vehicle_id IS NULL OR assigned_vehicle_id = '')
         ORDER BY driver_id ASC`
    );
    return rows;
}

// F2 assignment rule. Enforced in a transaction so both FK columns stay in sync:
//   - driver ≤ 1 vehicle, vehicle ≤ 1 driver
//   - only active drivers + active vehicles can be newly assigned
//   - prevents double-assignment
async function assignDriver(vehicleId, driverId) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Lock both rows for the duration of the check-then-write.
        const [[vehicle]] = await conn.query('SELECT * FROM vehicles WHERE vehicle_id = ? FOR UPDATE', [vehicleId]);
        const [[driver]] = await conn.query('SELECT * FROM drivers WHERE driver_id = ? FOR UPDATE', [driverId]);

        if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 });
        if (!driver) throw Object.assign(new Error('Driver not found'), { status: 404 });

        if (vehicle.status !== 'active') {
            throw Object.assign(new Error('Only active vehicles can be assigned a driver'), { status: 409 });
        }
        if (driver.status !== 'active') {
            throw Object.assign(new Error('Only active drivers can be assigned'), { status: 409 });
        }
        if (vehicle.assigned_driver_id) {
            throw Object.assign(new Error('Vehicle already has an assigned driver'), { status: 409 });
        }
        if (driver.assigned_vehicle_id) {
            throw Object.assign(new Error('Driver is already assigned to a vehicle'), { status: 409 });
        }

        await conn.query('UPDATE vehicles SET assigned_driver_id = ? WHERE vehicle_id = ?', [driverId, vehicleId]);
        await conn.query('UPDATE drivers SET assigned_vehicle_id = ? WHERE driver_id = ?', [vehicleId, driverId]);

        await conn.commit();
        const [[updated]] = await conn.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
        return updated;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

// Clear the assignment on both sides.
async function unassignDriver(vehicleId) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [[vehicle]] = await conn.query('SELECT * FROM vehicles WHERE vehicle_id = ? FOR UPDATE', [vehicleId]);
        if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 });

        const driverId = vehicle.assigned_driver_id;
        await conn.query('UPDATE vehicles SET assigned_driver_id = NULL WHERE vehicle_id = ?', [vehicleId]);
        if (driverId) {
            await conn.query('UPDATE drivers SET assigned_vehicle_id = NULL WHERE driver_id = ?', [driverId]);
        }

        await conn.commit();
        const [[updated]] = await conn.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [vehicleId]);
        return updated;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = {
    getAllDrivers,
    getDriverById,
    getAssignableDrivers,
    assignDriver,
    unassignDriver,
};
