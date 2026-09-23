'use strict';

/**
 * Erro com codigo HTTP. Servicos lancam AppError; o tratador central
 * em middlewares/erros.js e o unico lugar que monta a resposta.
 */
class AppError extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem);
    this.name = 'AppError';
    this.status = status;
    if (detalhes) this.detalhes = detalhes;
  }
  static naoEncontrado(oQue) { return new AppError(404, `${oQue} nao encontrado`); }
  static invalido(mensagem, detalhes) { return new AppError(400, mensagem, detalhes); }
  static conflito(mensagem) { return new AppError(409, mensagem); }
}

module.exports = AppError;
