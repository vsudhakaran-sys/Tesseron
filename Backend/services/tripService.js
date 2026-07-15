const { pool } = require('./dataService');

// Trips for a vehicle, most recent first.
async function getTripsByVehicle(vehicleId, limit = 50) {
    const [rows] = await pool.query(
        `SELECT trip_id, vehicle_id, driver_id, trip_date, origin, destination,
                distance_km, duration_hr, fuel_liters, fuel_cost, purpose
         FROM trips
         WHERE vehicle_id = ?
         ORDER BY trip_date DESC, trip_id DESC
         LIMIT ?`,
        [vehicleId, Number(limit)]
    );
    return rows;
}

module.exports = { getTripsByVehicle };
