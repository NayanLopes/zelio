'use strict';
const AppError = require('../erros/AppError');

function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: `Rota nao encontrada: ${req.method} ${req.originalUrl}` });
}

// Assinatura de 4 argumentos: e assim que o Express reconhece
// um middleware como tratador de erro.
function tratadorDeErros(err, req, res, _next) {
  if (err instanceof AppError) {
    const corpo = { erro: err.message };
    if (err.detalhes) corpo.detalhes = err.detalhes;
    return res.status(err.status).json(corpo);
  }
  // JSON malformado vem do express.json() com esta marca
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON malformado no corpo da requisicao' });
  }
  const msg = String(err && err.message);
  if (msg.includes('UNIQUE constraint failed')) {
    return res.status(409).json({ erro: 'Ja existe um registro com esse valor unico' });
  }
  if (msg.includes('FOREIGN KEY constraint failed')) {
    return res.status(400).json({ erro: 'Referencia a um registro que nao existe' });
  }
  if (msg.includes('CHECK constraint failed')) {
    return res.status(400).json({ erro: 'Valor fora do conjunto permitido', detalhes: msg });
  }
  console.error('[erro nao tratado]', err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { rotaNaoEncontrada, tratadorDeErros };
