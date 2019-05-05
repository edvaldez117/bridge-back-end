const express = require('express');
const Usuario = require('../models/usuario');
const app = express();

app.get('/verificar-email/:email', (req, res) => {
    const email = req.params.email;
    Usuario.findOne({ email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.json({
                ok: true,
                resultado: {
                    enUso: false,
                    codigo: 0,
                    mensaje: 'El correo especificado está disponible para su uso'
                }
            });
        }
        if (!usuarioDB.activo) {
            return res.json({
                ok: true,
                resultado: {
                    enUso: true,
                    codigo: 1,
                    mensaje: 'El correo especificado esta registrado en una cuenta inactiva'
                }
            });
        }
        res.json({
            ok: true,
            resultado: {
                enUso: true,
                codigo: 2,
                mensaje: 'El correo especificado se encuentra en uso'
            }
        });
    });
});

module.exports = app;