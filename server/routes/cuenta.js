const express = require('express');
const { verificarToken } = require('../middlewares/middlewares');
const Auto = require('../models/auto');
const app = express();

app.get('/cuenta/autos', [verificarToken], (req, res) => {
    Auto.find({ usuario: req.usuario._id, autoVendido: false }, (err, autos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            autos
        });
    });
});

module.exports = app;