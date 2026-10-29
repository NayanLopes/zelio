'use strict';
const { db } = require('../db');
const AppError = require('../erros/AppError');
const plantoes = require('./plantoes');

/**
 * RF10 — aviso de atraso ou cancelamento, enviado pelo cuidador a familia.
 *
 * RN05: so plantao em 'aceito' aceita aviso. Antes do aceite nao existe
 * compromisso a quebrar, e depois de encerrado nao ha mais o que avisar.
 */
const ESTADO_QUE_ACEITA_AVISO = 'aceito';

function criar(plantaoId, dados) {
  const p = plantoes.buscarPorId(plantaoId);

  if (p.status !== ESTADO_QUE_ACEITA_AVISO) {
    throw AppError.conflito(
      `So e possivel avisar sobre um plantao '${ESTADO_QUE_ACEITA_AVISO}'. Este esta '${p.status}'.`
    );
  }

  // A forma do aviso depende do tipo. A validacao de rota nao tem como
  // saber disso sozinha, entao a regra fica aqui, junto das outras.
  if (dados.tipo === 'atraso' && dados.minutos_atraso == null) {
    throw AppError.invalido('Dados invalidos', { minutos_atraso: 'e obrigatorio em aviso de atraso' });
  }
  if (dados.tipo === 'cancelamento' && dados.minutos_atraso != null) {
    throw AppError.invalido('Dados invalidos', { minutos_atraso: 'nao se aplica a aviso de cancelamento' });
  }

  const info = db.prepare(
    'INSERT INTO avisos (plantao_id, tipo, minutos_atraso, mensagem) VALUES (?, ?, ?, ?)'
  ).run(plantaoId, dados.tipo, dados.minutos_atraso ?? null, dados.mensagem ?? null);

  // Cancelamento nao e so recado: encerra o plantao. A mudanca passa pela
  // mesma tabela de transicoes da RN02, e nao por um UPDATE paralelo.
  const plantao = dados.tipo === 'cancelamento'
    ? plantoes.mudarStatus(plantaoId, 'cancelado')
    : plantoes.buscarPorId(plantaoId);

  return {
    aviso: db.prepare('SELECT * FROM avisos WHERE id = ?').get(Number(info.lastInsertRowid)),
    plantao,
  };
}

function listarDoPlantao(plantaoId) {
  plantoes.buscarPorId(plantaoId);
  return db.prepare('SELECT * FROM avisos WHERE plantao_id = ? ORDER BY criado_em DESC').all(plantaoId);
}

module.exports = { criar, listarDoPlantao };
