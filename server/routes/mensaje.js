const express = require('express');
const Mensaje = require('../models/mensaje');
const Auto = require('../models/auto');
const { verificarToken, verificarAuto } = require('../middlewares/middlewares');
const app = express();

app.get('/mensajes/:auto', [verificarToken], (req, res) => {
    const { auto } = req.params;
    Mensaje.find({ auto, $or: [{ destinatario: req.usuario._id }, { remitente: req.usuario._id }] }, (err, mensajes) => {
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

app.post('/mensaje/:auto', [verificarToken], (req, res) => {
    let { usuario, body } = req;
    for (const propiedad in body) {
        if (body[propiedad] === null) {
            body[propiedad] = undefined;
        }
    }
    Auto.findOne({ _id: req.params.auto, autoVendido: false }, (err, autoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!autoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El auto especificado no esta disponible'
                }
            });
        }
        if (autoDB.usuario != body.destinatario && autoDB.usuario != req.usuario._id) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El auto no le pertene ni al destinatario ni al remitente'
                }
            });
        }
        body.auto = autoDB._id;
        body.remitente = usuario._id;
        let mensaje = new Mensaje(body);
        mensaje.save((err, mensajeDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                mensaje: mensajeDB
            });
        });
    });
});

module.exports = app;