'use strict';
const { db } = require('../db');

const doPlantao = (plantaoId) =>
  db.prepare('SELECT * FROM avaliacoes WHERE plantao_id = ? ORDER BY criado_em').all(plantaoId);

const resumoDoPlantao = (plantaoId) =>
  db.prepare('SELECT id, autor, nota, comentario, criado_em FROM avaliacoes WHERE plantao_id = ?')
    .all(plantaoId);

const existeDoAutor = (plantaoId, autor) =>
  Boolean(db.prepare('SELECT 1 FROM avaliacoes WHERE plantao_id = ? AND autor = ?').get(plantaoId, autor));

function inserir(plantaoId, dados) {
  const info = db.prepare(
    'INSERT INTO avaliacoes (plantao_id, autor, nota, comentario) VALUES (?, ?, ?, ?)'
  ).run(plantaoId, dados.autor, dados.nota, dados.comentario ?? null);
  return db.prepare('SELECT * FROM avaliacoes WHERE id = ?').get(Number(info.lastInsertRowid));
}

module.exports = { doPlantao, resumoDoPlantao, existeDoAutor, inserir };
