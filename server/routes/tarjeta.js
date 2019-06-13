const express = require('express');
const { verificarToken } = require('../middlewares/middlewares');
const Tarjeta = require('../models/tarjeta');
const app = express();

app.get('/tarjetas', [verificarToken], (req, res) => {
    const { usuario } = req;
    Tarjeta.find({ usuario: usuario._id }, (err, tarjetasDB) => {
        if (err) {
            return res.stauts(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tarjeta: tarjetasDB
        });
    });
});

app.post('/tarjeta', [verificarToken], (req, res) => {
    let { usuario, body } = req;
    for (const propiedad in body) {
        if (body[propiedad] === null) {
            body[propiedad] = undefined;
        }
    }
    body.usuario = usuario._id;
    let tarjeta = new Tarjeta(body);
    tarjeta.save((err, tarjetaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            tarjeta: tarjetaDB
        });
    });
});

app.delete('/tarjeta/:id', [verificarToken], (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    Tarjeta.findOneAndDelete({ _id: id, usuario: usuario._id }, (err, tarjetaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!tarjetaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la tarjeta especificada para este usuario'
                }
            });
        }
        res.json({
            ok: true,
            tarjeta: tarjetaDB
        });
    });
});

module.exports = app;