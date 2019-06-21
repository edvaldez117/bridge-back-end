const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const proveedorDeEnvioSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es obligatorio']
    },
    costo: {
        type: Number,
        required: [true, 'El costo es obligatorio']
    },
    diasDeEntrega: {
        type: Number,
        required: [true, 'Los días de entrega son obligatorios']
    }
}, {
    versionKey: false
});

proveedorDeEnvioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

module.exports = mongoose.model('ProveedorDeEnvio', proveedorDeEnvioSchema, 'proveedorDeEnvio');