const express = require('express');
const SHA256 = require('crypto-js/sha256');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const Usuario = require('../models/usuario');
const { verificarToken } = require('../middlewares/autenticacion');
const { borrarArchivo, getPathImagen } = require('../tools/tools');
const app = express();

app.use(fileUpload({ useTempFiles: true }));

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
    if (body.nombreCompleto) {
        body.nombreCompleto.apellido2 = body.nombreCompleto.apellido2 === null ? undefined : body.nombreCompleto.apellido2;
    }
    if (body.direccion) {
        body.direccion.numeroInterior = body.direccion.numeroInterior === null ? undefined : body.direccion.numeroInterior;
    }
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
    const body = req.body;
    let usuario = req.usuario;
    usuario.contrasena = body.contrasena ? String(SHA256(body.contrasena)) : usuario.contrasena;
    if (body.nombreCompleto) {
        usuario.nombreCompleto.nombres = body.nombreCompleto.nombres || usuario.nombreCompleto.nombres;
        usuario.nombreCompleto.apellido1 = body.nombreCompleto.apellido1 || usuario.nombreCompleto.apellido1;
        usuario.nombreCompleto.apellido2 = body.nombreCompleto.apellido2 === null ? undefined : body.nombreCompleto.apellido2;
    }
    if (body.direccion) {
        usuario.direccion.codigoPostal = body.direccion.codigoPostal || usuario.direccion.codigoPostal;
        usuario.direccion.colonia = body.direccion.colonia || usuario.direccion.colonia;
        usuario.direccion.calle = body.direccion.calle || usuario.direccion.calle;
        usuario.direccion.numeroExterior = body.direccion.numeroExterior || usuario.direccion.numeroExterior;
        usuario.direccion.numeroInterior = body.direccion.numeroInterior === null ? undefined : body.direccion.numeroInterior;
    }
    usuario.telefono = body.telefono || usuario.telefono;
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
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

app.get('/usuario/imagen', verificarToken, (req, res) => {
    let pathImagen = getPathImagen(req.usuario.imagenPerfil, 'usuarios');
    if (!fs.existsSync(pathImagen)) {
        req.usuario.imagenPerfil = 'default.jpg';
        req.usuario.save();
        pathImagen = getPathImagen(req.usuario.imagenPerfil, 'usuarios');
    }
    res.sendFile(pathImagen);
});

app.put('/usuario/imagen', verificarToken, (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ninguna imagen'
            }
        });
    }
    const formatosValidos = ['png', 'gif', 'jpg', 'jpeg'];
    const imagen = req.files.imagen;
    let nombreImagen = imagen.name;
    nombreImagen = nombreImagen.split('.');
    const formatoImagen = nombreImagen[nombreImagen.length - 1];
    if (formatosValidos.indexOf(formatoImagen) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los formatos para imagen permitidos son ' + formatosValidos.join(', ')
            }
        });
    }
    const nuevoNombre = `${req.usuario.email}-${new Date().getMilliseconds()}.${formatoImagen}`;
    imagen.mv(`uploads/usuarios/${nuevoNombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (req.usuario.imagenPerfil !== 'default.jpg') {
            borrarArchivo(req.usuario.imagenPerfil, 'usuarios')
        }
        req.usuario.imagenPerfil = nuevoNombre;
        req.usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });
    });
});

module.exports = app;