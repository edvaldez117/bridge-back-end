const express = require('express');
const { verificarToken, verificarRol } = require('../middlewares/middlewares');
const Compra = require('../models/compra');
const app = express();

app.get('/reporte-marcas', [verificarToken, verificarRol], (req, res) => {
    Compra.aggregate([{
        $lookup: {
            from: 'auto',
            localField: 'auto',
            foreignField: '_id',
            as: 'auto'
        }
    }, {
        $unwind: '$auto'
    }, {
        $lookup: {
            from: 'modelo',
            localField: 'auto.modelo',
            foreignField: '_id',
            as: 'auto.modelo'
        }
    }, {
        $unwind: '$auto.modelo'
    }, {
        $lookup: {
            from: 'marca',
            localField: 'auto.modelo.marca',
            foreignField: '_id',
            as: 'auto.modelo.marca'
        }
    }, {
        $unwind: '$auto.modelo.marca'
    }, {
        $group: {
            _id: '$auto.modelo.marca.nombre',
            autosVendidos: { $sum: 1 },
            gananciasPorComision: { $sum: '$comision' }
        }
    }], (err, ventasPorMarca) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        let totalGanancias = 0;
        ventasPorMarca.forEach(marca => {
            totalGanancias += marca.gananciasPorComision;
        });
        res.json({
            ok: true,
            ventasPorMarca,
            totalGanancias
        });
    });
});

app.get('/reporte-modelos', [verificarToken, verificarRol], (req, res) => {
    Compra.aggregate([{
        $lookup: {
            from: 'auto',
            localField: 'auto',
            foreignField: '_id',
            as: 'auto'
        }
    }, {
        $unwind: '$auto'
    }, {
        $lookup: {
            from: 'modelo',
            localField: 'auto.modelo',
            foreignField: '_id',
            as: 'auto.modelo'
        }
    }, {
        $unwind: '$auto.modelo'
    }, {
        $group: {
            _id: '$auto.modelo.nombre',
            autosVendidos: { $sum: 1 },
            gananciasPorComision: { $sum: '$comision' }
        }
    }], (err, ventasPorMarca) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        let totalGanancias = 0;
        ventasPorMarca.forEach(marca => {
            totalGanancias += marca.gananciasPorComision;
        });
        res.json({
            ok: true,
            ventasPorMarca,
            totalGanancias
        });
    });
});

app.get('/reporte-fecha', [verificarToken, verificarRol], (req, res) => {
    const { dia, mes, anio } = req.query;
    let _id = {};
    if (dia || mes || anio) {
        if (dia) {
            _id.dia = { $dayOfMonth: "$fecha" };
        }
        if (mes) {
            _id.mes = { $month: "$fecha" };
        }
        if (anio) {
            _id.anio = { $year: "$fecha" };
        }
    } else {
        _id = { dia: { $dayOfMonth: "$fecha" }, mes: { $month: "$fecha" }, anio: { $year: "$fecha" } };
    }
    Compra.aggregate([{
        $group: {
            _id,
            autosVendidos: { $sum: 1 },
            gananciasPorComision: { $sum: '$comision' }
        }
    }], (err, ventasPorFecha) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        if (dia || mes || anio) {
            ventasPorFecha = ventasPorFecha.filter(venta => {
                return venta._id.dia == dia && venta._id.mes == mes && venta._id.anio == anio;
            });
        }
        res.json({
            ok: true,
            ventasPorFecha
        });
    });
});

module.exports = app;