const jwt = require('jsonwebtoken');

const secretoJwt = process.env.JWT_SECRET || 'cambiar-este-secreto-en-produccion';

function requiereAdministrador(req, res, next) {
    const autorizacion = req.headers.authorization || '';
    const [tipo, token] = autorizacion.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ mensaje: 'Autenticación requerida' });
    }

    try {
        const datosUsuario = jwt.verify(token, secretoJwt);
        if (datosUsuario.rol !== 'administrador') {
            return res.status(403).json({ mensaje: 'Acceso restringido' });
        }

        req.usuario = datosUsuario;
        next();
    } catch {
        return res.status(401).json({ mensaje: 'Token inválido o vencido' });
    }
}

module.exports = requiereAdministrador;