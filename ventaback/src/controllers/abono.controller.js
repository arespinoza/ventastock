const Abono = require('../models/abono.model');
const DetalleMovimiento = require('../models/detallemovimiento.model');
const Persona = require('../models/persona.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const abonoCtrl = {};

const incluirRelaciones = [
	{ model: DetalleMovimiento, as: 'detalleMovimiento' },
	{ model: Persona, as: 'persona' }
];

abonoCtrl.getAbonos = async (req, res) => {
	const where = {};
	if (req.query.detalleMovimientoId) {
		where.detalleMovimientoId = { [Op.eq]: req.query.detalleMovimientoId };
	}
	if (req.query.personaId) {
		where.personaId = { [Op.eq]: req.query.personaId };
	}

	try {
		const abonos = await Abono.findAll({
			where,
			attributes: { exclude: ['detalleMovimientoId', 'personaId'] },
			include: incluirRelaciones,
			order: [['fecha', 'DESC'], ['id', 'DESC']]
		});
		res.json(abonos);
	} catch (error) {
		res.status(500).json({ status: '0', msg: 'Error al obtener los abonos.' });
	}
};

function normalizarDatos(body) {
	const datos = { ...body };
	if (datos.detalleMovimiento && datos.detalleMovimiento.id) {
		datos.detalleMovimientoId = datos.detalleMovimiento.id;
	}
	if (datos.persona && datos.persona.id) {
		datos.personaId = datos.persona.id;
	}
	delete datos.detalleMovimiento;
	delete datos.persona;
	return datos;
}

abonoCtrl.createAbono = async (req, res) => {
	try {
		const abono = await Abono.create(normalizarDatos(req.body));
		res.status(201).json({ status: '1', msg: 'Abono creado.', abono });
	} catch (error) {
		res.status(400).json({ status: '0', msg: 'Error al crear el abono.' });
	}
};

abonoCtrl.getAbono = async (req, res) => {
	try {
		const abono = await Abono.findByPk(req.params.id, {
			attributes: { exclude: ['detalleMovimientoId', 'personaId'] },
			include: incluirRelaciones
		});
		if (!abono) {
			return res.status(404).json({ status: '0', msg: 'Abono no encontrado.' });
		}
		res.json(abono);
	} catch (error) {
		res.status(500).json({ status: '0', msg: 'Error al obtener el abono.' });
	}
};

abonoCtrl.editAbono = async (req, res) => {
	try {
		const [actualizados] = await Abono.update(normalizarDatos(req.body), {
			where: { id: req.params.id }
		});
		if (!actualizados) {
			return res.status(404).json({ status: '0', msg: 'Abono no encontrado.' });
		}
		res.json({ status: '1', msg: 'Abono actualizado.' });
	} catch (error) {
		res.status(400).json({ status: '0', msg: 'Error al actualizar el abono.' });
	}
};

abonoCtrl.deleteAbono = async (req, res) => {
	try {
		const eliminados = await Abono.destroy({ where: { id: req.params.id } });
		if (!eliminados) {
			return res.status(404).json({ status: '0', msg: 'Abono no encontrado.' });
		}
		res.json({ status: '1', msg: 'Abono eliminado.' });
	} catch (error) {
		res.status(400).json({ status: '0', msg: 'Error al eliminar el abono.' });
	}
};

module.exports = abonoCtrl;
