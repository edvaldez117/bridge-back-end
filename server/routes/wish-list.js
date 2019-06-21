const express = require('express');
const { verificarToken, verificarAutoDisponible } = require('../middlewares/middlewares');
const { base64 } = require('../tools/tools');
const WishList = require('../models/wish-list');
const app = express();

app.get('/wish-list', [verificarToken], (req, res) => {
    const { usuario } = req;
    WishList.find({ usuario: usuario._id }).populate({
        path: 'auto',
        populate: {
            path: 'usuario',
            model: 'Usuario'
        }
    }).exec((err, wishListDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        wishListDB = wishListDB.filter(wishList => {
            return !wishList.auto.autoVendido
        });
        wishListDB.forEach(elemento => {
            elemento.auto.usuario.imagenPerfil = base64(elemento.auto.usuario.imagenPerfil, 'usuarios');
        });
        res.json({
            ok: true,
            wishList: wishListDB
        });
    });
});

app.get('/wish-list/:auto', [verificarToken], (req, res) => {
    const { usuario } = req;
    WishList.findOne({ usuario: usuario._id, auto: req.params.auto }, (err, wishListDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!wishListDB) {
            return res.json({
                ok: true,
                existe: false
            });
        }
        res.json({
            ok: true,
            existe: true
        });
    });
});

app.post('/wish-list', [verificarToken, verificarAutoDisponible], (req, res) => {
    const { usuario, auto } = req;
    WishList.findOne({ usuario: usuario._id, auto: auto._id }, (err, existe) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (existe) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El auto ya se encuentra en la lista de deseos'
                }
            });
        }
        let wishList = new WishList({
            usuario: usuario._id,
            auto: auto._id
        });
        wishList.save((err1, wishListDB) => {
            if (err1) {
                return res.status(400).json({
                    ok: false,
                    err1
                });
            }
            res.status(201).json({
                ok: true,
                wishList: wishListDB
            });
        });
    });
});

app.delete('/wish-list/:id', [verificarToken], (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    WishList.findOneAndDelete({ _id: id, usuario: usuario._id }, (err, wishListDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!wishListDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el elmento de la wish list especificado'
                }
            });
        }
        res.json({
            ok: true,
            wishList: wishListDB
        });
    });
});

app.delete('/wish-list', [verificarToken], (req, res) => {
    const { usuario } = req;
    WishList.deleteMany({ usuario: usuario._id }, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'La lista de deseos fue vaciada exitosamente'
        });
    });
});

module.exports = app;