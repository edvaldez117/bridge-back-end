const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./verificaciones'));
app.use(require('./marca'));
app.use(require('./modelo'));
app.use(require('./auto'));
app.use(require('./tarjeta'));
app.use(require('./compra'));
app.use(require('./reportes'));
app.use(require('./wish-list'));
app.use(require('./mensaje'));
app.use(require('./cuenta'));
app.use(require('./contacto'));
app.use(require('./comentario'));

module.exports = app;