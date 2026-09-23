'use strict';
const { Router } = require('express');
const s = require('../servicos/plantoes');
const avaliacoes = require('../servicos/avaliacoes');
const { validar, regra, idNumerico } = require('../middlewares/validacao');

const rotas = Router();

rotas.get('/', (req, res) => {
  const f = { status: req.query.status };
  for (const k of ['cuidador_id', 'idoso_id', 'familia_id']) {
    if (req.query[k]) f[k] = idNumerico(req.query[k], k);
  }
  res.json(s.listar(f));
});

rotas.get('/:id', (req, res) => res.json(s.buscarPorId(idNumerico(req.params.id))));

rotas.post('/', (req, res) => {
  const dados = validar(req.body, {
    cuidador_id: [regra.obrigatorio, regra.inteiro(1)],
    idoso_id:    [regra.obrigatorio, regra.inteiro(1)],
    modalidade:  [regra.obrigatorio, regra.umDe(['horista', 'diaria', 'mensal'])],
    data_inicio: [regra.obrigatorio, regra.data],
    data_fim:    [regra.obrigatorio, regra.data],
    hora_inicio: [regra.obrigatorio, regra.hora],
    hora_fim:    [regra.obrigatorio, regra.hora],
  });
  const criado = s.criar(dados);
  res.status(201).location(`/plantoes/${criado.id}`).json(criado);
});

// RN02 — a mudanca de estado e o unico caminho para confirmar um plantao
rotas.patch('/:id/status', (req, res) => {
  const { status } = validar(req.body, {
    status: [regra.obrigatorio, regra.umDe(['aceito', 'recusado', 'concluido', 'cancelado'])],
  });
  res.json(s.mudarStatus(idNumerico(req.params.id), status));
});

rotas.delete('/:id', (req, res) => {
  s.remover(idNumerico(req.params.id));
  res.status(204).end();
});

rotas.get('/:id/avaliacoes', (req, res) => res.json(avaliacoes.listarDoPlantao(idNumerico(req.params.id))));

// RN03 — so avalia plantao concluido
rotas.post('/:id/avaliacoes', (req, res) => {
  const dados = validar(req.body, {
    autor:      [regra.obrigatorio, regra.umDe(['familia', 'cuidador'])],
    nota:       [regra.obrigatorio, regra.inteiro(1, 5)],
    comentario: [regra.texto(500)],
  });
  res.status(201).json(avaliacoes.criar(idNumerico(req.params.id), dados));
});

module.exports = rotas;
