const express = require('express');
const router = express.Router();
const {
    getAllDrivers,
    getDriverById,
    getAssignableDrivers,
} = require('../services/driverService');

// GET /api/drivers — list all
router.get('/', async (_req, res) => {
    try {
        res.json(await getAllDrivers());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/drivers/assignable — active drivers with no vehicle (F2)
router.get('/assignable', async (_req, res) => {
    try {
        res.json(await getAssignableDrivers());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/drivers/:id — single
router.get('/:id', async (req, res) => {
    try {
        const driver = await getDriverById(req.params.id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        res.json(driver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
