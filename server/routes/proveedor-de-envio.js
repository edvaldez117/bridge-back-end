const express = require('express');
const ProveedorDeEnvio = require('../models/proveedor-de-envio');
const { verificarToken, verificarRol } = require('../middlewares/middlewares');
const app = express();

app.get('/proveedores-de-envio', (req, res) => {
    ProveedorDeEnvio.find({}, (err, proveedoresDeEnvio) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            proveedoresDeEnvio
        });
    });
});

app.post('/proveedor-de-envio', [verificarToken, verificarRol], (req, res) => {
    for (const key in req.body) {
        if (req.body[key] === null) {
            req.body[key] = undefined;
        }
    }
    let proveedorDeEnvio = new ProveedorDeEnvio(req.body);
    proveedorDeEnvio.save((err, proveedorDeEnvioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            proveedorDeEnvio: proveedorDeEnvioDB
        });
    });
});

app.put('/proveedor-de-envio/:id', [verificarToken, verificarRol], (req, res) => {
    ProveedorDeEnvio.findById(req.params.id, (err, proveedorDeEnvio) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!proveedorDeEnvio) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el proveedor'
                }
            });
        }
        for (const key in proveedorDeEnvio) {
            if (req.body[key] !== null && req.body[key] !== undefined) {
                proveedorDeEnvio[key] = req.body[key];
            }
        }
        proveedorDeEnvio.save((err, proveedorDeEnvioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                proveedorDeEnvio: proveedorDeEnvioDB
            });
        });
    });
});

app.delete('/proveedor-de-envio/:id', [verificarToken, verificarRol], (req, res) => {
    ProveedorDeEnvio.findByIdAndDelete(req.params.id, (err, proveedorDeEnvio) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!proveedorDeEnvio) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El proveedor no existe'
                }
            });
        }
        res.json({
            ok: true,
            proveedorDeEnvio
        });
    });
});

module.exports = app;