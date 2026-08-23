const Producto = require('./producto.model');
const Categoria = require('./categoria.model');
const ProductoCategoria = require('./producto-categoria.model');

Producto.belongsToMany(Categoria, {
    through: ProductoCategoria,
    as: 'categorias',
    foreignKey: 'productoId',
    otherKey: 'categoriaId'
});
Categoria.belongsToMany(Producto, {
    through: ProductoCategoria,
    as: 'productos',
    foreignKey: 'categoriaId',
    otherKey: 'productoId'
});

module.exports = { Producto, Categoria, ProductoCategoria };