'use strict';
const { Router } = require('express');
const s = require('../servicos/plantoes');
const avaliacoes = require('../servicos/avaliacoes');
const avisos = require('../servicos/avisos');
const { validar, regra, idNumerico } = require('../middlewares/validacao');
const { autenticar, exigirPapel, exigirParteDoPlantao, exigirCuidadorDoPlantao,
        exigirQuemPodeMudarStatus } = require('../middlewares/autenticacao');

const rotas = Router();

rotas.get('/', autenticar, (req, res) => {
  const f = { status: req.query.status };
  for (const k of ['cuidador_id', 'idoso_id', 'familia_id']) {
    if (req.query[k]) f[k] = idNumerico(req.query[k], k);
  }
  res.json(s.listar(f));
});

rotas.get('/:id', autenticar, exigirParteDoPlantao, (req, res) => res.json(s.buscarPorId(idNumerico(req.params.id))));

rotas.post('/', autenticar, exigirPapel('familia'), (req, res) => {
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

rotas.patch('/:id/status', autenticar, exigirQuemPodeMudarStatus, (req, res) => {
  const { status } = validar(req.body, {
    status: [regra.obrigatorio, regra.umDe(['aceito', 'recusado', 'concluido', 'cancelado'])],
  });
  res.json(s.mudarStatus(idNumerico(req.params.id), status));
});

rotas.delete('/:id', autenticar, exigirParteDoPlantao, (req, res) => {
  s.remover(idNumerico(req.params.id));
  res.status(204).end();
});

rotas.get('/:id/avaliacoes', autenticar, exigirParteDoPlantao, (req, res) => res.json(avaliacoes.listarDoPlantao(idNumerico(req.params.id))));

rotas.post('/:id/avaliacoes', autenticar, exigirParteDoPlantao, (req, res) => {
  const dados = validar(req.body, {
    autor:      [regra.obrigatorio, regra.umDe(['familia', 'cuidador'])],
    nota:       [regra.obrigatorio, regra.inteiro(1, 5)],
    comentario: [regra.texto(500)],
  });
  res.status(201).json(avaliacoes.criar(idNumerico(req.params.id), dados));
});

rotas.get('/:id/avisos', autenticar, exigirParteDoPlantao, (req, res) => res.json(avisos.listarDoPlantao(idNumerico(req.params.id))));

rotas.post('/:id/avisos', autenticar, exigirCuidadorDoPlantao, (req, res) => {
  const dados = validar(req.body, {
    tipo:           [regra.obrigatorio, regra.umDe(['atraso', 'cancelamento'])],
    minutos_atraso: [regra.inteiro(1, 720)],
    mensagem:       [regra.texto(280)],
  });
  const criado = avisos.criar(idNumerico(req.params.id), dados);
  res.status(201).location(`/plantoes/${req.params.id}/avisos`).json(criado);
});

module.exports = rotas;
