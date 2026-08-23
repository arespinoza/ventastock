//defino controlador para el manejo de CRUD
const productoCtrl = require('./../../src/controllers/producto.controller');
//creamos el manejador de rutas
const express = require('express');
const requiereAdministrador = require('../middleware/auth.middleware');
const router = express.Router();
//definimos las rutas para la gestion de producto
router.get('/', productoCtrl.getProductos);
router.post('/', requiereAdministrador, productoCtrl.createProducto);
router.get('/:id', requiereAdministrador, productoCtrl.getProducto);
router.put('/:id', requiereAdministrador, productoCtrl.editProducto);
router.delete('/:id', requiereAdministrador, productoCtrl.deleteProducto);
//exportamos el modulo de rutas
module.exports = router;