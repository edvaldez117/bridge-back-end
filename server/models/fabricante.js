const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const fabricanteSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre del fabricante es obligatorio.']
    },
    pais: {
        type: String,
        required: [true, 'El país del fabricante es obligatorio.']
    },
    paginaWeb: {
        type: String
    },
    activo: {
        type: Boolean,
        default: true
    }
});

fabricanteSchema.plugin(uniqueValidator, { message: 'El {PATH} del fabricante debe ser único.' });

module.exports = mongoose.model('Fabricante', fabricanteSchema, 'fabricante');