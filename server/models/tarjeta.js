const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tarjetaSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    tipo: {
        type: String,
        default: 'Debito',
        enum: {
            values: ['Debito', 'Credito'],
            message: '{VALUE} no es un tipo de tarjeta valido'
        }
    },
    numero: {
        type: String,
        required: [true, 'El numero de tarjeta es obligatorio']
    },
    fechaVencimiento: {
        type: String,
        required: [true, 'La fecha de vencimiento es obligatoria']
    },
    codigo: {
        type: String,
        required: [true, 'El código de la tarjeta es obligatorio']
    },
    titular: {
        type: String,
        required: [true, 'El titular es obligatorio']
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Tarjeta', tarjetaSchema, 'tarjeta');