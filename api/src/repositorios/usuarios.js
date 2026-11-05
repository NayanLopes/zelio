'use strict';
const { db } = require('../db');

const CAMPOS = 'id, email, papel, familia_id, cuidador_id, criado_em';

const porEmail = (email) =>
  db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

const porId = (id) =>
  db.prepare(`SELECT ${CAMPOS} FROM usuarios WHERE id = ?`).get(id);

function inserir(dados) {
  const info = db.prepare(`
    INSERT INTO usuarios (email, senha_hash, papel, familia_id, cuidador_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(dados.email, dados.senha_hash, dados.papel,
         dados.familia_id ?? null, dados.cuidador_id ?? null);
  return Number(info.lastInsertRowid);
}

module.exports = { porEmail, porId, inserir };
