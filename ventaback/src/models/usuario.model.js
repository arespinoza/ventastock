const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Usuario = sequelize.define('Usuario', {
    usuario: { type: DataTypes.STRING, allowNull: false, unique: true },
    clave: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.STRING, allowNull: false, defaultValue: 'administrador' }
}, {
    tableName: 'usuarios',
    timestamps: true
});

module.exports = Usuario;