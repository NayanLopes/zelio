'use strict';
const { db } = require('../db');
const AppError = require('../erros/AppError');
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
  const idoso = db.prepare('SELECT id, nome, idade, condicao, familia_id FROM idosos WHERE id = ?').get(linha.idoso_id);
  const cuidador = db.prepare('SELECT id, nome, cidade, bairro FROM cuidadores WHERE id = ?').get(linha.cuidador_id);
  const avaliacoes = db.prepare('SELECT id, autor, nota, comentario, criado_em FROM avaliacoes WHERE plantao_id = ?')
    .all(linha.id);
  return { ...linha, idoso, cuidador, avaliacoes,
           proximos_status: TRANSICOES[linha.status] };
}

function buscarPorId(id) {
  const p = db.prepare('SELECT * FROM plantoes WHERE id = ?').get(id);
  if (!p) throw AppError.naoEncontrado('Plantao');
  return montar(p);
}

function listar(filtros = {}) {
  const cond = [];
  const params = [];
  if (filtros.cuidador_id) { cond.push('p.cuidador_id = ?'); params.push(filtros.cuidador_id); }
  if (filtros.idoso_id)    { cond.push('p.idoso_id = ?');    params.push(filtros.idoso_id); }
  if (filtros.status)      { cond.push('p.status = ?');      params.push(filtros.status); }
  if (filtros.familia_id) {
    cond.push('p.idoso_id IN (SELECT id FROM idosos WHERE familia_id = ?)');
    params.push(filtros.familia_id);
  }
  const where = cond.length ? 'WHERE ' + cond.join(' AND ') : '';
  return db.prepare(`SELECT p.* FROM plantoes p ${where} ORDER BY p.criado_em DESC`)
           .all(...params).map(montar);
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
  const conflito = db.prepare(`
    SELECT COUNT(*) AS n FROM plantoes
    WHERE cuidador_id = ? AND status IN ('solicitado','aceito')
      AND NOT (data_fim < ? OR data_inicio > ?)
  `).get(dados.cuidador_id, dados.data_inicio, dados.data_fim).n;
  if (conflito > 0) {
    throw AppError.conflito('O cuidador ja tem plantao em aberto nesse periodo');
  }

  const valor = calcularValor(cuidador, dados);
  const info = db.prepare(`
    INSERT INTO plantoes (cuidador_id, idoso_id, modalidade, data_inicio, data_fim,
                          hora_inicio, hora_fim, valor_total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(dados.cuidador_id, dados.idoso_id, dados.modalidade, dados.data_inicio,
         dados.data_fim, dados.hora_inicio, dados.hora_fim, valor);
  return buscarPorId(Number(info.lastInsertRowid));
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
  db.prepare('UPDATE plantoes SET status = ? WHERE id = ?').run(novo, id);
  return buscarPorId(id);
}

function remover(id) {
  const p = buscarPorId(id);
  if (p.status === 'concluido') throw AppError.conflito('Plantao concluido nao pode ser removido');
  db.prepare('DELETE FROM plantoes WHERE id = ?').run(id);
}

module.exports = { listar, buscarPorId, criar, mudarStatus, remover, TRANSICOES };
