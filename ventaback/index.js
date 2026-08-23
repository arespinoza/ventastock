const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');
const Usuario = require('./src/models/usuario.model');
var app = express();
//middlewares
app.use(express.json());
app.use(cors({
    origin: [
        'https://ventastock.onrender.com',
        'http://localhost:4200',
        'https://affidavit-mumbo-next.ngrok-free.dev',
        'http://10.3.2.189',
        '*'
    ]
}));
//Cargamos el modulo de direccionamiento de rutas
app.use('/api/producto', require('./src/routes/producto.route.js'));
app.use('/api/persona', require('./src/routes/persona.route.js'));
app.use('/api/detallemovimiento', require('./src/routes/detallemovimiento.route.js'));
app.use('/api/usuario', require('./src/routes/usuario.route.js'));
//setting
app.set('port', process.env.PORT || 3000);
// Sincronizar Base de Datos y arrancar el servidor.
// .sync() crea las tablas automáticamente en Postgres si aún no existen.
// force en false crea las tablas solo si no existe, no borra datos en cada inicio
sequelize.sync({ force: false })
    .then(() => {
        return crearAdministradorInicial();
    })
    .then(() => {
        console.log('Tablas de PostgreSQL sincronizadas');
        app.listen(app.get('port'), () => {
            console.log(`Server started on port`, app.get('port'));
        });
    })
    .catch(err => {
        console.error('No se pudo iniciar el servidor debido a un error en la BD:', err);
    });

async function crearAdministradorInicial() {
    const usuario = process.env.ADMIN_USER || 'admin';
    const clave = process.env.ADMIN_PASSWORD || 'admin123';
    const existente = await Usuario.findOne({ where: { usuario } });

    if (!existente) {
        await Usuario.create({
            usuario,
            clave: await bcrypt.hash(clave, 12),
            rol: 'administrador'
        });
        console.log(`Administrador inicial creado: ${usuario}`);
    }
}
