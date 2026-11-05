'use strict';
const { db } = require('../db');

function inserir(usuarioId, tokenHash, expiraEm) {
  const info = db.prepare(
    'INSERT INTO sessoes (usuario_id, token_hash, expira_em) VALUES (?, ?, ?)'
  ).run(usuarioId, tokenHash, expiraEm);
  return Number(info.lastInsertRowid);
}

const porTokenHash = (tokenHash) => db.prepare(`
  SELECT s.id, s.usuario_id, s.expira_em,
         u.email, u.papel, u.familia_id, u.cuidador_id
  FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
  WHERE s.token_hash = ?
`).get(tokenHash);

const remover = (id) => db.prepare('DELETE FROM sessoes WHERE id = ?').run(id);

const removerExpiradas = () =>
  db.prepare("DELETE FROM sessoes WHERE expira_em < datetime('now')").run();

module.exports = { inserir, porTokenHash, remover, removerExpiradas };
