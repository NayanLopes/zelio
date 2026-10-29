'use strict';
const { db } = require('../db');

const buscarPorId = (id) => db.prepare('SELECT * FROM plantoes WHERE id = ?').get(id);

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
  return db.prepare(`SELECT p.* FROM plantoes p ${where} ORDER BY p.criado_em DESC`).all(...params);
}

function inserir(dados, valorTotal) {
  const info = db.prepare(`
    INSERT INTO plantoes (cuidador_id, idoso_id, modalidade, data_inicio, data_fim,
                          hora_inicio, hora_fim, valor_total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(dados.cuidador_id, dados.idoso_id, dados.modalidade, dados.data_inicio,
         dados.data_fim, dados.hora_inicio, dados.hora_fim, valorTotal);
  return Number(info.lastInsertRowid);
}

const atualizarStatus = (id, status) =>
  db.prepare('UPDATE plantoes SET status = ? WHERE id = ?').run(status, id);

const remover = (id) => db.prepare('DELETE FROM plantoes WHERE id = ?').run(id);

const contarSobreposicoes = (cuidadorId, inicio, fim) => db.prepare(`
  SELECT COUNT(*) AS n FROM plantoes
  WHERE cuidador_id = ? AND status IN ('solicitado','aceito')
    AND NOT (data_fim < ? OR data_inicio > ?)
`).get(cuidadorId, inicio, fim).n;

const cuidadorResumido = (id) =>
  db.prepare('SELECT id, nome, cidade, bairro FROM cuidadores WHERE id = ?').get(id);

const idosoResumido = (id) =>
  db.prepare('SELECT id, nome, idade, condicao, familia_id FROM idosos WHERE id = ?').get(id);

module.exports = { buscarPorId, listar, inserir, atualizarStatus, remover,
                   contarSobreposicoes, cuidadorResumido, idosoResumido };
