'use strict';
const { Router } = require('express');
const { db, driver } = require('../db');

const rotas = Router();

rotas.get('/', (req, res) => {
  res.json({
    nome: 'Zelio API',
    versao: '1.0.0',
    descricao: 'Marketplace que conecta familias a cuidadores de idosos autonomos',
    driver_sqlite: driver,
    recursos: ['/especialidades', '/cuidadores', '/familias', '/plantoes'],
  });
});

rotas.get('/especialidades', (req, res) => {
  res.json(db.prepare('SELECT * FROM especialidades ORDER BY nome').all());
});

rotas.use('/cuidadores', require('./cuidadores'));
rotas.use('/familias', require('./familias'));
rotas.use('/plantoes', require('./plantoes'));

module.exports = rotas;
