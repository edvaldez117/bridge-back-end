const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wishListSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    auto: {
        type: Schema.Types.ObjectId,
        ref: 'Auto',
        required: [true, 'El auto es obligatorio']
    }
}, {
    versionKey: false
});

wishListSchema.methods.toJSON = function() {
    let wishList = this.toObject();
    delete wishList.usuario;
    return wishList;
}

module.exports = mongoose.model('WishList', wishListSchema, 'wishList');