const Producto = require('../models/producto.model'); // Asegúrate de usar la ruta correcta a tu modelo
const productoCtrl = {};
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Obtener todos los productos
productoCtrl.getProductos = async (req, res) => {
  const criteria = {};
  if (req.query.categoria) {
    criteria.where = {
      categoria: {
        [Op.like]: `%${req.query.categoria}%`
      }
    };
  }
  if (req.query.estado) {
    criteria.where = {
      estado: {
        [Op.eq]: req.query.estado
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
    // Sequelize usa .create() para instanciar y guardar en un solo paso
    await Producto.create(req.body);
    res.json({ status: '1', msg: 'Producto guardado.' });
  } catch (error) {
    res.status(400).json({ status: '0', msg: 'Error procesando operacion.' });
  }
};
// Obtener un producto por ID
productoCtrl.getProducto = async (req, res) => {
  try {
    // Buscamos por la clave primaria (id numérico)
    const producto = await Producto.findByPk(req.params.id);
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
    await Producto.update(req.body, {
      where: { id: req.body.id }
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
module.exports = productoCtrl;