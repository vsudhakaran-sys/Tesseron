require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { getDrivers } = require('../services/dataService');

async function run() {
    try {
        console.log('Fetching drivers...');
        const drivers = await getDrivers();
        console.log('Success:', drivers);
    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

run();
