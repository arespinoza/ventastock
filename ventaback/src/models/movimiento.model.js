const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database');
const DetalleMovimiento = require('./detallemovimiento.model');

const Movimiento = sequelize.define('Movimiento', {
    fecha: {type: DataTypes.DATE, allowNull: false},
    total: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    tipo: {type: DataTypes.STRING, allowNull: false},
    razonsocial: {type: DataTypes.STRING, allowNull: false},
}, {
    tableName: 'movimientos',
    timestamps: true
});

Movimiento.hasMany(DetalleMovimiento, { as: 'detalles-movimiento', foreignKey: 'movimientoId' });

module.exports = Movimiento;