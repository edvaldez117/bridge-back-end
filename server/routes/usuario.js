const express = require('express');
const SHA256 = require('crypto-js/sha256');
const Usuario = require('../models/usuario');
const { verificarToken } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificarToken, (req, res) => {
    res.json({
        ok: true,
        usuario: req.usuario
    });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    body.activo = true;
    body.isAdmin = false;
    body.imagenPerfil = 'default.jpg'
    if (body.contrasena) {
        body.contrasena = String(SHA256(body.contrasena));
    }
    const usuario = new Usuario(body);
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario', verificarToken, (req, res) => {
    const usuario = req.usuario;
    let body = req.body;
    body.email = usuario.email;
    body.contrasena = body.contrasena ? String(SHA256(body.contrasena)) : usuario.contrasena;
    body.imagenPerfil = usuario.imagenPerfil;
    if (!body.nombreCompleto) {
        body.nombreCompleto = usuario.nombreCompleto;
    } else {
        body.nombreCompleto.nombres = body.nombreCompleto.nombres || usuario.nombreCompleto.nombres;
        body.nombreCompleto.apellido1 = body.nombreCompleto.apellido1 || usuario.nombreCompleto.apellido1;
        body.nombreCompleto.apellido2 = body.nombreCompleto.apellido2 === null ? undefined : body.nombreCompleto.apellido2;
    }
    if (!body.direccion) {
        body.direccion = usuario.direccion;
    } else {
        body.direccion.codigoPostal = body.direccion.codigoPostal || usuario.direccion.codigoPostal;
        body.direccion.colonia = body.direccion.colonia || usuario.direccion.colonia;
        body.direccion.calle = body.direccion.calle || usuario.direccion.calle;
        body.direccion.numeroExterior = body.direccion.numeroExterior || usuario.direccion.numeroExterior;
        body.direccion.numeroInterior = body.direccion.numeroInterior === null ? undefined : body.direccion.numeroInterior;
    }
    body.telefono = body.telefono || usuario.telefono;
    body.isAdmin = usuario.isAdmin;
    body.activo = usuario.activo;
    Usuario.findByIdAndUpdate(req.usuario._id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario', verificarToken, (req, res) => {
    Usuario.findByIdAndUpdate(req.usuario._id, { activo: false }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Usuario eliminado con éxito'
        });
    });
});

module.exports = app;