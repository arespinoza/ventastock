const personaCtrl = require('../controllers/persona.controller');
const express = require('express');
const requiereAdministrador = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', requiereAdministrador, personaCtrl.getPersonas);
router.post('/', requiereAdministrador, personaCtrl.createPersona);
router.get('/:id', requiereAdministrador, personaCtrl.getPersona);
router.put('/:id', requiereAdministrador, personaCtrl.editPersona);
router.delete('/:id', requiereAdministrador, personaCtrl.deletePersona);

module.exports = router;