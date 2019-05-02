const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mensajeSchema = new Schema({
    remitente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del remitente es obligatorio.']
    },
    destinatario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del destinatario es obligatorio.']
    },
    contenido: {
        type: String,
        required: [true, 'El contenido del mensaje no puede estar vacío.']
    }
});

module.exports = mongoose.model('Mensaje', mensajeSchema, 'mensaje');