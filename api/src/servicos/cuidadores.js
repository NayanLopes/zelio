'use strict';
const AppError = require('../erros/AppError');
const repo = require('../repositorios/cuidadores');
const especialidades = require('../repositorios/especialidades');

function montar(linha) {
  if (!linha) return null;
  const r = repo.reputacaoDe(linha.id);
  return {
    ...linha,
    especialidades: repo.especialidadesDe(linha.id),
    nota_media: r.media === null ? null : Math.round(r.media * 10) / 10,
    total_avaliacoes: r.total,
  };
}

// RN01
function listar(filtros = {}) {
  let lista = repo.listar(filtros, !filtros.incluir_nao_aprovados).map(montar);
  if (filtros.nota_minima !== undefined) {
    lista = lista.filter((c) => c.nota_media !== null && c.nota_media >= filtros.nota_minima);
  }
  return lista;
}

function buscarPorId(id) {
  const linha = repo.buscarPorId(id);
  if (!linha) throw AppError.naoEncontrado('Cuidador');
  return montar(linha);
}

function vincularEspecialidades(cuidadorId, ids) {
  for (const eid of ids) {
    if (!especialidades.existe(eid)) throw AppError.invalido(`Especialidade ${eid} nao existe`);
  }
  repo.substituirEspecialidades(cuidadorId, ids);
}

function criar(dados) {
  const id = repo.inserir(dados);
  if (Array.isArray(dados.especialidades)) vincularEspecialidades(id, dados.especialidades);
  return buscarPorId(id);
}

const ATUALIZAVEIS = ['nome', 'telefone', 'cidade', 'bairro', 'anos_experiencia', 'valor_diaria', 'valor_hora'];

function atualizar(id, dados) {
  buscarPorId(id);
  const campos = ATUALIZAVEIS.filter((c) => dados[c] !== undefined);
  if (campos.length === 0 && dados.especialidades === undefined) {
    throw AppError.invalido('Nenhum campo atualizavel foi enviado');
  }
  if (campos.length > 0) repo.atualizar(id, campos, campos.map((c) => dados[c]));
  if (Array.isArray(dados.especialidades)) vincularEspecialidades(id, dados.especialidades);
  return buscarPorId(id);
}

// RF11
function definirVerificacao(id, status) {
  buscarPorId(id);
  repo.definirStatusVerificacao(id, status);
  if (status !== 'pendente') {
    repo.definirStatusDosDocumentos(id, status === 'aprovado' ? 'aprovado' : 'reprovado');
  }
  return buscarPorId(id);
}

function remover(id) {
  buscarPorId(id);
  if (repo.contarPlantoesEmAberto(id) > 0) {
    throw AppError.conflito('Nao e possivel remover um cuidador com plantoes solicitados ou aceitos');
  }
  repo.remover(id);
}

function adicionarDocumento(cuidadorId, tipo) {
  buscarPorId(cuidadorId);
  return repo.inserirDocumento(cuidadorId, tipo);
}

function listarDocumentos(cuidadorId) {
  buscarPorId(cuidadorId);
  return repo.listarDocumentos(cuidadorId);
}

function avaliacoesRecebidas(cuidadorId) {
  buscarPorId(cuidadorId);
  return repo.avaliacoesRecebidas(cuidadorId);
}

module.exports = { listar, buscarPorId, criar, atualizar, definirVerificacao, remover,
                   adicionarDocumento, listarDocumentos, avaliacoesRecebidas };
