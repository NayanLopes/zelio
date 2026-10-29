'use strict';

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
