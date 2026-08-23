const Producto = require('../models/producto.model'); // Asegúrate de usar la ruta correcta a tu modelo
const Categoria = require('../models/categoria.model');
const sequelize = require('../../config/database');
const productoCtrl = {};
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Obtener todos los productos
productoCtrl.getProductos = async (req, res) => {
  const criteria = {
    order: [['id', 'DESC']],
    include: [{ model: Categoria, as: 'categorias', through: { attributes: [] } }]
  };
  if (req.query.estado) {
    criteria.where = {
      estado: {
        [Op.eq]: req.query.estado
      }
    };
  }

  if (req.query.nombre) {
    criteria.where = {
      ...criteria.where,
      nombre: {
        [Op.iLike]: `%${req.query.nombre}%`
      }
    };
  }

  try {
    const productos = await Producto.findAll(criteria);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ status: '0', msg: 'Error al obtener los productos.'+error });
  }
};


// Crear un nuevo producto
productoCtrl.createProducto = async (req, res) => {
  try {
    const categoriaIds = normalizarCategoriaIds(req.body.categoriaIds);
    await sequelize.transaction(async (transaction) => {
      const producto = await Producto.create({
        ...req.body
      }, { transaction });
      await producto.setCategorias(categoriaIds, { transaction });
    });
    res.json({ status: '1', msg: 'Producto guardado.' });
  } catch (error) {
    res.status(400).json({ status: '0', msg: 'Error procesando operacion.' });
  }
};
// Obtener un producto por ID
productoCtrl.getProducto = async (req, res) => {
  try {
    // Buscamos por la clave primaria (id numérico)
    const producto = await Producto.findByPk(req.params.id, {
      include: [{ model: Categoria, as: 'categorias', through: { attributes: [] } }]
    });
    if (!producto) {
      return res.status(404).json({ status: '0', msg: 'Producto no encontrado.' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ status: '0', msg: 'Error al obtener el producto.' });
  }
};
// Editar un producto
productoCtrl.editProducto = async (req, res) => {
  try {
    const categoriaIds = normalizarCategoriaIds(req.body.categoriaIds);
    await sequelize.transaction(async (transaction) => {
      await Producto.update({
        ...req.body
      }, {
        where: { id: req.params.id },
        transaction
      });
      const producto = await Producto.findByPk(req.params.id, { transaction });
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      await producto.setCategorias(categoriaIds, { transaction });
    });
    res.json({ status: '1', msg: 'Producto updated' });
  } catch (error) {
    res.status(400).json({ status: '0', msg: 'Error procesando la operacion' });
  }
};
// Eliminar un producto
productoCtrl.deleteProducto = async (req, res) => {
  try {
    // .destroy() elimina el registro que coincida con el ID enviado por parámetro
    await Producto.destroy({
      where: { id: req.params.id }
    });
    res.json({ status: '1', msg: 'Producto removed' });
  } catch (error) {
    res.status(400).json({ status: '0', msg: 'Error procesando la operacion' });
  }
};

function normalizarCategoriaIds(categoriaIds) {
  if (!Array.isArray(categoriaIds)) {
    return [];
  }
  return [...new Set(categoriaIds.map(Number).filter(Number.isInteger))];
}
module.exports = productoCtrl;