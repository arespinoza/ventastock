const express = require('express');
const categoriaCtrl = require('../controllers/categoria.controller');
const requiereAdministrador = require('../middleware/auth.middleware');

const router = express.Router();
router.get('/', requiereAdministrador, categoriaCtrl.getCategorias);
router.post('/', requiereAdministrador, categoriaCtrl.createCategoria);

module.exports = router;