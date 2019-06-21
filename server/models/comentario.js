const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
    auto: {
        type: Schema.Types.ObjectId,
        ref: 'Auto',
        required: [true, 'El ID del auto es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del usuario es obligatorio']
    },
    contenido: {
        type: String,
        required: [true, 'El contenido es obligatorio']
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Comentario', comentarioSchema, 'comentario');