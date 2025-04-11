const express = require('express');
const { check, validationResult } = require('express-validator');
const propietarioController = require('../controllers/propietarioController')

const router = express.Router();

router.get('/', propietarioController.getAll);
router.get('/:id', propietarioController.getById);
router.get('/buscar/:nickname', propietarioController.getByNickname);
router.post('/', [check('nickname').notEmpty().withMessage('El nickname del usuario es obligatorio')], propietarioController.create);
router.put('/:id', [check('nickname').notEmpty().withMessage('El nickname del usuario es obligatorio')], propietarioController.update);
router.delete('/:id', propietarioController.remove);
router.get('/:id/gatos', propietarioController.getGatos); //Operación para ver los gatos de un propietario

module.exports = router;