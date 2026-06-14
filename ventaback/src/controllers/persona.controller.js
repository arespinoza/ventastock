const Persona = require('../models/persona.model');
const personaCtrl = {};
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Obtener todas las personas
personaCtrl.getPersonas = async (req, res) => {
  const criteria = {};
  // Example for filtering by attributes (e.g., dni, apellido) - adjust as needed
  if (req.query.dni) {
    criteria.where = {
      dni: {
        [Op.like]: `%${req.query.dni}%`
      }
    };
  }
  if (req.query.apellido) {
    criteria.where = {
      apellido: {
        [Op.like]: `%${req.query.apellido}%`
      }
    };
  }

  try {
    const personas = await Persona.findAll(criteria);
    res.json(personas);
  } catch (error) {
    console.error('Error al obtener las personas:', error);
    res.status(500).json({ status: '0', msg: 'Error al obtener las personas.', error: error.message });
  }
};

// Crear una nueva persona
personaCtrl.createPersona = async (req, res) => {
  try {
    await Persona.create(req.body);
    res.json({ status: '1', msg: 'Persona guardada.' });
  } catch (error) {
    console.error('Error al crear la persona:', error);
    res.status(400).json({ status: '0', msg: 'Error procesando operacion al crear persona.', error: error.message });
  }
};

// Obtener una persona por ID
personaCtrl.getPersona = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) {
      return res.status(404).json({ status: '0', msg: 'Persona no encontrada.' });
    }
    res.json(persona);
  } catch (error) {
    console.error('Error al obtener la persona:', error);
    res.status(500).json({ status: '0', msg: 'Error al obtener la persona.', error: error.message });
  }
};

// Editar una persona
personaCtrl.editPersona = async (req, res) => {
  try {
    const [updatedRows] = await Persona.update(req.body, {
      where: { id_persona: req.body.id_persona } // Use id_persona as primary key
    });

    if (updatedRows === 0) {
      return res.status(404).json({ status: '0', msg: 'Persona no encontrada o no hubo cambios.' });
    }
    res.json({ status: '1', msg: 'Persona actualizada.' });
  } catch (error) {
    console.error('Error al editar la persona:', error);
    res.status(400).json({ status: '0', msg: 'Error procesando la operacion al editar persona.', error: error.message });
  }
};

// Eliminar una persona
personaCtrl.deletePersona = async (req, res) => {
  try {
    const deletedRows = await Persona.destroy({
      where: { id_persona: req.params.id } // Use id_persona as primary key
    });

    if (deletedRows === 0) {
      return res.status(404).json({ status: '0', msg: 'Persona no encontrada.' });
    }
    res.json({ status: '1', msg: 'Persona eliminada.' });
  } catch (error) {
    console.error('Error al eliminar la persona:', error);
    res.status(400).json({ status: '0', msg: 'Error procesando la operacion al eliminar persona.', error: error.message });
  }
};

module.exports = personaCtrl;