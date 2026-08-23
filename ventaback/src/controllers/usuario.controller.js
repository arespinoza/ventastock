const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const secretoJwt = process.env.JWT_SECRET || 'cambiar-este-secreto-en-produccion';

async function login(req, res) {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
        return res.status(400).json({ mensaje: 'Usuario y clave son obligatorios' });
    }

    const usuarioEncontrado = await Usuario.findOne({ where: { usuario } });
    if (!usuarioEncontrado || usuarioEncontrado.rol !== 'administrador' ||
        !(await bcrypt.compare(clave, usuarioEncontrado.clave))) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
        { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol },
        secretoJwt,
        { expiresIn: '8h' }
    );

    return res.json({ token, usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol });
}

module.exports = { login };