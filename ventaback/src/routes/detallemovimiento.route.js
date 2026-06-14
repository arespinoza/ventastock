//defino controlador para el manejo de CRUD
const detalleMovimientoCtrl = require('../controllers/detallemovimiento.controller');
//creamos el manejador de rutas
const express = require('express');
const router = express.Router();
//definimos las rutas para la gestion de compra
router.get('/', detalleMovimientoCtrl.getDetallesMovimiento);
router.post('/', detalleMovimientoCtrl.createDetalleMovimiento);
router.get('/:id', detalleMovimientoCtrl.getDetalleMovimiento);
router.put('/:id', detalleMovimientoCtrl.editDetalleMovimiento);
router.delete('/:id', detalleMovimientoCtrl.deleteDetalleMovimiento);
//exportamos el modulo de rutas
module.exports = router;