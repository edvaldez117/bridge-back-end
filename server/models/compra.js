const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const compraSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    auto: {
        type: Schema.Types.ObjectId,
        ref: 'Auto',
        unique: true,
        required: [true, 'El auto es obligatorio']
    },
    tarjeta: {
        type: Schema.Types.ObjectId,
        ref: 'Tarjeta',
        required: [true, 'La tarjeta es obligatoria']
    },
    proveedorDeEnvio: {
        type: Schema.Types.ObjectId,
        ref: 'ProveedorDeEnvio'
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    },
    iva: {
        type: Number,
        required: [true, 'El IVA es obligatorio']
    },
    comision: {
        type: Number,
        required: [true, 'La comision es obligatoria']
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    costoEnvio: {
        type: Number,
        required: [true, 'El costo de envio es obligatorio']
    }
});

compraSchema.plugin(uniqueValidator, { message: 'El {PATH} ya fue comprado' });

module.exports = mongoose.model('Compra', compraSchema, 'compra');