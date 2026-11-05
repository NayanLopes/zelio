'use strict';
const crypto = require('node:crypto');
const AppError = require('../erros/AppError');
const usuarios = require('../repositorios/usuarios');
const sessoes = require('../repositorios/sessoes');

const DIAS_DE_VALIDADE = 7;

function cifrar(senha) {
  const sal = crypto.randomBytes(16).toString('hex');
  const derivada = crypto.scryptSync(senha, sal, 64).toString('hex');
  return `${sal}:${derivada}`;
}

function confere(senha, guardada) {
  const [sal, derivada] = String(guardada).split(':');
  if (!sal || !derivada) return false;
  const tentativa = crypto.scryptSync(senha, sal, 64);
  const original = Buffer.from(derivada, 'hex');
  if (tentativa.length !== original.length) return false;
  return crypto.timingSafeEqual(tentativa, original);
}

const resumo = (token) => crypto.createHash('sha256').update(token).digest('hex');

function registrar(dados) {
  if (usuarios.porEmail(dados.email)) {
    throw AppError.conflito('Ja existe usuario com esse e-mail');
  }
  const id = usuarios.inserir({
    email: dados.email,
    senha_hash: cifrar(dados.senha),
    papel: dados.papel,
    familia_id: dados.familia_id,
    cuidador_id: dados.cuidador_id,
  });
  return usuarios.porId(id);
}

function entrar(email, senha) {
  const u = usuarios.porEmail(email);
  if (!u || !confere(senha, u.senha_hash)) {
    throw new AppError(401, 'E-mail ou senha invalidos');
  }
  sessoes.removerExpiradas();
  const token = crypto.randomBytes(32).toString('hex');
  const expira = new Date(Date.now() + DIAS_DE_VALIDADE * 86400000)
    .toISOString().slice(0, 19).replace('T', ' ');
  sessoes.inserir(u.id, resumo(token), expira);
  return { token, expira_em: expira, usuario: usuarios.porId(u.id) };
}

function sair(token) {
  const s = sessoes.porTokenHash(resumo(token));
  if (s) sessoes.remover(s.id);
}

function porToken(token) {
  const s = sessoes.porTokenHash(resumo(token));
  if (!s) return null;
  if (new Date(s.expira_em.replace(' ', 'T') + 'Z') < new Date()) {
    sessoes.remover(s.id);
    return null;
  }
  return {
    id: s.usuario_id, email: s.email, papel: s.papel,
    familia_id: s.familia_id, cuidador_id: s.cuidador_id,
  };
}

module.exports = { registrar, entrar, sair, porToken, cifrar };
