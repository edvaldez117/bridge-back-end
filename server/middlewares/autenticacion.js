const jwt = require('jsonwebtoken');
const SHA256 = require('crypto-js/sha256');
const Usuario = require('../models/usuario');

const verificarToken = (req, res, next) => {
    const token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        const condiciones = {
            email: decoded.email,
            activo: true
        };
        Usuario.findOne(condiciones, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!usuario || (String(SHA256(usuario._id)) !== decoded._id)) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                });
            }
            req.usuario = usuario;
            next();
        });
    });
}

module.exports = {
    verificarToken
}