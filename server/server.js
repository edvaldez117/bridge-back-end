const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configuraciones globales
require('./config/config');

// Permitir todas las peticiones CORS
app.use(cors());

// Parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

// Peticion por defecto
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Bridge Back-End'
    });
});

// Conexión a la base de datos en MongoDB
mongoose.connect(process.env.DBCONNECT, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log(`Base de datos online en el puerto ${res.port}`);
});

// Inicio del servidor
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});