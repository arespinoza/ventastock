const Producto = require('./producto.model');
const Categoria = require('./categoria.model');
const ProductoCategoria = require('./producto-categoria.model');
const DetalleMovimiento = require('./detallemovimiento.model');
const Abono = require('./abono.model');
const Persona = require('./persona.model');

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

Abono.belongsTo(DetalleMovimiento, { as: 'detalleMovimiento', foreignKey: 'detalleMovimientoId' });
DetalleMovimiento.hasMany(Abono, { as: 'abonos', foreignKey: 'detalleMovimientoId' });
Abono.belongsTo(Persona, { as: 'persona', foreignKey: 'personaId' });
Persona.hasMany(Abono, { as: 'abonos', foreignKey: 'personaId' });

module.exports = { Producto, Categoria, ProductoCategoria, DetalleMovimiento, Abono, Persona };