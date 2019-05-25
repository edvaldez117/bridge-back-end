const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');
const Auto = require('../models/auto');

const app = express();

app.get('/auto/:id', (req, res) => {
    Auto.findById(req.params.id, (err, autoDB) => {
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
                    message: 'No se encontro un auto con el id especificado'
                }
            });
        }
        res.json({
            ok: true,
            auto: autoDB
        });
    });
});

app.get('/autos', (req, res) => {
    let { modelo, precio } = req.query;
    let condiciones = {};
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
        if (autos.length === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontraron autos con las especificaciones solicitadas'
                }
            });
        }
        res.json({
            ok: true,
            autos
        });
    });
});

app.post('/auto', verificarToken, (req, res) => {
    let body = req.body;
    body._id = undefined;
    body.usuario = req.usuario._id;
    body.extranjero = body.extranjero === null ? undefined : body.extranjero;
    body.totalDuenos = body.totalDuenos === null ? undefined : body.totalDuenos;
    body.totalAccidentes = body.totalAccidentes === null ? undefined : body.totalAccidentes;
    body.transmision = body.transmision === null ? undefined : body.transmision;
    body.alarma = body.alarma === null ? undefined : body.alarma;
    body.aireAcondicionado = body.aireAcondicionado === null ? undefined : body.aireAcondicionado;
    body.vidriosElectricos = body.vidriosElectricos === null ? undefined : body.vidriosElectricos;
    body.puertasElectricas = body.puertasElectricas === null ? undefined : body.puertasElectricas;
    body.bolsasDeAirePiloto = body.bolsasDeAirePiloto === null ? undefined : body.bolsasDeAirePiloto;
    body.bolsasDeAirePasajero = body.bolsasDeAirePasajero === null ? undefined : body.bolsasDeAirePasajero;
    body.bolsasDeAireLaterales = body.bolsasDeAireLaterales === null ? undefined : body.bolsasDeAireLaterales;
    body.seguroDeNinos = body.seguroDeNinos === null ? undefined : body.seguroDeNinos;
    body.controlDeEstabilidad = body.controlDeEstabilidad === null ? undefined : body.controlDeEstabilidad;
    body.bluetooth = body.bluetooth === null ? undefined : body.bluetooth;
    body.sensorFrontal = body.sensorFrontal === null ? undefined : body.sensorFrontal;
    body.sensorTrasero = body.sensorTrasero === null ? undefined : body.sensorTrasero;
    body.camaraTrasera = body.camaraTrasera === null ? undefined : body.camaraTrasera;
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

module.exports = app;