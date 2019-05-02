const express = require('express');
const SHA256 = require('crypto-js/sha256');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    const body = req.body;
    if (!body.email || !body.contrasena) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Correo o contraseña no especificados'
            }
        });
    }
    const condiciones = {
        email: body.email,
        activo: true
    };
    Usuario.findOne(condiciones, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Correo o contraseña incorrectos'
                }
            });
        }
        if (String(SHA256(body.contrasena)) !== usuario.contrasena) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Correo o contraseña incorrectos'
                }
            });
        }
        const token = jwt.sign({
            _id: String(SHA256(usuario._id)),
            email: usuario.email
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRES });
        res.json({
            ok: true,
            usuario,
            token
        });
    });
})

module.exports = app;