'use strict';
const { Router } = require('express');
const s = require('../servicos/familias');
const { validar, regra, idNumerico } = require('../middlewares/validacao');

const rotas = Router();

rotas.get('/', (req, res) => res.json(s.listar()));
rotas.get('/:id', (req, res) => res.json(s.buscarPorId(idNumerico(req.params.id))));

rotas.post('/', (req, res) => {
  const dados = validar(req.body, {
    responsavel: [regra.obrigatorio, regra.texto(120)],
    email:       [regra.obrigatorio, regra.email],
    telefone:    [regra.obrigatorio, regra.texto(20)],
    cidade:      [regra.obrigatorio, regra.texto(80)],
    bairro:      [regra.obrigatorio, regra.texto(80)],
  });
  const criada = s.criar(dados);
  res.status(201).location(`/familias/${criada.id}`).json(criada);
});

rotas.patch('/:id', (req, res) => {
  const dados = validar(req.body, {
    responsavel: [regra.texto(120)],
    telefone:    [regra.texto(20)],
    cidade:      [regra.texto(80)],
    bairro:      [regra.texto(80)],
  });
  res.json(s.atualizar(idNumerico(req.params.id), dados));
});

rotas.delete('/:id', (req, res) => {
  s.remover(idNumerico(req.params.id));
  res.status(204).end();
});

rotas.get('/:id/idosos', (req, res) => res.json(s.listarIdosos(idNumerico(req.params.id))));

rotas.post('/:id/idosos', (req, res) => {
  const dados = validar(req.body, {
    nome:     [regra.obrigatorio, regra.texto(120)],
    idade:    [regra.obrigatorio, regra.inteiro(40, 120)],
    condicao: [regra.texto(300)],
  });
  res.status(201).json(s.adicionarIdoso(idNumerico(req.params.id), dados));
});

module.exports = rotas;
