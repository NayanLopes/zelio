'use strict';
const { db } = require('../db');

const buscarPorId = (id) => db.prepare('SELECT * FROM familias WHERE id = ?').get(id);
const listar = () => db.prepare('SELECT * FROM familias ORDER BY responsavel').all();

function inserir(dados) {
  const info = db.prepare(`
    INSERT INTO familias (responsavel, email, telefone, cidade, bairro) VALUES (?, ?, ?, ?, ?)
  `).run(dados.responsavel, dados.email, dados.telefone, dados.cidade, dados.bairro);
  return Number(info.lastInsertRowid);
}

const atualizar = (id, campos, valores) =>
  db.prepare(`UPDATE familias SET ${campos.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`)
    .run(...valores, id);

const remover = (id) => db.prepare('DELETE FROM familias WHERE id = ?').run(id);

const contarPlantoesEmAberto = (familiaId) => db.prepare(`
  SELECT COUNT(*) AS n FROM plantoes p JOIN idosos i ON i.id = p.idoso_id
  WHERE i.familia_id = ? AND p.status IN ('solicitado','aceito')
`).get(familiaId).n;

const listarIdosos = (familiaId) =>
  db.prepare('SELECT * FROM idosos WHERE familia_id = ? ORDER BY nome').all(familiaId);

const buscarIdoso = (idosoId) => db.prepare('SELECT * FROM idosos WHERE id = ?').get(idosoId);

function inserirIdoso(familiaId, dados) {
  const info = db.prepare('INSERT INTO idosos (familia_id, nome, idade, condicao) VALUES (?, ?, ?, ?)')
    .run(familiaId, dados.nome, dados.idade, dados.condicao ?? null);
  return db.prepare('SELECT * FROM idosos WHERE id = ?').get(Number(info.lastInsertRowid));
}

module.exports = { buscarPorId, listar, inserir, atualizar, remover, contarPlantoesEmAberto,
                   listarIdosos, buscarIdoso, inserirIdoso };
