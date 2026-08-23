//defino controlador para el manejo de CRUD
const detalleMovimientoCtrl = require('../controllers/detallemovimiento.controller');
//creamos el manejador de rutas
const express = require('express');
const requiereAdministrador = require('../middleware/auth.middleware');
const router = express.Router();
//definimos las rutas para la gestion de compra
router.get('/', requiereAdministrador, detalleMovimientoCtrl.getDetallesMovimiento);
router.post('/', requiereAdministrador, detalleMovimientoCtrl.createDetalleMovimiento);
router.get('/:id', requiereAdministrador, detalleMovimientoCtrl.getDetalleMovimiento);
router.put('/:id', requiereAdministrador, detalleMovimientoCtrl.editDetalleMovimiento);
router.delete('/:id', requiereAdministrador, detalleMovimientoCtrl.deleteDetalleMovimiento);
//exportamos el modulo de rutas
module.exports = router;