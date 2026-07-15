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

// Driver history for a vehicle, derived from trip records.
// Returns one row per driver who has driven this vehicle, with trip counts,
// total distance, and the date range they were active on it. The currently
// assigned driver (vehicles.assigned_driver_id) is flagged with is_active.
async function getDriverHistoryByVehicle(vehicleId) {
    const [rows] = await pool.query(
        `SELECT t.driver_id,
                d.name        AS driver_name,
                d.status      AS driver_status,
                COUNT(*)              AS trip_count,
                SUM(t.distance_km)    AS total_distance_km,
                MIN(t.trip_date)      AS first_trip_date,
                MAX(t.trip_date)      AS last_trip_date,
                (v.assigned_driver_id = t.driver_id) AS is_active
         FROM trips t
         JOIN vehicles v      ON v.vehicle_id = t.vehicle_id
         LEFT JOIN drivers d  ON d.driver_id = t.driver_id
         WHERE t.vehicle_id = ? AND t.driver_id IS NOT NULL
         GROUP BY t.driver_id, d.name, d.status, v.assigned_driver_id
         ORDER BY is_active DESC, last_trip_date DESC`,
        [vehicleId]
    );
    return rows;
}

module.exports = { getTripsByVehicle, getDriverHistoryByVehicle };
