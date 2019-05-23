const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');
const Auto = require('../models/auto');

const app = express();

app.post('/auto', verificarToken, (req, res) => {
    let body = req.body;
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