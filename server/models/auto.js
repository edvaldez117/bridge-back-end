const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongoose.Schema;

const autoSchema = new Schema({
    modelo: {
        type: Schema.Types.ObjectId,
        ref: 'Modelo',
        autopopulate: {
            match: {
                activo: true
            }
        },
        required: [true, 'El ID del modelo del auto es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del usuario es obligatorio']
    },
    precio: {
        type: Number,
        required: [true, 'El precio del auto es obligatorio']
    },
    extranjero: {
        type: Boolean,
        default: false,
        required: [true, 'Es necesario especificar si el auto es extranjero o no']
    },
    kilometraje: {
        type: Number,
        required: [true, 'El kilometraje del automovil es obligatorio']
    },
    totalDuenos: {
        type: Number,
        default: 1,
        required: [true, 'Es necesario especificar el total de dueños']
    },
    totalAccidentes: {
        type: Number,
        default: 0,
        required: [true, 'Es necesario especificar el número de accidentes que ha tenido el auto']
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
        },
        required: [true, 'Es necesario especificar el tipo de transmision']
    },
    alarma: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con alarma']
    },
    aireAcondicionado: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con aire acondicionado']
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
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con vidrios electricos']
    },
    puertasElectricas: {
        type: Boolean,
        default: false,
        required: [true, 'Es necesario especificar si el auto cuenta con puertas electricas']
    },
    bolsasDeAirePiloto: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con bolsas de aire para el piloto']
    },
    bolsasDeAirePasajero: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con bolsas de aire para el pasajero']
    },
    bolsasDeAireLaterales: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con bolsas de aire laterales']
    },
    seguroDeNinos: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si las puertas cuenta con seguro para niños']
    },
    controlDeEstabilidad: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con control de estabilidad']
    },
    bluetooth: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con bluetooth']
    },
    sensorFrontal: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con sensor frontal']
    },
    sensorTrasero: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con sensor trasero']
    },
    camaraTrasera: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario especificar si el auto cuenta con camara trasera']
    },
    imagenes: {
        type: [String],
        default: ['default.jpg'],
        required: true
    },
    autoVendido: {
        type: Boolean,
        default: false,
        required: [true, 'Es necesario especificar si el auto está vendido']
    }
}, {
    versionKey: false
});

autoSchema.methods.toJSON = function() {
    let auto = this.toObject();
    if (auto.modelo) {
        delete auto.modelo.activo;
        if (auto.modelo.marca) {
            delete auto.modelo.marca.activo;
        }
    }
    return auto;
}

autoSchema.plugin(autopopulate);

module.exports = mongoose.model('Auto', autoSchema, 'auto');