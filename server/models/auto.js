const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const autoSchema = new Schema({
    modelo: {
        type: Schema.Types.ObjectId,
        ref: 'Modelo',
        required: [true, 'El modelo del auto es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    precio: {
        type: Number,
        required: [true, 'El precio del auto es obligatorio']
    },
    extranjero: {
        type: Boolean,
        default: false
    },
    kilometraje: {
        type: Number,
        required: [true, 'El kilometraje del automovil es obligatorio']
    },
    totalDuenos: {
        type: Number,
        default: '1'
    },
    totalAccidentes: {
        type: Number,
        default: 0
    },
    tipoMotor: {
        type: String,
        required: [true, 'El tipo de motor es obligatorio']
    },
    transmision: {
        type: Number,
        default: 0,
        enum: {
            values: [0, 1],
            message: '{VALUE} no es un tipo de transmision válido'
        }
    },
    alarma: {
        type: Boolean,
        default: true
    },
    aireAcondicionado: {
        type: Boolean,
        default: true
    },
    colorInterior: {
        type: String,
        required: [true, 'El color interior es obligatorio']
    },
    colorExterior: {
        type: String,
        required: [true, 'El color exterior es obligatorio']
    },
    vidriosElectricos: {
        type: Boolean,
        default: true
    },
    puertasElectricas: {
        type: Boolean,
        default: false
    },
    bolsasDeAirePiloto: {
        type: Boolean,
        default: true
    },
    bolsasDeAirePasajero: {
        type: Boolean,
        default: true
    },
    bolsasDeAireLaterales: {
        type: Boolean,
        default: true
    },
    seguroDeNinos: {
        type: Boolean,
        default: true
    },
    controlDeEstabilidad: {
        type: Boolean,
        default: true
    },
    bluetooth: {
        type: Boolean,
        default: true
    },
    sensorFrontal: {
        type: Boolean,
        default: true
    },
    sensorTrasero: {
        type: Boolean,
        default: true
    },
    camaraTrasera: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Auto', autoSchema, 'auto');