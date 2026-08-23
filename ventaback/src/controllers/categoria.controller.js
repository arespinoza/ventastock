const Categoria = require('../models/categoria.model');

const categoriaCtrl = {};

categoriaCtrl.getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({ order: [['nombre', 'ASC']] });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las categorías.' });
    }
};

categoriaCtrl.createCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion || ''
        });
        res.status(201).json(categoria);
    } catch (error) {
        res.status(400).json({ mensaje: 'No se pudo crear la categoría.' });
    }
};

module.exports = categoriaCtrl;