require('dotenv').config();
const { pool } = require('../services/dataService');

async function test() {
  try {
    // 1. Total vs Active
    const [vehicles] = await pool.query('SELECT vehicle_id, status, assigned_driver_id, odometer_km, last_service_date, last_service_odometer_km, year, make, model, type FROM vehicles');
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'active').length;
    const activeWithDriver = vehicles.filter(v => v.status === 'active' && v.assigned_driver_id).length;
    const utilizationPct = totalVehicles ? (activeWithDriver / totalVehicles) * 100 : 0;

    // 2. Overdue Count (F3)
    let overdueCount = 0;
    const now = new Date('2026-07-24'); // Anchor to database max date
    vehicles.forEach(v => {
      if (!v.last_service_date || v.last_service_odometer_km === null) {
        overdueCount++;
        return;
      }
      const days = (now - new Date(v.last_service_date)) / (1000 * 60 * 60 * 24);
      const kmDiff = v.odometer_km - v.last_service_odometer_km;
      if (kmDiff > 10000 || days > 180) {
        overdueCount++;
      }
    });

    // 3. Top Cost Vehicles
    const [costs] = await pool.query(`
      SELECT 
        v.vehicle_id,
        v.plate,
        v.make,
        v.model,
        v.type,
        v.year,
        COALESCE(f.total_fuel_cost, 0) as fuel_cost,
        COALESCE(m.total_maint_cost, 0) as maint_cost
      FROM vehicles v
      LEFT JOIN (
        SELECT vehicle_id, SUM(fuel_cost) as total_fuel_cost 
        FROM trips 
        GROUP BY vehicle_id
      ) f ON f.vehicle_id = v.vehicle_id
      LEFT JOIN (
        SELECT vehicle_id, SUM(cost) as total_maint_cost 
        FROM maintenance 
        GROUP BY vehicle_id
      ) m ON m.vehicle_id = v.vehicle_id
    `);

    const processedCosts = costs.map(v => {
      const fuel = parseFloat(v.fuel_cost);
      const maint = parseFloat(v.maint_cost);
      
      // Heuristic additional costs based on type & year
      let insurance = 500;
      if (v.type === 'heavy_truck') insurance = 1500;
      else if (v.type === 'box_truck') insurance = 1000;
      else if (v.type === 'pickup') insurance = 700;

      let leasing = 2000;
      if (v.year > 2022) leasing = 4000;
      else if (v.year < 2018) leasing = 1000;

      let overheads = 300;

      const total = fuel + maint + insurance + leasing + overheads;
      return {
        vehicle_id: v.vehicle_id,
        plate: v.plate,
        make: v.make,
        model: v.model,
        type: v.type,
        fuel,
        maintenance: maint,
        insurance,
        leasing,
        overheads,
        total
      };
    });

    processedCosts.sort((a, b) => b.total - a.total);
    const top5HighestCost = processedCosts.slice(0, 5);

    // 4. Risk Scores
    const [tripsData] = await pool.query('SELECT vehicle_id, purpose FROM trips');
    const processedRisk = vehicles.map(v => {
      let mileageScore = 50;
      let timeScore = 50;

      if (v.last_service_date && v.last_service_odometer_km !== null) {
        const days = (now - new Date(v.last_service_date)) / (1000 * 60 * 60 * 24);
        const kmDiff = v.odometer_km - v.last_service_odometer_km;
        mileageScore = Math.min((kmDiff / 10000) * 50, 50);
        timeScore = Math.min((days / 180) * 50, 50);
      }

      const ageScore = Math.min((2026 - (v.year || 2020)) * 2, 10);
      const repairCount = tripsData.filter(t => t.vehicle_id === v.vehicle_id && t.purpose === 'service_run').length;
      const historyScore = Math.min(repairCount * 5, 15);

      const totalRisk = Math.min(Math.round(mileageScore + timeScore + ageScore + historyScore), 100);

      return {
        vehicle_id: v.vehicle_id,
        plate: v.plate || v.vehicle_id,
        make: v.make,
        model: v.model,
        riskScore: totalRisk,
        status: v.status
      };
    });

    processedRisk.sort((a, b) => b.riskScore - a.riskScore);

    console.log({
      kpiVehicles: {
        total: totalVehicles,
        active: activeVehicles,
        activeWithDriver,
        utilizationPct
      },
      overdueCount,
      top5HighestCost,
      top5Risk: processedRisk.slice(0, 5)
    });

  } catch (err) {
    console.error('ERROR:', err);
  }
  process.exit();
}
test();
