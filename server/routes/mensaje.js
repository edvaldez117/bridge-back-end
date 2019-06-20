const express = require('express');
const Mensaje = require('../models/mensaje');
const { verificarToken } = require('../middlewares/middlewares');
const app = express();

app.get('/mensajes', [verificarToken], (req, res) => {
    Mensaje.find({ destinatario: req.usuario._id }, (err, mensajes) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            mensajes
        });
    });
});

app.post('/mensaje', [verificarToken], (req, res) => {
    let { usuario, body } = req;
    for (const propiedad in body) {
        if (body[propiedad] === null) {
            body[propiedad] = undefined;
        }
    }
    body.remitente = usuario._id;
    let mensaje = new Mensaje(body);
    mensaje.save((err, mensajeDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: mensajeDB
            });
        }
        res.json({
            ok: true,
            mensaje: mensajeDB
        });
    });
});

module.exports = app;