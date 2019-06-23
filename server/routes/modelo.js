const express = require('express');
const Modelo = require('../models/modelo');
const { verificarToken, verificarRol } = require('../middlewares/middlewares');

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

app.post('/modelo', [verificarToken, verificarRol], (req, res) => {
    req.body.activo = true;
    req.body._id = undefined;
    for (const propiedad in req.body) {
        if (req.body[propiedad] === null) {
            req.body[propiedad] = undefined;
        }
    }
    const modelo = new Modelo(req.body);
    modelo.save((err, modeloDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            modelo: modeloDB
        });
    });
});

app.put('/modelo/:id', [verificarToken, verificarRol], (req, res) => {
    req.body._id = undefined;
    for (const propiedad in req.body) {
        if (req.body[propiedad] === null) {
            req.body[propiedad] = undefined;
        }
    }
    Modelo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }, (err, modeloDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!modeloDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró un modelo con el id especificado'
                }
            });
        }
        res.json({
            ok: true,
            modelo: modeloDB
        });
    });
});

app.delete('/modelo/:id', [verificarToken, verificarRol], (req, res) => {
    Modelo.findByIdAndDelete(req.params.id, (err, modeloDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!marcaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró un modelo con el id especificado'
                }
            });
        }
        res.json({
            ok: true,
            modelo: modeloDB
        });
    })
});

module.exports = app;