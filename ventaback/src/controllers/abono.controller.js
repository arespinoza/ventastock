const Abono = require('../models/abono.model');
const DetalleMovimiento = require('../models/detallemovimiento.model');
const AbonoDetalleMovimiento = require('../models/abono-detalle-movimiento.model');
const Persona = require('../models/persona.model');
const sequelize = require('../../config/database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const abonoCtrl = {};

const incluirRelaciones = [
	{
		model: DetalleMovimiento,
		as: 'detallesMovimiento',
		through: { attributes: ['montoAplicado'] },
		include: [{ model: Producto, as: 'producto' }]
	},
	{ model: Persona, as: 'persona' }
];

function normalizarAplicaciones(aplicaciones) {
	if (!Array.isArray(aplicaciones) || !aplicaciones.length) {
		throw new Error('Debe informar al menos un detalle de movimiento.');
	}

	return aplicaciones.map(aplicacion => ({
		detalleMovimientoId: Number(aplicacion.detalleMovimientoId),
		montoAplicado: Number(aplicacion.montoAplicado)
	}));
}

function validarAplicaciones(monto, aplicaciones) {
	if (aplicaciones.some(item => !Number.isInteger(item.detalleMovimientoId) || item.detalleMovimientoId <= 0)) {
		throw new Error('Hay un detalle de movimiento inválido.');
	}
	if (aplicaciones.some(item => !Number.isFinite(item.montoAplicado) || item.montoAplicado <= 0)) {
		throw new Error('Todos los montos aplicados deben ser mayores que cero.');
	}

	const totalAplicado = aplicaciones.reduce((total, item) => total + item.montoAplicado, 0);
	if (Math.abs(totalAplicado - Number(monto)) > 0.01) {
		throw new Error('La suma de los montos aplicados debe coincidir con el monto del abono.');
	}
}

function datosAbono(body) {
	const datos = { ...body };
	if (datos.persona && datos.persona.id) {
		datos.personaId = datos.persona.id;
	}
	delete datos.detallesMovimiento;
	delete datos.persona;
	return datos;
}

async function guardarAplicaciones(abonoId, aplicaciones, transaction) {
	await AbonoDetalleMovimiento.destroy({ where: { abonoId }, transaction });
	await AbonoDetalleMovimiento.bulkCreate(
		aplicaciones.map(aplicacion => ({ ...aplicacion, abonoId })),
		{ transaction }
	);
}

abonoCtrl.getAbonos = async (req, res) => {
	const where = {};
	const include = [...incluirRelaciones];
	if (req.query.personaId) {
		where.personaId = { [Op.eq]: req.query.personaId };
	}
	if (req.query.detalleMovimientoId) {
		include[0] = {
			...include[0],
			where: { id: { [Op.eq]: req.query.detalleMovimientoId } },
			required: true
		};
	}

	try {
		const abonos = await Abono.findAll({
			where,
			include,
			order: [['fecha', 'DESC'], ['id', 'DESC']]
		});
		res.json(abonos);
	} catch (error) {
		res.status(500).json({ status: '0', msg: 'Error al obtener los abonos.' });
	}
};

abonoCtrl.createAbono = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const aplicaciones = normalizarAplicaciones(req.body.detallesMovimiento);
		validarAplicaciones(req.body.monto, aplicaciones);
		const abono = await Abono.create(datosAbono(req.body), { transaction });
		await guardarAplicaciones(abono.id, aplicaciones, transaction);
		await transaction.commit();
		res.status(201).json({ status: '1', msg: 'Abono creado.', abono });
	} catch (error) {
		await transaction.rollback();
		res.status(400).json({ status: '0', msg: error.message || 'Error al crear el abono.' });
	}
};

abonoCtrl.getAbono = async (req, res) => {
	try {
		const abono = await Abono.findByPk(req.params.id, { include: incluirRelaciones });
		if (!abono) {
			return res.status(404).json({ status: '0', msg: 'Abono no encontrado.' });
		}
		res.json(abono);
	} catch (error) {
		res.status(500).json({ status: '0', msg: 'Error al obtener el abono.' });
	}
};

abonoCtrl.editAbono = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const aplicaciones = normalizarAplicaciones(req.body.detallesMovimiento);
		validarAplicaciones(req.body.monto, aplicaciones);
		const [actualizados] = await Abono.update(datosAbono(req.body), {
			where: { id: req.params.id },
			transaction
		});
		if (!actualizados) {
			await transaction.rollback();
			return res.status(404).json({ status: '0', msg: 'Abono no encontrado.' });
		}
		await guardarAplicaciones(req.params.id, aplicaciones, transaction);
		await transaction.commit();
		res.json({ status: '1', msg: 'Abono actualizado.' });
	} catch (error) {
		await transaction.rollback();
		res.status(400).json({ status: '0', msg: error.message || 'Error al actualizar el abono.' });
	}
};

abonoCtrl.deleteAbono = async (req, res) => {
	const transaction = await sequelize.transaction();
	try {
		const eliminados = await Abono.destroy({ where: { id: req.params.id }, transaction });
		if (!eliminados) {
			await transaction.rollback();
			return res.status(404).json({ status: '0', msg: 'Abono no encontrado.' });
		}
		await transaction.commit();
		res.json({ status: '1', msg: 'Abono eliminado.' });
	} catch (error) {
		await transaction.rollback();
		res.status(400).json({ status: '0', msg: 'Error al eliminar el abono.' });
	}
};

module.exports = abonoCtrl;
