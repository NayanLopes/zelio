'use strict';
const { Router } = require('express');
const s = require('../servicos/familias');
const { validar, regra, idNumerico } = require('../middlewares/validacao');
const autenticacao = require('../servicos/autenticacao');
const { autenticar, exigirPapel, exigirMesmaFamilia } = require('../middlewares/autenticacao');

const rotas = Router();

rotas.get('/', autenticar, exigirPapel('admin'), (req, res) => res.json(s.listar()));
rotas.get('/:id', autenticar, exigirMesmaFamilia, (req, res) => res.json(s.buscarPorId(idNumerico(req.params.id))));

rotas.post('/', (req, res) => {
  const dados = validar(req.body, {
    responsavel: [regra.obrigatorio, regra.texto(120)],
    email:       [regra.obrigatorio, regra.email],
    telefone:    [regra.obrigatorio, regra.texto(20)],
    cidade:      [regra.obrigatorio, regra.texto(80)],
    bairro:      [regra.obrigatorio, regra.texto(80)],
    senha:       [regra.texto(72)],
  });
  const criada = s.criar(dados);
  if (dados.senha) {
    autenticacao.registrar({ email: dados.email, senha: dados.senha,
      papel: 'familia', familia_id: criada.id });
  }
  res.status(201).location(`/familias/${criada.id}`).json(criada);
});

rotas.patch('/:id', autenticar, exigirMesmaFamilia, (req, res) => {
  const dados = validar(req.body, {
    responsavel: [regra.texto(120)],
    telefone:    [regra.texto(20)],
    cidade:      [regra.texto(80)],
    bairro:      [regra.texto(80)],
  });
  res.json(s.atualizar(idNumerico(req.params.id), dados));
});

rotas.delete('/:id', autenticar, exigirMesmaFamilia, (req, res) => {
  s.remover(idNumerico(req.params.id));
  res.status(204).end();
});

rotas.get('/:id/idosos', autenticar, exigirMesmaFamilia, (req, res) => res.json(s.listarIdosos(idNumerico(req.params.id))));

rotas.post('/:id/idosos', autenticar, exigirMesmaFamilia, (req, res) => {
  const dados = validar(req.body, {
    nome:     [regra.obrigatorio, regra.texto(120)],
    idade:    [regra.obrigatorio, regra.inteiro(40, 120)],
    condicao: [regra.texto(300)],
  });
  res.status(201).json(s.adicionarIdoso(idNumerico(req.params.id), dados));
});

module.exports = rotas;
