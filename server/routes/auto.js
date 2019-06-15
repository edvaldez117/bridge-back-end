const express = require('express');
const { verificarToken, verificarAuto, verificarImagen } = require('../middlewares/middlewares');
const { getImagenesAuto, borrarArchivo } = require('../tools/tools');
const Auto = require('../models/auto');

const app = express();

app.get('/auto/:id', (req, res) => {
    const { id } = req.params;
    Auto.findOne({ _id: id, autoVendido: false }, (err, autoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!autoDB || !autoDB.modelo || !autoDB.modelo.marca) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro un auto con el id especificado'
                }
            });
        }
        getImagenesAuto(autoDB);
        res.json({
            ok: true,
            auto: autoDB
        });
    });
});

app.get('/autos', (req, res) => {
    const { marca, modelo, precio, cantidad } = req.query;
    let condiciones = { autoVendido: false };
    if (modelo || precio) {
        condiciones.$and = [];
        if (modelo) {
            condiciones.$and.push({ modelo });
        }
        if (precio) {
            condiciones.$and.push({ precio: { $lte: precio } });
        }
    }
    Auto.find(condiciones, (err, autos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        autos = autos.filter((auto) => {
            if (marca) {
                return auto.modelo && auto.modelo.marca && auto.modelo.marca._id.equals(marca);
            }
            return auto.modelo && auto.modelo.marca;
        });
        if (autos.length === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontraron autos con las especificaciones solicitadas'
                }
            });
        }
        if (cantidad) {
            autos = autos.slice(autos.length - cantidad);
        }
        res.json({
            ok: true,
            autos
        });
    });
});

app.post('/auto', verificarToken, (req, res) => {
    let { body } = req;
    body._id = undefined;
    body.usuario = req.usuario._id;
    body.imagenes = ['default.jpg'];
    body.autoVendido = false;
    for (const propiedad in body) {
        if (body[propiedad] === null) {
            body[propiedad] = undefined;
        }
    }
    const auto = new Auto(body);
    auto.save((err, autoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            auto: autoDB
        });
    });
});

app.put('/auto/:id', [verificarToken, verificarAuto], (req, res) => {
    let { auto, body } = req;
    body._id = undefined;
    body.imagenes = undefined;
    body.usuario = undefined;
    for (const propiedad in auto) {
        if (body[propiedad] !== null && body[propiedad] !== undefined) {
            if (propiedad === 'modelo' && typeof body[propiedad] === 'object')
                continue;
            auto[propiedad] = body[propiedad];
        }
    }
    auto.modelo = auto.modelo._id;
    auto.save((err, autoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            auto: autoDB
        });
    });
});

app.delete('/auto/:id', [verificarToken, verificarAuto], (req, res) => {
    const { auto } = req;
    for (const imagen of auto.imagenes) {
        if (imagen !== 'default.jpg') {
            borrarArchivo(imagen, 'autos');
        }
    }
    Auto.findByIdAndDelete(auto._id, (err, autoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!autoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El auto especificado no existe en la base de datos'
                }
            });
        }
        res.json({
            ok: true,
            auto: autoDB
        });
    });
});

app.put('/auto/imagen-principal/:id', [verificarToken, verificarAuto, verificarImagen], (req, res) => {
    const { imagen } = req.files;
    const { formatoImagen } = req;
    let { auto } = req;
    const nuevoNombre = `${auto._id}-0-${new Date().getMilliseconds()}.${formatoImagen}`;
    imagen.mv(`uploads/autos/${nuevoNombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (auto.imagenes[0] !== 'default.jpg') {
            borrarArchivo(auto.imagenes[0], 'autos')
        }
        auto.imagenes[0] = nuevoNombre;
        auto.markModified('imagenes');
        auto.save((err, autoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                auto: autoDB
            });
        });
    });
});

module.exports = app;