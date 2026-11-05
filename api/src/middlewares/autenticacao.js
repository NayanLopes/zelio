'use strict';
const AppError = require('../erros/AppError');
const autenticacao = require('../servicos/autenticacao');
const plantoes = require('../servicos/plantoes');

function leToken(req) {
  const cabecalho = req.get('authorization') || '';
  const [tipo, valor] = cabecalho.split(' ');
  return tipo && tipo.toLowerCase() === 'bearer' && valor ? valor : null;
}

function autenticar(req, res, next) {
  const token = leToken(req);
  if (!token) throw new AppError(401, 'Envie o token no cabecalho Authorization');
  const usuario = autenticacao.porToken(token);
  if (!usuario) throw new AppError(401, 'Sessao invalida ou expirada');
  req.usuario = usuario;
  next();
}

const exigirPapel = (...papeis) => (req, res, next) => {
  if (!papeis.includes(req.usuario.papel)) {
    throw new AppError(403, `Esta acao e de ${papeis.join(' ou ')}`);
  }
  next();
};

function exigirMesmoCuidador(req, res, next) {
  const id = Number(req.params.id);
  if (req.usuario.papel === 'admin') return next();
  if (req.usuario.cuidador_id !== id) {
    throw new AppError(403, 'Voce so pode alterar o proprio cadastro');
  }
  next();
}

function exigirMesmaFamilia(req, res, next) {
  const id = Number(req.params.id);
  if (req.usuario.papel === 'admin') return next();
  if (req.usuario.familia_id !== id) {
    throw new AppError(403, 'Voce so pode alterar o proprio cadastro');
  }
  next();
}

function partesDoPlantao(plantaoId) {
  const p = plantoes.buscarPorId(plantaoId);
  return { plantao: p, cuidadorId: p.cuidador.id, familiaId: p.idoso.familia_id };
}

function exigirParteDoPlantao(req, res, next) {
  const { cuidadorId, familiaId } = partesDoPlantao(Number(req.params.id));
  const u = req.usuario;
  const parte = u.papel === 'admin'
    || (u.papel === 'cuidador' && u.cuidador_id === cuidadorId)
    || (u.papel === 'familia' && u.familia_id === familiaId);
  if (!parte) throw new AppError(403, 'Voce nao faz parte deste plantao');
  next();
}

function exigirCuidadorDoPlantao(req, res, next) {
  const { cuidadorId } = partesDoPlantao(Number(req.params.id));
  if (req.usuario.papel === 'admin') return next();
  if (req.usuario.papel !== 'cuidador' || req.usuario.cuidador_id !== cuidadorId) {
    throw new AppError(403, 'So o cuidador deste plantao pode fazer isso');
  }
  next();
}

const SO_DO_CUIDADOR = ['aceito', 'recusado'];

function exigirQuemPodeMudarStatus(req, res, next) {
  const alvo = req.body && req.body.status;
  if (!SO_DO_CUIDADOR.includes(alvo)) return exigirParteDoPlantao(req, res, next);
  return exigirCuidadorDoPlantao(req, res, next);
}

module.exports = {
  autenticar, exigirPapel, exigirMesmoCuidador, exigirMesmaFamilia,
  exigirParteDoPlantao, exigirCuidadorDoPlantao, exigirQuemPodeMudarStatus,
};
