const gatoService = require('../services/gatoService');
const { validationResult } = require('express-validator');

module.exports = {
    getAll: async (req, res) => {
        const db = req.app.locals.db;
        const gatos = await gatoService.getAll(db);
        res.json(gatos);
    },
    getById: async (req, res) => {
        const db = req.app.locals.db;
        const gato = await gatoService.getById(db, req.params.id);
        res.json(gato);
    },
    create: async (req, res) => {
        const db = req.app.locals.db;
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            await gatoService.create(db, req.body);
            res.status(201).json({ message: 'Gatito registrado exitosamente' });
        } catch (error) {
            console.error('Error al registrar el gato:', error);
            res.status(500).json({ error: 'Error al registrar el gato', details: error.message });
        }
    },
    update: async (req, res) => {
        const db = req.app.locals.db;
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            await gatoService.update(db, req.params.id, req.body);
            res.status(200).json({});
        } catch (error) {
            console.error('Error al actualizar el gato:', error);
            res.status(500).json({ error: 'Error al actualizar el gato', details: error.message });
        }
    },
    remove: async (req, res) => {
        const db = req.app.locals.db;
        try {
            await gatoService.remove(db, req.params.id);
            res.status(204).json({});
        }
        catch (error) {
            console.error('Error al eliminar el gatito:', error);
            res.status(500).json({ error: 'Error al eliminar el gato', details: error.message });
        }
    }
};
