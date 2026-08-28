const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Abono = sequelize.define('Abono', {
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    metodopago: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'abonos',
    timestamps: true
});

module.exports = Abono;
