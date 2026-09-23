'use strict';
const express = require('express');
const rotas = require('./rotas');
const { rotaNaoEncontrada, tratadorDeErros } = require('./middlewares/erros');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/', rotas);

app.use(rotaNaoEncontrada);
app.use(tratadorDeErros);

module.exports = app;
