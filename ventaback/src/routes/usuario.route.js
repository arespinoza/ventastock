const express = require('express');
const usuarioCtrl = require('../controllers/usuario.controller');

const router = express.Router();
router.post('/login', usuarioCtrl.login);

module.exports = router;