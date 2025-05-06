const propietarioService = require('../services/propietarioService');
const { validationResult } = require('express-validator');

module.exports = {
    getAll: async (req, res) => {
        const db = req.app.locals.db;
        const propietarios = await propietarioService.getAll(db);
        res.json(propietarios);
    },

    getById: async (req, res) => {
        const db = req.app.locals.db;
        const propietarios = await propietarioService.getById(db, req.params.id);
        res.json(propietarios);
    },

   /* getByNickname: async (req, res) => {
        const db = req.app.locals.db;
        const propietarios = await propietarioService.getByNickname(db, req.params.nickname);
        res.json(propietarios);
    }, */

    getByNickname: async (req, res) => {
        const db = req.app.locals.db;
        const propietario = await propietarioService.getByNickname(db, req.params.nickname);
    
        if (propietario === null) {
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }
    
        res.json({ propietario });
    },
    

    create: async (req, res) => {
        const db = req.app.locals.db;
        try {
                //Verifico si hay errores de validación
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
        
                //Operación para dar de alta propietarios en la BBDD
                await propietarioService.create(db, req.body);
                res.status(201).json({ message: 'Te has registrado exitosamente' }); //Respuesta exitosa
            } catch (error) {
                console.error('Error de registro:', error); // Log del error en la consola
                res.status(500).json({ error: 'Ocurrió un error al registrar', details: error.message }); //Respuesta con error
            }
    },

    update: async (req, res) => {
        const db = req.app.locals.db;
        try {
                //Verifico si hay errores de validación
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                await propietarioService.update(db, req.params.id, req.body);
                res.status(200).json({});
        
            } catch (error) {
                console.error('Error de registro:', error); // Log del error en la consola
                res.status(500).json({ error: 'Ocurrió un error al registrar', details: error.message }); //Respuesta con error
            }
    },

    remove: async (req, res) => {
        const db = req.app.locals.db;
    try {
        await propietarioService.remove(db, req.params.id);
        res.status(204).json({});
    }
    catch (error) {
        console.error('Error al eliminar el propietario:', error);
        res.status(500).json({ error: 'Error al eliminar el propietario', details: error.message });
    }
        
    },

    getGatos: async (req, res) => {
        const db = req.app.locals.db;
        await propietarioService.getGatos(db, req.params.id);
        const gatos = await propietarioService.getGatos(db, req.params.id);
        res.json(gatos);
    }

}