'use strict';
const { db } = require('../db');
const AppError = require('../erros/AppError');
const plantoes = require('./plantoes');

/** RN03 — so se avalia plantao concluido, e cada lado avalia uma vez. */
function criar(plantaoId, dados) {
  const p = plantoes.buscarPorId(plantaoId);
  if (p.status !== 'concluido') {
    throw AppError.conflito(`So e possivel avaliar um plantao concluido. Este esta '${p.status}'.`);
  }
  const jaTem = db.prepare('SELECT 1 FROM avaliacoes WHERE plantao_id = ? AND autor = ?')
                  .get(plantaoId, dados.autor);
  if (jaTem) throw AppError.conflito(`O lado '${dados.autor}' ja avaliou este plantao`);

  const info = db.prepare(
    'INSERT INTO avaliacoes (plantao_id, autor, nota, comentario) VALUES (?, ?, ?, ?)'
  ).run(plantaoId, dados.autor, dados.nota, dados.comentario ?? null);
  return db.prepare('SELECT * FROM avaliacoes WHERE id = ?').get(Number(info.lastInsertRowid));
}

function listarDoPlantao(plantaoId) {
  plantoes.buscarPorId(plantaoId);
  return db.prepare('SELECT * FROM avaliacoes WHERE plantao_id = ? ORDER BY criado_em').all(plantaoId);
}

module.exports = { criar, listarDoPlantao };
