'use strict';
const { db } = require('../db');
const AppError = require('../erros/AppError');

const COLUNAS = `c.id, c.nome, c.email, c.telefone, c.cidade, c.bairro,
  c.anos_experiencia, c.valor_diaria, c.valor_hora, c.status_verificacao, c.criado_em`;

function especialidadesDe(cuidadorId) {
  return db.prepare(`
    SELECT e.id, e.nome FROM especialidades e
    JOIN cuidador_especialidades ce ON ce.especialidade_id = e.id
    WHERE ce.cuidador_id = ?  ORDER BY e.nome
  `).all(cuidadorId);
}

function reputacaoDe(cuidadorId) {
  const r = db.prepare(`
    SELECT COUNT(*) AS total, AVG(a.nota) AS media
    FROM avaliacoes a JOIN plantoes p ON p.id = a.plantao_id
    WHERE p.cuidador_id = ? AND a.autor = 'familia'
  `).get(cuidadorId);
  return {
    nota_media: r.media === null ? null : Math.round(r.media * 10) / 10,
    total_avaliacoes: r.total,
  };
}

function montar(linha) {
  if (!linha) return null;
  return { ...linha, especialidades: especialidadesDe(linha.id), ...reputacaoDe(linha.id) };
}

/**
 * RN01 — a busca publica devolve apenas cuidadores aprovados.
 * Passar incluir_nao_aprovados=true e uso administrativo.
 */
function listar(filtros = {}) {
  const cond = [];
  const params = [];

  if (!filtros.incluir_nao_aprovados) cond.push(`c.status_verificacao = 'aprovado'`);
  if (filtros.cidade)  { cond.push('c.cidade = ?');  params.push(filtros.cidade); }
  if (filtros.bairro)  { cond.push('c.bairro = ?');  params.push(filtros.bairro); }
  if (filtros.especialidade) {
    cond.push(`c.id IN (SELECT ce.cuidador_id FROM cuidador_especialidades ce
               JOIN especialidades e ON e.id = ce.especialidade_id WHERE e.nome = ?)`);
    params.push(filtros.especialidade);
  }
  if (filtros.valor_diaria_max !== undefined) {
    cond.push('c.valor_diaria <= ?'); params.push(filtros.valor_diaria_max);
  }

  const where = cond.length ? 'WHERE ' + cond.join(' AND ') : '';
  const linhas = db.prepare(`SELECT ${COLUNAS} FROM cuidadores c ${where} ORDER BY c.nome`).all(...params);
  let lista = linhas.map(montar);

  if (filtros.nota_minima !== undefined) {
    lista = lista.filter((c) => c.nota_media !== null && c.nota_media >= filtros.nota_minima);
  }
  return lista;
}

function buscarPorId(id) {
  const linha = db.prepare(`SELECT ${COLUNAS} FROM cuidadores c WHERE c.id = ?`).get(id);
  if (!linha) throw AppError.naoEncontrado('Cuidador');
  return montar(linha);
}

function criar(dados) {
  const info = db.prepare(`
    INSERT INTO cuidadores (nome, email, telefone, cidade, bairro, anos_experiencia, valor_diaria, valor_hora)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(dados.nome, dados.email, dados.telefone, dados.cidade, dados.bairro,
         dados.anos_experiencia ?? 0, dados.valor_diaria, dados.valor_hora);

  const id = Number(info.lastInsertRowid);
  if (Array.isArray(dados.especialidades)) vincularEspecialidades(id, dados.especialidades);
  return buscarPorId(id);
}

function vincularEspecialidades(cuidadorId, ids) {
  const existe = db.prepare('SELECT 1 FROM especialidades WHERE id = ?');
  for (const eid of ids) {
    if (!existe.get(eid)) throw AppError.invalido(`Especialidade ${eid} nao existe`);
  }
  db.prepare('DELETE FROM cuidador_especialidades WHERE cuidador_id = ?').run(cuidadorId);
  const ins = db.prepare('INSERT INTO cuidador_especialidades (cuidador_id, especialidade_id) VALUES (?, ?)');
  for (const eid of ids) ins.run(cuidadorId, eid);
}

const ATUALIZAVEIS = ['nome', 'telefone', 'cidade', 'bairro', 'anos_experiencia', 'valor_diaria', 'valor_hora'];

function atualizar(id, dados) {
  buscarPorId(id);
  const campos = ATUALIZAVEIS.filter((c) => dados[c] !== undefined);
  if (campos.length === 0 && dados.especialidades === undefined) {
    throw AppError.invalido('Nenhum campo atualizavel foi enviado');
  }
  if (campos.length > 0) {
    db.prepare(`UPDATE cuidadores SET ${campos.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`)
      .run(...campos.map((c) => dados[c]), id);
  }
  if (Array.isArray(dados.especialidades)) vincularEspecialidades(id, dados.especialidades);
  return buscarPorId(id);
}

/** RF11 — decisao do administrador sobre o cadastro. */
function definirVerificacao(id, status) {
  buscarPorId(id);
  db.prepare('UPDATE cuidadores SET status_verificacao = ? WHERE id = ?').run(status, id);
  if (status !== 'pendente') {
    db.prepare(`UPDATE documentos SET status = ?, conferido_em = datetime('now') WHERE cuidador_id = ?`)
      .run(status === 'aprovado' ? 'aprovado' : 'reprovado', id);
  }
  return buscarPorId(id);
}

function remover(id) {
  buscarPorId(id);
  const emAberto = db.prepare(
    `SELECT COUNT(*) AS n FROM plantoes WHERE cuidador_id = ? AND status IN ('solicitado','aceito')`
  ).get(id).n;
  if (emAberto > 0) {
    throw AppError.conflito('Nao e possivel remover um cuidador com plantoes solicitados ou aceitos');
  }
  db.prepare('DELETE FROM cuidadores WHERE id = ?').run(id);
}

function adicionarDocumento(cuidadorId, tipo) {
  buscarPorId(cuidadorId);
  const info = db.prepare('INSERT INTO documentos (cuidador_id, tipo) VALUES (?, ?)').run(cuidadorId, tipo);
  return db.prepare('SELECT * FROM documentos WHERE id = ?').get(Number(info.lastInsertRowid));
}

function listarDocumentos(cuidadorId) {
  buscarPorId(cuidadorId);
  return db.prepare('SELECT * FROM documentos WHERE cuidador_id = ? ORDER BY enviado_em').all(cuidadorId);
}

function avaliacoesRecebidas(cuidadorId) {
  buscarPorId(cuidadorId);
  return db.prepare(`
    SELECT a.id, a.nota, a.comentario, a.criado_em, f.responsavel AS autor
    FROM avaliacoes a
    JOIN plantoes p ON p.id = a.plantao_id
    JOIN idosos   i ON i.id = p.idoso_id
    JOIN familias f ON f.id = i.familia_id
    WHERE p.cuidador_id = ? AND a.autor = 'familia'
    ORDER BY a.criado_em DESC
  `).all(cuidadorId);
}

module.exports = { listar, buscarPorId, criar, atualizar, definirVerificacao, remover,
                   adicionarDocumento, listarDocumentos, avaliacoesRecebidas };
