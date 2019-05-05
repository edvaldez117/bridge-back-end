const path = require('path');
const fs = require('fs');

const borrarArchivo = (nombreImagen, tipo) => {
    const pathImagen = getPathImagen(nombreImagen, tipo);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

const getPathImagen = (nombreImagen, tipo) => {
    return path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
}

module.exports = {
    borrarArchivo,
    getPathImagen
}