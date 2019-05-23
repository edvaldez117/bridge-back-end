const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./verificaciones'));
app.use(require('./marca'));
app.use(require('./modelo'));

module.exports = app;