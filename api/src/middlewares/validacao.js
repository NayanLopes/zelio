'use strict';
const AppError = require('../erros/AppError');

/**
 * Validacao declarativa. Cada campo recebe uma lista de regras;
 * o corpo inteiro e conferido de uma vez para que a resposta 400
 * liste todos os problemas, e nao apenas o primeiro.
 */
const regra = {
  obrigatorio: (v) => (v === undefined || v === null || v === '' ? 'e obrigatorio' : null),
  texto: (max) => (v) =>
    v === undefined ? null
    : typeof v !== 'string' ? 'deve ser texto'
    : v.trim().length === 0 ? 'nao pode ser vazio'
    : max && v.length > max ? `deve ter no maximo ${max} caracteres`
    : null,
  email: (v) =>
    v === undefined ? null
    : typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null
    : 'deve ser um e-mail valido',
  inteiro: (min, max) => (v) => {
    if (v === undefined) return null;
    if (!Number.isInteger(v)) return 'deve ser um numero inteiro';
    if (min !== undefined && v < min) return `deve ser no minimo ${min}`;
    if (max !== undefined && v > max) return `deve ser no maximo ${max}`;
    return null;
  },
  numero: (min) => (v) => {
    if (v === undefined) return null;
    if (typeof v !== 'number' || Number.isNaN(v)) return 'deve ser um numero';
    if (min !== undefined && v < min) return `deve ser no minimo ${min}`;
    return null;
  },
  umDe: (opcoes) => (v) =>
    v === undefined || opcoes.includes(v) ? null : `deve ser um de: ${opcoes.join(', ')}`,
  data: (v) =>
    v === undefined ? null
    : typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))
      ? null : 'deve estar no formato AAAA-MM-DD',
  hora: (v) =>
    v === undefined ? null
    : typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? null : 'deve estar no formato HH:MM',
  listaDeInteiros: (v) =>
    v === undefined ? null
    : Array.isArray(v) && v.every(Number.isInteger) ? null : 'deve ser uma lista de inteiros',
};

function validar(corpo, esquema) {
  if (corpo === null || typeof corpo !== 'object' || Array.isArray(corpo)) {
    throw AppError.invalido('O corpo da requisicao deve ser um objeto JSON');
  }
  const problemas = {};
  for (const [campo, regras] of Object.entries(esquema)) {
    for (const r of regras) {
      const erro = r(corpo[campo]);
      if (erro) { problemas[campo] = erro; break; }
    }
  }
  if (Object.keys(problemas).length > 0) {
    throw AppError.invalido('Dados invalidos', problemas);
  }
  return corpo;
}

function idNumerico(valor, nome = 'id') {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) throw AppError.invalido(`O ${nome} deve ser um inteiro positivo`);
  return n;
}

module.exports = { validar, regra, idNumerico };
