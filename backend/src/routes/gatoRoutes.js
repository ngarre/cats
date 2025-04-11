const express = require('express');
const { check } = require('express-validator');
const gatoController = require('../controllers/gatoController');

const router = express.Router();

router.get('/', gatoController.getAll);
router.get('/:id', gatoController.getById);
router.post('/', [check('nombre').notEmpty().withMessage('El nombre del gatito es obligatorio')], gatoController.create);
router.put('/:id', [check('nombre').notEmpty().withMessage('El nombre del gatito es obligatorio')], gatoController.update);
router.delete('/:id', gatoController.remove);

module.exports = router;
