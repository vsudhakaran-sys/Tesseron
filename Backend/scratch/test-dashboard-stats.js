require('dotenv').config();
const { pool } = require('../services/dataService');
async function test() {
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
            WHERE transaction_date IS NOT NULL OR \`year_month\` IS NOT NULL
        `),

        // Energy type breakdown
        pool.query(`
            SELECT
                COALESCE(energy_type, 'Unknown') AS energy_type,
                COUNT(*)                    AS transactions,
                COALESCE(SUM(COALESCE(net_base_value, 0) + COALESCE(net_purchase_value, 0)), 0) AS total_spend,
                COALESCE(SUM(quantity), 0)       AS total_quantity
            FROM fleetsync
            WHERE transaction_date IS NOT NULL OR \`year_month\` IS NOT NULL
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

    console.log('SUCCESS');
    console.log({
        totals: totalsRows[0],
        energyBreakdown: energyBreakdownRows,
        topVehicles: topVehiclesRows,
        topStations: topStationsRows,
        monthlyTrend: monthlyTrendRows.reverse(), // ascending order
        recentTransactions: recentTxnsRows,
        productGroupBreakdown: productGroupBreakdownRows,
    });
  } catch (err) {
    console.error('ERROR:', err);
  }
  process.exit();
}
test();
