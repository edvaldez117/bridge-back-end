const express = require('express');
const { verificarToken, verificarAutoDisponible, verificarTarjeta, verificarProveedor } = require('../middlewares/middlewares');
const Compra = require('../models/compra');
const ProveedorDeEnvio = require('../models/proveedor-de-envio');
const app = express();

app.get('/compras', [verificarToken], (req, res) => {
    const { usuario } = req;
    Compra.find({ usuario: usuario._id }).populate('auto').exec((err, comprasDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            compras: comprasDB
        });
    });
});

app.get('/compra/:id', [verificarToken], (req, res) => {
    const { id } = req.params;
    Compra.findById(id).populate('auto').exec((err, compraDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!compraDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la compra especificada'
                }
            });
        }
        res.json({
            ok: true,
            compra: compraDB
        });
    });
});

app.post('/compra', [verificarToken, verificarAutoDisponible, verificarTarjeta, verificarProveedor], (req, res) => {
    let { body, usuario, auto, proveedorDeEnvio } = req;
    body.usuario = usuario._id;
    body.subtotal = auto.precio;
    body.comision = auto.precio * 0.10;
    body.iva = (auto.precio + body.comision) * 0.16;
    if (proveedorDeEnvio) {
        body.costoEnvio = proveedorDeEnvio.costo;
    } else {
        body.costoEnvio = 0
    }
    body.total = body.subtotal + body.comision + body.iva + body.costoEnvio;
    body.fecha = undefined;
    let compra = new Compra(body);
    compra.save((err, compraDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        auto.autoVendido = true;
        auto.save();
        res.json({
            ok: true,
            compra: compraDB
        });
    });
});

module.exports = app;