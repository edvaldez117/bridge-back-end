const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const temaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre del tema es obligatorio']
    },
    colorPrimario: {
        type: String,
        required: [true, 'El color primario es obligatorio']
    },
    colorFuente: {
        type: String,
        required: [true, 'El color de la fuente es obligatorio']
    },
    colorSecundario: {
        type: String,
        required: [true, 'El color secundario es obligatorio']
    },
    colorAcentuador: {
        type: String,
        required: [true, 'El color acentuador es obligatorio']
    },
    fondo: {
        type: String,
        required: [true, 'El color de fondo es obligatorio']
    },
    activo: {
        type: Boolean,
        default: true
    }
});

temaSchema.plugin(uniqueValidator, { message: 'El {PATH} del tema debe ser único' });

module.exports = mongoose.model('Tema', temaSchema, 'tema');