'use strict';
const AppError = require('../erros/AppError');
const repo = require('../repositorios/avaliacoes');
const plantoes = require('./plantoes');

/** RN03 — so se avalia plantao concluido, e cada lado avalia uma vez. */
function criar(plantaoId, dados) {
  const p = plantoes.buscarPorId(plantaoId);
  if (p.status !== 'concluido') {
    throw AppError.conflito(`So e possivel avaliar um plantao concluido. Este esta '${p.status}'.`);
  }
  if (repo.existeDoAutor(plantaoId, dados.autor)) {
    throw AppError.conflito(`O lado '${dados.autor}' ja avaliou este plantao`);
  }
  return repo.inserir(plantaoId, dados);
}

function listarDoPlantao(plantaoId) {
  plantoes.buscarPorId(plantaoId);
  return repo.doPlantao(plantaoId);
}

module.exports = { criar, listarDoPlantao };
