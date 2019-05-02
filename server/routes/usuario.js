const express = require('express');
const SHA256 = require('crypto-js/sha256');
const Usuario = require('../models/usuario');
const { verificarToken } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificarToken, (req, res) => {
    res.json({
        ok: true,
        usuario: req.usuario
    });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    body.activo = true;
    body.isAdmin = false;
    body.imagenPerfil = 'default.jpg'
    if (body.contrasena) {
        body.contrasena = String(SHA256(body.contrasena));
    }
    const usuario = new Usuario(body);
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            usuarioDB
        });
    });
});

module.exports = app;