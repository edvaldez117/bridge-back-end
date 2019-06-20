const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const nombreCompletoSchema = new Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido1: {
        type: String,
        required: [true, 'El primer apellido es obligatorio']
    },
    apellido2: {
        type: String
    }
}, {
    _id: false
});

const direccionSchema = new Schema({
    codigoPostal: {
        type: String,
        required: [true, 'El código postal es obligatorio']
    },
    colonia: {
        type: String,
        required: [true, 'La colonia es obligatoria']
    },
    calle: {
        type: String,
        required: [true, 'La calle es obligatoria']
    },
    numeroExterior: {
        type: String,
        required: [true, 'El número exterior es obligatorio']
    },
    numeroInterior: {
        type: String
    }
}, {
    _id: false
});

const usuarioSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es obligatorio']
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    imagenPerfil: {
        type: String,
        default: 'default.jpg',
        required: [true, 'La imagen de perfil es obligatoria']
    },
    nombreCompleto: {
        type: nombreCompletoSchema,
        required: [true, 'El nombre completo es obligatorio']
    },
    direccion: {
        type: direccionSchema,
        required: [true, 'La dirección es obligatoria']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: [true, 'El campo isAdmin no puede ser nulo']
    },
    tema: {
        type: Schema.Types.ObjectId,
        ref: 'Tema'
    },
    activo: {
        type: Boolean,
        deafult: true,
        required: [true, 'El campo activo no puede ser nulo']
    }
}, {
    versionKey: false
});

usuarioSchema.methods.toJSON = function() {
    let usuario = this.toObject();
    delete usuario.contrasena;
    delete usuario.activo;
    return usuario;
}

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuario');