const express = require('express');
const { verificarToken, verificarAutoDisponible } = require('../middlewares/middlewares');
const WishList = require('../models/wish-list');
const app = express();

app.get('/wish-list', [verificarToken], (req, res) => {
    const { usuario } = req;
    WishList.find({ usuario: usuario._id }).populate('auto').exec((err, wishListDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        wishListDB = wishListDB.filter(wishList => {
            return !wishList.auto.autoVendido
        });
        res.json({
            ok: true,
            wishList: wishListDB
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