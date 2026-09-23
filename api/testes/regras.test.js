'use strict';
/**
 * Testes das regras de negocio, direto nos servicos — sem HTTP.
 * Rode com:  node --test testes/
 */
const { test, before } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');

process.env.DB_ARQUIVO = ':memory:';

const { aplicarSchema, db } = require('../src/db');
const cuidadores = require('../src/servicos/cuidadores');
const familias = require('../src/servicos/familias');
const plantoes = require('../src/servicos/plantoes');
const avaliacoes = require('../src/servicos/avaliacoes');

let aprovado, pendente, idoso;

before(() => {
  aplicarSchema();
  db.prepare('INSERT INTO especialidades (nome) VALUES (?)').run('Alzheimer');

  aprovado = cuidadores.criar({ nome: 'Rosangela Farias', email: 'r@e.com', telefone: '9999',
    cidade: 'Quixada', bairro: 'Campo Velho', anos_experiencia: 8,
    valor_diaria: 140, valor_hora: 22, especialidades: [1] });
  cuidadores.definirVerificacao(aprovado.id, 'aprovado');

  pendente = cuidadores.criar({ nome: 'Joana Bezerra', email: 'j@e.com', telefone: '8888',
    cidade: 'Quixada', bairro: 'Centro', valor_diaria: 110, valor_hora: 18 });

  const fam = familias.criar({ responsavel: 'Marcia', email: 'm@e.com', telefone: '7777',
    cidade: 'Quixada', bairro: 'Centro' });
  idoso = familias.adicionarIdoso(fam.id, { nome: 'Antonio', idade: 82, condicao: 'Alzheimer inicial' });
});

const plantaoBase = (extra = {}) => ({
  cuidador_id: aprovado.id, idoso_id: idoso.id, modalidade: 'diaria',
  data_inicio: '2026-11-02', data_fim: '2026-11-06', hora_inicio: '07:00', hora_fim: '19:00', ...extra,
});

test('RN01: a busca publica so devolve cuidadores aprovados', () => {
  const nomes = cuidadores.listar().map((c) => c.nome);
  assert.ok(nomes.includes('Rosangela Farias'));
  assert.ok(!nomes.includes('Joana Bezerra'), 'cuidador pendente nao pode aparecer');
  assert.equal(cuidadores.listar({ incluir_nao_aprovados: true }).length, 2);
});

test('RN01: nao se contrata cuidador nao aprovado', () => {
  assert.throws(() => plantoes.criar(plantaoBase({ cuidador_id: pendente.id })),
    (e) => e.status === 409 && /nao foi aprovado/.test(e.message));
});

test('RN02: o plantao nasce solicitado', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2026-11-02', data_fim: '2026-11-06' }));
  assert.equal(p.status, 'solicitado');
  assert.deepEqual(p.proximos_status, ['aceito', 'recusado', 'cancelado']);
  plantoes.remover(p.id);
});

test('RN02: nao da para pular de solicitado direto para concluido', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2026-11-09', data_fim: '2026-11-13' }));
  assert.throws(() => plantoes.mudarStatus(p.id, 'concluido'),
    (e) => e.status === 409 && /solicitado.*concluido/.test(e.message));
  plantoes.remover(p.id);
});

test('RN02: aceito pelo cuidador e depois concluido', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2026-11-16', data_fim: '2026-11-20' }));
  assert.equal(plantoes.mudarStatus(p.id, 'aceito').status, 'aceito');
  assert.equal(plantoes.mudarStatus(p.id, 'concluido').status, 'concluido');
  assert.throws(() => plantoes.mudarStatus(p.id, 'cancelado'), (e) => e.status === 409);
});

test('RN03: nao se avalia plantao que nao foi concluido', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2026-12-01', data_fim: '2026-12-03' }));
  assert.throws(() => avaliacoes.criar(p.id, { autor: 'familia', nota: 5 }),
    (e) => e.status === 409 && /concluido/.test(e.message));
  plantoes.remover(p.id);
});

test('RN03: cada lado avalia uma vez so, e a nota media acompanha', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2026-12-07', data_fim: '2026-12-11' }));
  plantoes.mudarStatus(p.id, 'aceito');
  plantoes.mudarStatus(p.id, 'concluido');

  avaliacoes.criar(p.id, { autor: 'familia', nota: 4, comentario: 'Boa' });
  assert.throws(() => avaliacoes.criar(p.id, { autor: 'familia', nota: 5 }),
    (e) => e.status === 409 && /ja avaliou/.test(e.message));
  avaliacoes.criar(p.id, { autor: 'cuidador', nota: 5 });

  const c = cuidadores.buscarPorId(aprovado.id);
  assert.equal(c.total_avaliacoes, 1, 'so a avaliacao da familia conta para a nota do cuidador');
  assert.equal(c.nota_media, 4);
});

test('agenda: cuidador nao aceita dois plantoes no mesmo periodo', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2027-01-04', data_fim: '2027-01-08' }));
  assert.throws(() => plantoes.criar(plantaoBase({ data_inicio: '2027-01-06', data_fim: '2027-01-10' })),
    (e) => e.status === 409 && /ja tem plantao/.test(e.message));
  plantoes.remover(p.id);
});

test('o valor total e calculado no servidor, nao enviado pelo cliente', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2027-02-01', data_fim: '2027-02-05', valor_total: 1 }));
  assert.equal(p.valor_total, 5 * 140, '5 diarias a 140');
  const h = plantoes.criar(plantaoBase({ modalidade: 'horista',
    data_inicio: '2027-03-01', data_fim: '2027-03-01', hora_inicio: '08:00', hora_fim: '12:00' }));
  assert.equal(h.valor_total, 4 * 22, '4 horas a 22');
  plantoes.remover(p.id); plantoes.remover(h.id);
});

test('datas e horas incoerentes sao recusadas', () => {
  assert.throws(() => plantoes.criar(plantaoBase({ data_inicio: '2027-04-10', data_fim: '2027-04-01' })),
    (e) => e.status === 400);
  assert.throws(() => plantoes.criar(plantaoBase({ data_inicio: '2027-05-03', data_fim: '2027-05-03',
    hora_inicio: '19:00', hora_fim: '07:00' })), (e) => e.status === 400);
});

test('filtro por especialidade e por nota minima', () => {
  assert.equal(cuidadores.listar({ especialidade: 'Alzheimer' }).length, 1);
  assert.equal(cuidadores.listar({ especialidade: 'Inexistente' }).length, 0);
  assert.equal(cuidadores.listar({ nota_minima: 4.5 }).length, 0, 'a nota media e 4');
  assert.equal(cuidadores.listar({ nota_minima: 3 }).length, 1);
});

test('404 em recurso que nao existe', () => {
  assert.throws(() => cuidadores.buscarPorId(9999), (e) => e.status === 404);
  assert.throws(() => plantoes.buscarPorId(9999), (e) => e.status === 404);
});

test('nao se remove cuidador com plantao em aberto', () => {
  const p = plantoes.criar(plantaoBase({ data_inicio: '2027-06-01', data_fim: '2027-06-05' }));
  assert.throws(() => cuidadores.remover(aprovado.id), (e) => e.status === 409);
  plantoes.remover(p.id);
});
