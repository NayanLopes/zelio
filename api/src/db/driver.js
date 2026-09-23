'use strict';

/**
 * Adaptador de driver SQLite.
 *
 * Usa better-sqlite3 quando instalado. Se ele nao estiver disponivel
 * (por exemplo, quando a compilacao nativa falha), cai no modulo
 * node:sqlite, que vem embutido a partir do Node 22.5 e tem a mesma
 * interface sincrona: prepare/run/get/all/exec.
 *
 * O resto da aplicacao nao precisa saber qual dos dois esta em uso.
 */
function abrir(caminho) {
  try {
    const Database = require('better-sqlite3');
    return { db: new Database(caminho), driver: 'better-sqlite3' };
  } catch (_) {
    const { DatabaseSync } = require('node:sqlite');
    return { db: new DatabaseSync(caminho), driver: 'node:sqlite' };
  }
}

module.exports = { abrir };
