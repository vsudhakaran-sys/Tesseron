const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} = require('../services/vehicleService');

// GET /api/vehicles — list all
router.get('/', async (_req, res) => {
    try {
        const vehicles = await getAllVehicles();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/vehicles/:id — single
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await getVehicleById(req.params.id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/vehicles — create
router.post('/', async (req, res) => {
    try {
        const vehicle = await createVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Vehicle with this ID already exists' });
        }
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/vehicles/:id — update
router.put('/:id', async (req, res) => {
    try {
        const existing = await getVehicleById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Vehicle not found' });
        const vehicle = await updateVehicle(req.params.id, req.body);
        res.json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/vehicles/:id — delete
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await deleteVehicle(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
