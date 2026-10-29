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

module.exports = { listar, buscarPorId, criar, atualizar, remover,
                   listarIdosos, adicionarIdoso, buscarIdoso };
