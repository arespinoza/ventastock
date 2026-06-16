const DetalleMovimiento = require('../models/detallemovimiento.model');
const Producto = require('../models/producto.model');
const Persona = require('../models/persona.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const detalleMovimientoCtrl = {};
// Obtener todas las compras
detalleMovimientoCtrl.getDetallesMovimiento = async (req, res) => {

  let criteria = {
        attributes: { exclude: ['personaId', 'productoId'] },
        include: [
          { model: Producto, as: 'producto' },
          { model: Persona, as: 'persona' }
        ],
        order: [['id', 'DESC']]
      };

  // Agrego filtro por persona a criteria
  if (req.query.personaId) {
    criteria.where = {
      personaId: {
        [Op.eq]: req.query.personaId
      }
    };
  }
  try {
    const detallesMovimiento = await DetalleMovimiento.findAll(criteria);
    res.json(detallesMovimiento);
  } catch (error) {
    res.status(500).json({ status: '0', msg: 'Error al obtener las detalles.'+error });
  }
}
// Crear una nueva compra
detalleMovimientoCtrl.createDetalleMovimiento = async (req, res) => {
  try {
    if (req.body.persona && req.body.persona.id){
      req.body.personaId = req.body.persona.id;
    }
    if (req.body.producto && req.body.producto.id){
      req.body.productoId = req.body.producto.id;
    }

    //veo si es una operacion de venta o compra
    const producto = await Producto.findByPk(req.body.productoId);
    if (req.body.tipo  == 'venta'){
      //controlo si hay stock para el producto seleccionado
      if (producto.stock < req.body.cantidad){
        return res.status(400).json({ status: '0', msg: 'No hay stock suficiente.' });
      }
      producto.stock = producto.stock - req.body.cantidad;
    }else if(req.body.tipo  == 'compra'){
      producto.stock = producto.stock + req.body.cantidad;
    }
    await producto.save();
    await DetalleMovimiento.create(req.body);

    res.json({ status: '1', msg: 'Detalle guardada.' });

  } catch (error) {
    res.status(400).json({ status: '0', msg: 'Error procesando operacion.' });
  }
}
// Obtener una compra por ID
detalleMovimientoCtrl.getDetalleMovimiento = async (req, res) => {
  try {
    const detalleMovimiento = await DetalleMovimiento.findByPk(req.params.id,
      {
        attributes: { exclude: ['personaId', 'productoId'] },
        include: [
          { model: Producto, as: 'producto' },
          { model: Persona, as: 'persona' }
        ]      
      }

    );
    if (!detalleMovimiento) {
      return res.status(404).json({ status: '0', msg: 'Detalle no encontrada.' });
    }
    res.json(detalleMovimiento);
  } catch (error) {
    res.status(500).json({ status: '0', msg: 'Error al obtener la detalle.' });
  }
};
// Editar una compra
detalleMovimientoCtrl.editDetalleMovimiento = async (req, res) => {
  try {
    if (req.body.persona && req.body.persona.id){
      req.body.personaId = req.body.persona.id;
    }
    if (req.body.producto && req.body.producto.id){
      req.body.productoId = req.body.producto.id;
    }
    await DetalleMovimiento.update(req.body, {
      where: { id: req.body.id }
    });
    res.json({ status: '1', msg: 'detalle updated' });
  } catch (error) {
    res.status(400).json({ status: '0', msg: 'Error procesando la operacion' });
  }
};
// Eliminar una compra
detalleMovimientoCtrl.deleteDetalleMovimiento = async (req, res) => {
  try {
    await DetalleMovimiento.destroy({
      where: { id: req.params.id }
    });
    res.json({ status: '1', msg: 'Detalle removed' });
  } catch (error) {
    res.status(400).json({ status: '0', msg: 'Error procesando la operacion' });
  }
};
module.exports = detalleMovimientoCtrl;