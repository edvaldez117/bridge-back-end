const express = require('express');
const Marca = require('../models/marca');
const { verificarToken, verificarRol } = require('../middlewares/middlewares');

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

app.post('/marca', [verificarToken, verificarRol], (req, res) => {
    req.body.activo = true;
    for (const propiedad in req.body) {
        if (req.body[propiedad] === null) {
            req.body[propiedad] = undefined;
        }
    }
    const marca = new Marca(req.body);
    marca.save((err, marcaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            marca: marcaDB
        });
    });
});

app.put('/marca/:id', [verificarToken, verificarRol], (req, res) => {
    req.body.activo = true;
    for (const propiedad in req.body) {
        if (req.body[propiedad] === null) {
            req.body[propiedad] = undefined;
        }
    }
    Marca.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidator: true }, (err, marcaDB) => {
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
                    message: 'No se encontró una marca con el id especificado'
                }
            });
        }
        res.json({
            ok: true,
            marca: marcaDB
        });
    });
});

app.delete('/marca/:id', [verificarToken, verificarRol], (req, res) => {
    Marca.findByIdAndDelete(req.params.id, (err, marcaDB) => {
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
                    message: 'No se encontró una marca con el id especificado'
                }
            });
        }
        res.json({
            ok: true,
            marca: marcaDB
        });
    });
});

module.exports = app;