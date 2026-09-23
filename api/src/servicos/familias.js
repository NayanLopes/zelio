'use strict';
const { db } = require('../db');
const AppError = require('../erros/AppError');

function buscarPorId(id) {
  const f = db.prepare('SELECT * FROM familias WHERE id = ?').get(id);
  if (!f) throw AppError.naoEncontrado('Familia');
  return { ...f, idosos: listarIdosos(id) };
}

function listar() {
  return db.prepare('SELECT * FROM familias ORDER BY responsavel').all()
           .map((f) => ({ ...f, idosos: listarIdosos(f.id) }));
}

function criar(dados) {
  const info = db.prepare(`
    INSERT INTO familias (responsavel, email, telefone, cidade, bairro) VALUES (?, ?, ?, ?, ?)
  `).run(dados.responsavel, dados.email, dados.telefone, dados.cidade, dados.bairro);
  return buscarPorId(Number(info.lastInsertRowid));
}

const ATUALIZAVEIS = ['responsavel', 'telefone', 'cidade', 'bairro'];

function atualizar(id, dados) {
  buscarPorId(id);
  const campos = ATUALIZAVEIS.filter((c) => dados[c] !== undefined);
  if (campos.length === 0) throw AppError.invalido('Nenhum campo atualizavel foi enviado');
  db.prepare(`UPDATE familias SET ${campos.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`)
    .run(...campos.map((c) => dados[c]), id);
  return buscarPorId(id);
}

function remover(id) {
  buscarPorId(id);
  const emAberto = db.prepare(`
    SELECT COUNT(*) AS n FROM plantoes p JOIN idosos i ON i.id = p.idoso_id
    WHERE i.familia_id = ? AND p.status IN ('solicitado','aceito')
  `).get(id).n;
  if (emAberto > 0) throw AppError.conflito('Nao e possivel remover uma familia com plantoes em aberto');
  db.prepare('DELETE FROM familias WHERE id = ?').run(id);
}

function listarIdosos(familiaId) {
  return db.prepare('SELECT * FROM idosos WHERE familia_id = ? ORDER BY nome').all(familiaId);
}

function adicionarIdoso(familiaId, dados) {
  buscarPorId(familiaId);
  const info = db.prepare('INSERT INTO idosos (familia_id, nome, idade, condicao) VALUES (?, ?, ?, ?)')
    .run(familiaId, dados.nome, dados.idade, dados.condicao ?? null);
  return db.prepare('SELECT * FROM idosos WHERE id = ?').get(Number(info.lastInsertRowid));
}

function buscarIdoso(idosoId) {
  const i = db.prepare('SELECT * FROM idosos WHERE id = ?').get(idosoId);
  if (!i) throw AppError.naoEncontrado('Idoso');
  return i;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover,
                   listarIdosos, adicionarIdoso, buscarIdoso };
