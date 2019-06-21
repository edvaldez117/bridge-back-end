const express = require('express');
const Comentario = require('../models/comentario');
const { verificarToken } = require('../middlewares/middlewares');
const { base64 } = require('../tools/tools');
const app = express();

app.get('/comentarios/:auto', (req, res) => {
    const { auto } = req.params;
    Comentario.find({ auto }).populate('usuario').exec((err, comentarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        comentarios.forEach(comentario => {
            comentario.usuario.imagenPerfil = base64(comentario.usuario.imagenPerfil, 'usuarios');
        });
        res.json({
            ok: true,
            comentarios
        });
    });
});

app.post('/comentario', [verificarToken], (req, res) => {
    const { body, usuario } = req;
    for (const propiedad in body) {
        if (body[propiedad] === null) {
            body[propiedad] = undefined;
        }
    }
    body.usuario = usuario._id;
    let comentario = new Comentario(body);
    comentario.save((err, comentarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        comentarioDB.usuario = usuario;
        comentarioDB.usuario.imagenPerfil = base64(comentarioDB.usuario.imagenPerfil, 'usuarios');
        res.json({
            ok: true,
            comentario: comentarioDB
        });
    });
});

app.delete('/comentario/:id', [verificarToken], (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    Comentario.findOneAndDelete({ _id: id, usuario: usuario._id }, (err, comentarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!comentarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El comentario no existe o no le pertenece al usuario'
                }
            });
        }
        res.json({
            ok: true,
            comentario: comentarioDB
        });
    });
});

module.exports = app;