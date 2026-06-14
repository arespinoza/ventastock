const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
var app = express();
//middlewares
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://affidavit-mumbo-next.ngrok-free.dev'
    ]
}));
//Cargamos el modulo de direccionamiento de rutas
app.use('/api/producto', require('./src/routes/producto.route.js'));
app.use('/api/persona', require('./src/routes/persona.route.js'));
app.use('/api/detallemovimiento', require('./src/routes/detallemovimiento.route.js'));
//setting
app.set('port', process.env.PORT || 3000);
// Sincronizar Base de Datos y arrancar el servidor.
// .sync() crea las tablas automáticamente en Postgres si aún no existen.
// force en false crea las tablas solo si no existe, no borra datos en cada inicio
sequelize.sync({ force: false })
    .then(() => {
        console.log('Tablas de PostgreSQL sincronizadas');
        app.listen(app.get('port'), () => {
            console.log(`Server started on port`, app.get('port'));
        });
    })
    .catch(err => {
        console.error('No se pudo iniciar el servidor debido a un error en la BD:', err);
    });
