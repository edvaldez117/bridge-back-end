const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mensajeSchema = new Schema({
    remitente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del remitente es obligatorio']
    },
    destinatario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del destinatario es obligatorio']
    },
    contenido: {
        type: String,
        required: [true, 'El contenido del mensaje no puede estar vacío']
    },
    mensajeLeido: {
        type: Boolean,
        default: false,
        required: [true, 'El estado del mensaje es obligatorio']
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Mensaje', mensajeSchema, 'mensaje');