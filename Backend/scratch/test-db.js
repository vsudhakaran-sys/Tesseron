require('dotenv').config();
const { pool } = require('../services/dataService');
async function test() {
  try {
    const [tMax] = await pool.query('SELECT MAX(trip_date) as max_date FROM trips');
    const [mMax] = await pool.query('SELECT MAX(service_date) as max_date FROM maintenance');
    const [vMax] = await pool.query('SELECT MAX(last_service_date) as max_date FROM vehicles');
    console.log('Trips Max Date:', tMax[0]);
    console.log('Maintenance Max Date:', mMax[0]);
    console.log('Vehicles Max Date:', vMax[0]);
  } catch (err) {
    console.error('ERROR:', err);
  }
  process.exit();
}
test();
