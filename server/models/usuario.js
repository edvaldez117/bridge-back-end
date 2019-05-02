const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const nombreCompletoSchema = new Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre es obligatorio.']
    },
    apellido1: {
        type: String,
        required: [true, 'El primer apellido es obligatorio']
    },
    apellido2: {
        type: String
    }
}, { _id: false });

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
        default: 'default.jpg'
    },
    nombreCompleto: {
        type: nombreCompletoSchema,
        required: [true, 'El nombre completo es obligatorio']
    },
    codigoPostal: {
        type: String,
        required: [true, 'El código postal es obligatorio']
    },
    telefono: {
        type: String,
        unique: true,
        required: [true, 'El teléfono es obligatorio']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tema: {
        type: Schema.Types.ObjectId,
        ref: 'Tema'
    },
    activo: {
        type: Boolean,
        deafult: true,
        required: true
    }
});

usuarioSchema.methods.toJSON = function() {
    let usuario = this.toObject();
    delete usuario._id;
    delete usuario.contrasena;
    delete usuario.activo;
    return usuario;
}

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuario');