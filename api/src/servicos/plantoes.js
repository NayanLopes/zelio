'use strict';
const AppError = require('../erros/AppError');
const repo = require('../repositorios/plantoes');
const avaliacoesRepo = require('../repositorios/avaliacoes');
const avisosRepo = require('../repositorios/avisos');
const cuidadores = require('./cuidadores');
const familias = require('./familias');

/**
 * Transicoes permitidas do plantao. Fora desta tabela, nada passa.
 *
 * RN02 — o plantao nasce 'solicitado' e so o aceite do cuidador o
 * confirma. Nao existe caminho que pule direto para 'aceito'.
 */
const TRANSICOES = {
  solicitado: ['aceito', 'recusado', 'cancelado'],
  aceito:     ['concluido', 'cancelado'],
  recusado:   [],
  concluido:  [],
  cancelado:  [],
};

function montar(linha) {
  if (!linha) return null;
  return {
    ...linha,
    idoso: repo.idosoResumido(linha.idoso_id),
    cuidador: repo.cuidadorResumido(linha.cuidador_id),
    avaliacoes: avaliacoesRepo.resumoDoPlantao(linha.id),
    // RF10 — a lista da familia mostra o aviso em destaque, entao ele vem
    // junto do plantao e nao exige uma segunda requisicao por item.
    avisos: avisosRepo.resumoDoPlantao(linha.id),
    proximos_status: TRANSICOES[linha.status],
  };
}

function buscarPorId(id) {
  const p = repo.buscarPorId(id);
  if (!p) throw AppError.naoEncontrado('Plantao');
  return montar(p);
}

function listar(filtros = {}) {
  return repo.listar(filtros).map(montar);
}

function diasEntre(inicio, fim) {
  const ms = Date.parse(fim + 'T00:00:00Z') - Date.parse(inicio + 'T00:00:00Z');
  return Math.floor(ms / 86400000) + 1;
}

function horasEntre(inicio, fim) {
  const [hi, mi] = inicio.split(':').map(Number);
  const [hf, mf] = fim.split(':').map(Number);
  return (hf * 60 + mf - hi * 60 - mi) / 60;
}

/** Valor total calculado no servidor. O cliente nao dita preco. */
function calcularValor(cuidador, dados) {
  const dias = diasEntre(dados.data_inicio, dados.data_fim);
  const horas = horasEntre(dados.hora_inicio, dados.hora_fim);
  if (dados.modalidade === 'horista') return Math.round(horas * dias * cuidador.valor_hora * 100) / 100;
  if (dados.modalidade === 'diaria')  return Math.round(dias * cuidador.valor_diaria * 100) / 100;
  return Math.round(dias * cuidador.valor_diaria * 0.9 * 100) / 100; // mensal: 10% de desconto
}

function criar(dados) {
  const cuidador = cuidadores.buscarPorId(dados.cuidador_id);
  familias.buscarIdoso(dados.idoso_id);

  // RN01 — nao se contrata quem ainda nao foi aprovado
  if (cuidador.status_verificacao !== 'aprovado') {
    throw AppError.conflito('Este cuidador ainda nao foi aprovado pelo administrador');
  }
  if (Date.parse(dados.data_fim) < Date.parse(dados.data_inicio)) {
    throw AppError.invalido('Dados invalidos', { data_fim: 'deve ser igual ou posterior a data_inicio' });
  }
  if (horasEntre(dados.hora_inicio, dados.hora_fim) <= 0) {
    throw AppError.invalido('Dados invalidos', { hora_fim: 'deve ser posterior a hora_inicio' });
  }
  if (repo.contarSobreposicoes(dados.cuidador_id, dados.data_inicio, dados.data_fim) > 0) {
    throw AppError.conflito('O cuidador ja tem plantao em aberto nesse periodo');
  }

  return buscarPorId(repo.inserir(dados, calcularValor(cuidador, dados)));
}

function mudarStatus(id, novo) {
  const p = buscarPorId(id);
  const permitidos = TRANSICOES[p.status];
  if (!permitidos.includes(novo)) {
    throw AppError.conflito(
      `Nao e possivel mudar de '${p.status}' para '${novo}'. ` +
      (permitidos.length ? `Transicoes possiveis: ${permitidos.join(', ')}.` : 'Este plantao esta encerrado.')
    );
  }
  repo.atualizarStatus(id, novo);
  return buscarPorId(id);
}

function remover(id) {
  const p = buscarPorId(id);
  if (p.status === 'concluido') throw AppError.conflito('Plantao concluido nao pode ser removido');
  repo.remover(id);
}

module.exports = { listar, buscarPorId, criar, mudarStatus, remover, TRANSICOES };
