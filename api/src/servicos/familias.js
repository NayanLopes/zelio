'use strict';
const AppError = require('../erros/AppError');
const repo = require('../repositorios/familias');

const montar = (f) => ({ ...f, idosos: repo.listarIdosos(f.id) });

function buscarPorId(id) {
  const f = repo.buscarPorId(id);
  if (!f) throw AppError.naoEncontrado('Familia');
  return montar(f);
}

function listar() {
  return repo.listar().map(montar);
}

function criar(dados) {
  return buscarPorId(repo.inserir(dados));
}

const ATUALIZAVEIS = ['responsavel', 'telefone', 'cidade', 'bairro'];

function atualizar(id, dados) {
  buscarPorId(id);
  const campos = ATUALIZAVEIS.filter((c) => dados[c] !== undefined);
  if (campos.length === 0) throw AppError.invalido('Nenhum campo atualizavel foi enviado');
  repo.atualizar(id, campos, campos.map((c) => dados[c]));
  return buscarPorId(id);
}

function remover(id) {
  buscarPorId(id);
  if (repo.contarPlantoesEmAberto(id) > 0) {
    throw AppError.conflito('Nao e possivel remover uma familia com plantoes em aberto');
  }
  repo.remover(id);
}

function listarIdosos(familiaId) {
  buscarPorId(familiaId);
  return repo.listarIdosos(familiaId);
}

function adicionarIdoso(familiaId, dados) {
  buscarPorId(familiaId);
  return repo.inserirIdoso(familiaId, dados);
}

function buscarIdoso(idosoId) {
  const i = repo.buscarIdoso(idosoId);
  if (!i) throw AppError.naoEncontrado('Idoso');
  return i;
}

function idosoDaFamilia(familiaId, idosoId) {
  buscarPorId(familiaId);
  const i = repo.buscarIdoso(idosoId);
  if (!i || i.familia_id !== familiaId) throw AppError.naoEncontrado('Idoso');
  return i;
}

const IDOSO_ATUALIZAVEIS = ['nome', 'idade', 'condicao'];

function atualizarIdoso(familiaId, idosoId, dados) {
  idosoDaFamilia(familiaId, idosoId);
  const campos = IDOSO_ATUALIZAVEIS.filter((c) => dados[c] !== undefined);
  if (campos.length === 0) throw AppError.invalido('Nenhum campo atualizavel foi enviado');
  repo.atualizarIdoso(idosoId, campos, campos.map((c) => dados[c]));
  return repo.buscarIdoso(idosoId);
}

function removerIdoso(familiaId, idosoId) {
  idosoDaFamilia(familiaId, idosoId);
  if (repo.contarPlantoesDoIdoso(idosoId) > 0) {
    throw AppError.conflito('Nao e possivel remover um idoso que ja tem plantoes registrados');
  }
  repo.removerIdoso(idosoId);
}

module.exports = { listar, buscarPorId, criar, atualizar, remover,
                   listarIdosos, adicionarIdoso, buscarIdoso, atualizarIdoso, removerIdoso };
