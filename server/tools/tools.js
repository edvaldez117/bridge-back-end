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

const base64 = (nombreImagen, tipo) => {
    let formato;
    let imagenBase64;
    let pathImagen = getPathImagen(nombreImagen, tipo);
    if (!fs.existsSync(pathImagen)) {
        nombreImagen = "default.jpg";
        pathImagen = getPathImagen(nombreImagen, tipo);
    }
    formato = nombreImagen.split('.');
    formato = formato[formato.length - 1];
    imagenBase64 = fs.readFileSync(pathImagen, { encoding: 'base64' });
    return `data:image/${formato};base64,${imagenBase64}`;
}

const getImagenesAuto = (auto) => {
    let imagenesBase64 = [];
    for (const imagen of auto.imagenes) {
        imagenesBase64.push(base64(imagen, 'autos'));
    }
    auto.imagenes = imagenesBase64;
}

module.exports = {
    borrarArchivo,
    base64,
    getImagenesAuto
}