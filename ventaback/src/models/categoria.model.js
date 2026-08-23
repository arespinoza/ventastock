const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Categoria = sequelize.define('Categoria', {
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' }
}, {
    tableName: 'categorias',
    timestamps: true
});

module.exports = Categoria;