const abonoCtrl = require('../controllers/abono.controller');
const express = require('express');
const requiereAdministrador = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', requiereAdministrador, abonoCtrl.getAbonos);
router.post('/', requiereAdministrador, abonoCtrl.createAbono);
router.get('/:id', requiereAdministrador, abonoCtrl.getAbono);
router.put('/:id', requiereAdministrador, abonoCtrl.editAbono);
router.delete('/:id', requiereAdministrador, abonoCtrl.deleteAbono);

module.exports = router;
