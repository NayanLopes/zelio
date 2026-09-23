'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { abrir } = require('./driver');

const ARQUIVO = process.env.DB_ARQUIVO || path.join(__dirname, '..', '..', 'zelio.db');
const { db, driver } = abrir(ARQUIVO);

db.exec('PRAGMA foreign_keys = ON');

function aplicarSchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(sql);
}

module.exports = { db, driver, arquivo: ARQUIVO, aplicarSchema };
