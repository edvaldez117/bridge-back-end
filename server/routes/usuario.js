const express = require('express');
const SHA256 = require('crypto-js/sha256');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Auto = require('../models/auto');
const { verificarToken } = require('../middlewares/autenticacion');
const { borrarArchivo, base64 } = require('../tools/tools');
const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.get('/usuario', verificarToken, (req, res) => {
    let usuario = req.usuario;
    usuario.imagenPerfil = base64(usuario.imagenPerfil, 'usuarios');
    res.json({
        ok: true,
        usuario
    });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    body._id = undefined;
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
    let usuario = req.usuario;
    if (usuario.imagenPerfil !== 'default.jpg') {
        borrarArchivo(usuario.imagenPerfil, 'usuarios');
        usuario.imagenPerfil = 'default.jpg';
    }
    usuario.activo = false;
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
        Auto.deleteMany({ usuario: usuarioDB._id }, (err) => {
            res.json({
                ok: true,
                message: 'Usuario eliminado con éxito'
            });
        });
    });
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