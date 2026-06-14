const { DataTypes } = require('sequelize');
const sequelize = require('./../../config/database'); // Asegúrate de que la ruta apunte a tu archivo
const Producto = sequelize.define('Producto', {
// Sequelize crea un campo 'id' autoincrementable automáticamente, no hace falta ponerlo
    stock: {type: DataTypes.INTEGER, allowNull: false },
    nombre: {type: DataTypes.STRING, allowNull: false},
    categoria: {type: DataTypes.STRING, allowNull: false},
    preciocompra: {type: DataTypes.DECIMAL(10,2), allowNull: false},
    precioventa: {type: DataTypes.DECIMAL(10,2), allowNull: false},
    estado: {type: DataTypes.BOOLEAN, allowNull: false}
}, {
tableName: 'productos', // Nombre de la tabla en minúsculas y plural
timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
});
module.exports = Producto;