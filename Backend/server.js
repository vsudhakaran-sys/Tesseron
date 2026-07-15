require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fleetSyncRoutes = require('./routes/fleetSync');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/fleetsync', fleetSyncRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, async () => {
    console.log(`TESSERON backend running on ${PORT}`);

    const mysql = require('mysql2/promise');
    try {
        const tempConn = await mysql.createConnection({
            host:     process.env.DB_HOST     || 'localhost',
            port:     parseInt(process.env.DB_PORT || '3306'),
            user:     process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'fleetsync'}\``);
        await tempConn.end();
        console.log(`✅ Database ${process.env.DB_NAME || 'fleetsync'} verified/created`);

        const fs = require('fs');
        const schemaPath = path.join(__dirname, 'config', 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            const statements = schemaSql
                .split(/;(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/)
                .map(s => s.trim())
                .filter(s => s.length > 0);
            
            const dbConn = await mysql.createConnection({
                host:     process.env.DB_HOST     || 'localhost',
                port:     parseInt(process.env.DB_PORT || '3306'),
                user:     process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME || 'fleetsync',
            });
            for (const statement of statements) {
                await dbConn.query(statement);
            }
            await dbConn.end();
            console.log(`✅ Database tables verified/created`);
        }
    } catch (err) {
        console.error(`❌ Database setup/verification failed: ${err.message}`);
    }

    const { pool } = require('./services/dataService');
    try {
        const [rows] = await pool.query('SELECT DATABASE() AS db, CURRENT_USER() AS user, VERSION() AS ver');
        console.log(`✅ DB connected — database: ${rows[0].db}, user: ${rows[0].user}, version: ${rows[0].ver}`);
    } catch (err) {
        console.error(`❌ DB connection failed: ${err.message}`);
    }
});

module.exports = app;


