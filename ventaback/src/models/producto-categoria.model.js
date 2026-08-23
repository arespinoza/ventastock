const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProductoCategoria = sequelize.define('ProductoCategoria', {
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    categoriaId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'producto_categorias',
    timestamps: false,
    indexes: [{ unique: true, fields: ['productoId', 'categoriaId'] }]
});

module.exports = ProductoCategoria;