require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../services/dataService');

async function seedUser() {
    const name = 'Admin User1';
    const email = 'admin@TESSERON.com';
    const password = 'z&t27!E7k5vjnzyy';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure users table exists (simple check/creation if needed, 
        // but user says we use postgres and database name is fleetsync, 
        // assuming table structure from image is already there)

        await pool.query(`
            INSERT INTO users (name, email, password, created_at)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
                name = VALUES(name), 
                password = VALUES(password)
        `, [name, email, hashedPassword]);

        console.log('✅ User seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding user:', err);
        process.exit(1);
    }
}

seedUser();


