'use strict';
const { Router } = require('express');
const autenticacao = require('../servicos/autenticacao');
const { validar, regra } = require('../middlewares/validacao');
const { autenticar } = require('../middlewares/autenticacao');

const rotas = Router();

rotas.post('/', (req, res) => {
  const dados = validar(req.body, {
    email: [regra.obrigatorio, regra.email],
    senha: [regra.obrigatorio, regra.texto(72)],
  });
  const sessao = autenticacao.entrar(dados.email, dados.senha);
  res.status(201).json(sessao);
});

rotas.delete('/', autenticar, (req, res) => {
  autenticacao.sair((req.get('authorization') || '').split(' ')[1]);
  res.status(204).end();
});

module.exports = rotas;
