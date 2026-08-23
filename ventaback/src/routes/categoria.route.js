const express = require('express');
const categoriaCtrl = require('../controllers/categoria.controller');
const requiereAdministrador = require('../middleware/auth.middleware');

const router = express.Router();
router.get('/', categoriaCtrl.getCategorias);
router.post('/', categoriaCtrl.createCategoria);

module.exports = router;