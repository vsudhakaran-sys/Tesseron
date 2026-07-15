const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} = require('../services/vehicleService');
const { getTripsByVehicle, getDriverHistoryByVehicle } = require('../services/tripService');
const { assignDriver, unassignDriver } = require('../services/driverService');

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

// GET /api/vehicles/:id/trips — trip history for a vehicle
router.get('/:id/trips', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 500);
        const trips = await getTripsByVehicle(req.params.id, limit);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/vehicles/:id/driver-history — drivers who have driven this vehicle
router.get('/:id/driver-history', async (req, res) => {
    try {
        const history = await getDriverHistoryByVehicle(req.params.id);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/vehicles/:id/assign — assign a driver (F2 rules enforced in service)
router.post('/:id/assign', async (req, res) => {
    try {
        const { driver_id } = req.body;
        if (!driver_id) return res.status(400).json({ error: 'driver_id is required' });
        const vehicle = await assignDriver(req.params.id, driver_id);
        res.json(vehicle);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
});

// POST /api/vehicles/:id/unassign — clear the current driver assignment
router.post('/:id/unassign', async (req, res) => {
    try {
        const vehicle = await unassignDriver(req.params.id);
        res.json(vehicle);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
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
