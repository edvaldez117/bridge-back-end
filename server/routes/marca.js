const express = require('express');
const Marca = require('../models/marca');

const app = express();

app.get('/marcas', (req, res) => {
    Marca.find({ activo: true }, (err, marcas) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!marcas) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró ninguna marca'
                }
            });
        }
        res.json({
            ok: true,
            marcas
        });
    });
});

module.exports = app;