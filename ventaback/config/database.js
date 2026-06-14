const { Sequelize } = require('sequelize');
// Crea sistemaventadb en el servidory configura las credenciales de tu bd de PostgreSQL
const sequelize = new Sequelize('ventadb', 'postgres', 'admin123', {
host: 'localhost',
dialect: 'postgres',
logging: false, // Evita que llene la consola con logs de consultas SQL básicas
});
// Probar y levantar la conexión
sequelize.authenticate()
.then(() => console.log('DB is connected to PostgreSQL'))
.catch(err => console.error('Error al conectar a PostgreSQL:', err));
module.exports = sequelize;