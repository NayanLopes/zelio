'use strict';
const { db } = require('../db');

const doPlantao = (plantaoId) =>
  db.prepare('SELECT * FROM avisos WHERE plantao_id = ? ORDER BY criado_em DESC').all(plantaoId);

const resumoDoPlantao = (plantaoId) =>
  db.prepare(`SELECT id, tipo, minutos_atraso, mensagem, criado_em
              FROM avisos WHERE plantao_id = ? ORDER BY criado_em DESC`).all(plantaoId);

function inserir(plantaoId, dados) {
  const info = db.prepare(
    'INSERT INTO avisos (plantao_id, tipo, minutos_atraso, mensagem) VALUES (?, ?, ?, ?)'
  ).run(plantaoId, dados.tipo, dados.minutos_atraso ?? null, dados.mensagem ?? null);
  return db.prepare('SELECT * FROM avisos WHERE id = ?').get(Number(info.lastInsertRowid));
}

module.exports = { doPlantao, resumoDoPlantao, inserir };
