'use strict';
const { db } = require('../db');

const existe = (id) => Boolean(db.prepare('SELECT 1 FROM especialidades WHERE id = ?').get(id));
const listar = () => db.prepare('SELECT id, nome FROM especialidades ORDER BY nome').all();

module.exports = { existe, listar };
