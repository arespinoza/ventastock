const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database');
const Producto = require('./producto.model');
const Persona = require('./persona.model');

const DetalleMovimiento = sequelize.define('DetalleMovimiento', {
    cantidad: {type: DataTypes.INTEGER, allowNull: false },
    preciocompra: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    precioventa: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    subtotal: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    tipo: {type: DataTypes.STRING, allowNull: false},
    fecha: {type: DataTypes.DATE, allowNull: false},
    convalidado: {type: DataTypes.BOOLEAN, allowNull: false},
    razonsocial: {type: DataTypes.STRING, allowNull: true},
    estadopago: {type: DataTypes.STRING, allowNull: false}
}, {
    tableName: 'detalles_movimiento',
    timestamps: true
});

DetalleMovimiento.belongsTo(Producto, { as: 'producto' });
DetalleMovimiento.belongsTo(Persona, { as: 'persona' });

module.exports = DetalleMovimiento;