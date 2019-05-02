const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modeloSchema = new Schema({
    fabricante: {
        type: Schema.Types.ObjectId,
        ref: 'Fabricante',
        required: [true, 'El ID del fabricante es obligatorio.']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del modelo es obligatorio.']
    },
    anio: {
        type: String,
        required: [true, 'El año del modelo es obligatorio.']
    },
    serie: {
        type: String,
        required: [true, 'La serie del modelo es obligatoria.']
    },
    activo: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Modelo', modeloSchema, 'modelo');