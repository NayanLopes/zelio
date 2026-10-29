'use strict';
const { db } = require('../db');

const COLUNAS = `c.id, c.nome, c.email, c.telefone, c.cidade, c.bairro,
  c.anos_experiencia, c.valor_diaria, c.valor_hora, c.status_verificacao, c.criado_em`;

const buscarPorId = (id) =>
  db.prepare(`SELECT ${COLUNAS} FROM cuidadores c WHERE c.id = ?`).get(id);

function listar(filtros = {}, somenteAprovados = true) {
  const cond = [];
  const params = [];

  if (somenteAprovados) cond.push(`c.status_verificacao = 'aprovado'`);
  if (filtros.cidade) { cond.push('c.cidade = ?'); params.push(filtros.cidade); }
  if (filtros.bairro) { cond.push('c.bairro = ?'); params.push(filtros.bairro); }
  if (filtros.especialidade) {
    cond.push(`c.id IN (SELECT ce.cuidador_id FROM cuidador_especialidades ce
               JOIN especialidades e ON e.id = ce.especialidade_id WHERE e.nome = ?)`);
    params.push(filtros.especialidade);
  }
  if (filtros.valor_diaria_max !== undefined) {
    cond.push('c.valor_diaria <= ?'); params.push(filtros.valor_diaria_max);
  }

  const where = cond.length ? 'WHERE ' + cond.join(' AND ') : '';
  return db.prepare(`SELECT ${COLUNAS} FROM cuidadores c ${where} ORDER BY c.nome`).all(...params);
}

function inserir(dados) {
  const info = db.prepare(`
    INSERT INTO cuidadores (nome, email, telefone, cidade, bairro, anos_experiencia, valor_diaria, valor_hora)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(dados.nome, dados.email, dados.telefone, dados.cidade, dados.bairro,
         dados.anos_experiencia ?? 0, dados.valor_diaria, dados.valor_hora);
  return Number(info.lastInsertRowid);
}

const atualizar = (id, campos, valores) =>
  db.prepare(`UPDATE cuidadores SET ${campos.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`)
    .run(...valores, id);

const definirStatusVerificacao = (id, status) =>
  db.prepare('UPDATE cuidadores SET status_verificacao = ? WHERE id = ?').run(status, id);

const remover = (id) => db.prepare('DELETE FROM cuidadores WHERE id = ?').run(id);

const contarPlantoesEmAberto = (id) => db.prepare(
  `SELECT COUNT(*) AS n FROM plantoes WHERE cuidador_id = ? AND status IN ('solicitado','aceito')`
).get(id).n;

const especialidadesDe = (cuidadorId) => db.prepare(`
  SELECT e.id, e.nome FROM especialidades e
  JOIN cuidador_especialidades ce ON ce.especialidade_id = e.id
  WHERE ce.cuidador_id = ?  ORDER BY e.nome
`).all(cuidadorId);

function substituirEspecialidades(cuidadorId, ids) {
  db.prepare('DELETE FROM cuidador_especialidades WHERE cuidador_id = ?').run(cuidadorId);
  const ins = db.prepare('INSERT INTO cuidador_especialidades (cuidador_id, especialidade_id) VALUES (?, ?)');
  for (const eid of ids) ins.run(cuidadorId, eid);
}

function inserirDocumento(cuidadorId, tipo) {
  const info = db.prepare('INSERT INTO documentos (cuidador_id, tipo) VALUES (?, ?)')
    .run(cuidadorId, tipo);
  return db.prepare('SELECT * FROM documentos WHERE id = ?').get(Number(info.lastInsertRowid));
}

const listarDocumentos = (cuidadorId) =>
  db.prepare('SELECT * FROM documentos WHERE cuidador_id = ? ORDER BY enviado_em').all(cuidadorId);

const definirStatusDosDocumentos = (cuidadorId, status) => db.prepare(
  `UPDATE documentos SET status = ?, conferido_em = datetime('now') WHERE cuidador_id = ?`
).run(status, cuidadorId);

const reputacaoDe = (cuidadorId) => db.prepare(`
  SELECT COUNT(*) AS total, AVG(a.nota) AS media
  FROM avaliacoes a JOIN plantoes p ON p.id = a.plantao_id
  WHERE p.cuidador_id = ? AND a.autor = 'familia'
`).get(cuidadorId);

const avaliacoesRecebidas = (cuidadorId) => db.prepare(`
  SELECT a.id, a.nota, a.comentario, a.criado_em, f.responsavel AS autor
  FROM avaliacoes a
  JOIN plantoes p ON p.id = a.plantao_id
  JOIN idosos   i ON i.id = p.idoso_id
  JOIN familias f ON f.id = i.familia_id
  WHERE p.cuidador_id = ? AND a.autor = 'familia'
  ORDER BY a.criado_em DESC
`).all(cuidadorId);

module.exports = {
  buscarPorId, listar, inserir, atualizar, definirStatusVerificacao, remover,
  contarPlantoesEmAberto, especialidadesDe, substituirEspecialidades,
  inserirDocumento, listarDocumentos, definirStatusDosDocumentos,
  reputacaoDe, avaliacoesRecebidas,
};
