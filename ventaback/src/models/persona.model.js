const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Persona = sequelize.define('Persona', {
  dni: { type: DataTypes.STRING(8), allowNull: false, unique: true },
  apellido: { type: DataTypes.STRING(50), allowNull: false },
  nombres: { type: DataTypes.STRING(50), allowNull: false },
  referencia: { type: DataTypes.STRING(100), allowNull: true },
  correo_electronico: {type: DataTypes.STRING(100), allowNull: true, unique: true, validate: { isEmail: true }},
  nro_celular: { type: DataTypes.STRING(15), allowNull: true },
}, {
  tableName: 'personas',
  timestamps: false,
});

module.exports = Persona;