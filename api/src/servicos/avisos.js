'use strict';
const AppError = require('../erros/AppError');
const repo = require('../repositorios/avisos');
const plantoes = require('./plantoes');

const ESTADO_QUE_ACEITA_AVISO = 'aceito';

function criar(plantaoId, dados) {
  const p = plantoes.buscarPorId(plantaoId);

  if (p.status !== ESTADO_QUE_ACEITA_AVISO) {
    throw AppError.conflito(
      `So e possivel avisar sobre um plantao '${ESTADO_QUE_ACEITA_AVISO}'. Este esta '${p.status}'.`
    );
  }

  if (dados.tipo === 'atraso' && dados.minutos_atraso == null) {
    throw AppError.invalido('Dados invalidos', { minutos_atraso: 'e obrigatorio em aviso de atraso' });
  }
  if (dados.tipo === 'cancelamento' && dados.minutos_atraso != null) {
    throw AppError.invalido('Dados invalidos', { minutos_atraso: 'nao se aplica a aviso de cancelamento' });
  }

  const aviso = repo.inserir(plantaoId, dados);

  const plantao = dados.tipo === 'cancelamento'
    ? plantoes.mudarStatus(plantaoId, 'cancelado')
    : plantoes.buscarPorId(plantaoId);

  return { aviso, plantao };
}

function listarDoPlantao(plantaoId) {
  plantoes.buscarPorId(plantaoId);
  return repo.doPlantao(plantaoId);
}

module.exports = { criar, listarDoPlantao };
