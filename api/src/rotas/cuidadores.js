'use strict';
const { Router } = require('express');
const s = require('../servicos/cuidadores');
const { validar, regra, idNumerico } = require('../middlewares/validacao');

const rotas = Router();

const esquemaCriacao = {
  nome:             [regra.obrigatorio, regra.texto(120)],
  email:            [regra.obrigatorio, regra.email],
  telefone:         [regra.obrigatorio, regra.texto(20)],
  cidade:           [regra.obrigatorio, regra.texto(80)],
  bairro:           [regra.obrigatorio, regra.texto(80)],
  anos_experiencia: [regra.inteiro(0, 70)],
  valor_diaria:     [regra.obrigatorio, regra.numero(0)],
  valor_hora:       [regra.obrigatorio, regra.numero(0)],
  especialidades:   [regra.listaDeInteiros],
};

rotas.get('/', (req, res) => {
  const f = {
    cidade: req.query.cidade,
    bairro: req.query.bairro,
    especialidade: req.query.especialidade,
    incluir_nao_aprovados: req.query.incluir_nao_aprovados === 'true',
  };
  if (req.query.nota_minima) f.nota_minima = Number(req.query.nota_minima);
  if (req.query.valor_diaria_max) f.valor_diaria_max = Number(req.query.valor_diaria_max);
  res.json(s.listar(f));
});

rotas.get('/:id', (req, res) => res.json(s.buscarPorId(idNumerico(req.params.id))));

rotas.post('/', (req, res) => {
  const dados = validar(req.body, esquemaCriacao);
  const criado = s.criar(dados);
  res.status(201).location(`/cuidadores/${criado.id}`).json(criado);
});

rotas.patch('/:id', (req, res) => {
  const dados = validar(req.body, {
    nome:             [regra.texto(120)],
    telefone:         [regra.texto(20)],
    cidade:           [regra.texto(80)],
    bairro:           [regra.texto(80)],
    anos_experiencia: [regra.inteiro(0, 70)],
    valor_diaria:     [regra.numero(0)],
    valor_hora:       [regra.numero(0)],
    especialidades:   [regra.listaDeInteiros],
  });
  res.json(s.atualizar(idNumerico(req.params.id), dados));
});

// RF11 — decisao do administrador
rotas.patch('/:id/verificacao', (req, res) => {
  const { status_verificacao } = validar(req.body, {
    status_verificacao: [regra.obrigatorio, regra.umDe(['pendente', 'aprovado', 'reprovado'])],
  });
  res.json(s.definirVerificacao(idNumerico(req.params.id), status_verificacao));
});

rotas.delete('/:id', (req, res) => {
  s.remover(idNumerico(req.params.id));
  res.status(204).end();
});

rotas.get('/:id/documentos', (req, res) => res.json(s.listarDocumentos(idNumerico(req.params.id))));

rotas.post('/:id/documentos', (req, res) => {
  const { tipo } = validar(req.body, {
    tipo: [regra.obrigatorio, regra.umDe(['antecedentes', 'certificado', 'identidade'])],
  });
  res.status(201).json(s.adicionarDocumento(idNumerico(req.params.id), tipo));
});

rotas.get('/:id/avaliacoes', (req, res) => res.json(s.avaliacoesRecebidas(idNumerico(req.params.id))));

module.exports = rotas;
