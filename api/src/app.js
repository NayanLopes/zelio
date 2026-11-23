'use strict';
const express = require('express');
const rotas = require('./rotas');
const { rotaNaoEncontrada, tratadorDeErros } = require('./middlewares/erros');

const app = express();

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '600',
  });
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/', rotas);

app.use(rotaNaoEncontrada);
app.use(tratadorDeErros);

module.exports = app;
