const express = require('express');
const Modelo = require('../models/modelo');

const app = express();

app.get('/modelos/:marca', (req, res) => {
    const { marca } = req.params;
    Modelo.find({ marca, activo: true }, (err, modelos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!modelos || modelos.length === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existen modelos asociados a la marca proporcionada'
                }
            });
        }
        res.json({
            ok: true,
            modelos
        });
    });
});

module.exports = app;