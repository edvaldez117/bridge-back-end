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

module.exports = app;