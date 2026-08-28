const Producto = require('./producto.model');
const Categoria = require('./categoria.model');
const ProductoCategoria = require('./producto-categoria.model');
const DetalleMovimiento = require('./detallemovimiento.model');
const Abono = require('./abono.model');
const Persona = require('./persona.model');
const AbonoDetalleMovimiento = require('./abono-detalle-movimiento.model');

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

Abono.belongsToMany(DetalleMovimiento, {
    through: AbonoDetalleMovimiento,
    as: 'detallesMovimiento',
    foreignKey: 'abonoId',
    otherKey: 'detalleMovimientoId'
});
DetalleMovimiento.belongsToMany(Abono, {
    through: AbonoDetalleMovimiento,
    as: 'abonos',
    foreignKey: 'detalleMovimientoId',
    otherKey: 'abonoId'
});
Abono.belongsTo(Persona, { as: 'persona', foreignKey: 'personaId' });
Persona.hasMany(Abono, { as: 'abonos', foreignKey: 'personaId' });

module.exports = { Producto, Categoria, ProductoCategoria, DetalleMovimiento, Abono, Persona, AbonoDetalleMovimiento };