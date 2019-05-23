const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modeloSchema = new Schema({
    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: [true, 'El ID de la marca es obligatorio']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del modelo es obligatorio']
    },
    activo: {
        type: Boolean,
        required: [true, 'El estado del modelo (activo / inactivo) es obligatorio'],
        default: true
    }
});

module.exports = mongoose.model('Modelo', modeloSchema, 'modelo');