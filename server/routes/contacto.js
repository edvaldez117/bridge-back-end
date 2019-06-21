const axios = require('axios');
const express = require('express');

const app = express();

app.post('/contacto', (req, res) => {

    const { nombre, telefono, correo, mensaje } = req.body;

    axios.post('https://rest.nexmo.com/sms/json',{
        api_key: '5876ada3',
        api_secret: 'zdil6ayRQxsDPpFR',
        to: '524492621398',
        from: nombre,
        text: 'Telefono:' + telefono
            + '\nCorreo: ' + correo
            + '\nMensaje: ' + mensaje
    })
        .then(() => {
            console.log('SMS enviado.');
            res.json({
                ok: true
            });
        })
        .catch(() => {
            console.log('Error an enviar SMS.');
            res.json({
                ok: false
            });
        });

});

module.exports = app;
