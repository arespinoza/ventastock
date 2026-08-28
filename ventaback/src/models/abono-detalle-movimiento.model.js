const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AbonoDetalleMovimiento = sequelize.define('AbonoDetalleMovimiento', {
    montoAplicado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'abono_detalle_movimiento',
    timestamps: true
});

module.exports = AbonoDetalleMovimiento;
