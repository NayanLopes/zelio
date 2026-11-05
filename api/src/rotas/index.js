'use strict';
const { Router } = require('express');
const { driver } = require('../db');
const especialidades = require('../repositorios/especialidades');
const { autenticar } = require('../middlewares/autenticacao');

const rotas = Router();

rotas.get('/', (req, res) => {
  res.json({
    nome: 'Zelio API',
    versao: '1.0.0',
    descricao: 'Marketplace que conecta familias a cuidadores de idosos autonomos',
    driver_sqlite: driver,
    recursos: ['/sessoes', '/eu', '/especialidades', '/cuidadores', '/familias', '/plantoes'],
  });
});

rotas.get('/especialidades', (req, res) => res.json(especialidades.listar()));

rotas.use('/sessoes', require('./sessoes'));
rotas.get('/eu', autenticar, (req, res) => res.json(req.usuario));

rotas.use('/cuidadores', require('./cuidadores'));
rotas.use('/familias', require('./familias'));
rotas.use('/plantoes', require('./plantoes'));

module.exports = rotas;
