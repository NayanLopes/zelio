'use strict';
const { db, aplicarSchema, arquivo, driver } = require('./index');

aplicarSchema();

const esp = ['Alzheimer', 'Acamado', 'Mobilidade reduzida', 'Pos-cirurgico', 'Diabetes', 'Troca de fraldas'];
const insEsp = db.prepare('INSERT INTO especialidades (nome) VALUES (?)');
for (const e of esp) insEsp.run(e);

const idDe = {};
for (const e of db.prepare('SELECT id, nome FROM especialidades').all()) idDe[e.nome] = e.id;

const cuidadores = [
  ['Rosangela Farias', 'rosangela@exemplo.com', '(88) 99612-1001', 'Quixada', 'Campo Velho', 8, 140, 22,
   'aprovado', ['Alzheimer', 'Acamado']],
  ['Cleide Nascimento', 'cleide@exemplo.com', '(88) 99612-1002', 'Quixada', 'Planalto', 5, 130, 20,
   'aprovado', ['Alzheimer', 'Diabetes']],
  ['Mairton Alves', 'mairton@exemplo.com', '(88) 99612-1003', 'Quixada', 'Combate', 11, 160, 25,
   'aprovado', ['Alzheimer', 'Mobilidade reduzida']],
  ['Joana Bezerra', 'joana@exemplo.com', '(88) 99612-1004', 'Quixada', 'Centro', 2, 110, 18,
   'pendente', ['Pos-cirurgico']],
];

const insCui = db.prepare(`INSERT INTO cuidadores
  (nome, email, telefone, cidade, bairro, anos_experiencia, valor_diaria, valor_hora, status_verificacao)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insVinc = db.prepare('INSERT INTO cuidador_especialidades (cuidador_id, especialidade_id) VALUES (?, ?)');
const insDoc = db.prepare('INSERT INTO documentos (cuidador_id, tipo, status) VALUES (?, ?, ?)');

for (const c of cuidadores) {
  const id = Number(insCui.run(...c.slice(0, 9)).lastInsertRowid);
  for (const nome of c[9]) insVinc.run(id, idDe[nome]);
  const st = c[8] === 'aprovado' ? 'aprovado' : 'em_analise';
  insDoc.run(id, 'antecedentes', st);
  insDoc.run(id, 'certificado', st);
}

const insFam = db.prepare('INSERT INTO familias (responsavel, email, telefone, cidade, bairro) VALUES (?, ?, ?, ?, ?)');
const f1 = Number(insFam.run('Marcia Sousa', 'marcia@exemplo.com', '(88) 99612-4408', 'Quixada', 'Centro').lastInsertRowid);
const f2 = Number(insFam.run('Antonio Ribeiro', 'antonio@exemplo.com', '(88) 99612-7720', 'Quixada', 'Planalto').lastInsertRowid);

const insIdo = db.prepare('INSERT INTO idosos (familia_id, nome, idade, condicao) VALUES (?, ?, ?, ?)');
const i1 = Number(insIdo.run(f1, 'Antonio Sousa', 82, 'Alzheimer inicial, anda com apoio').lastInsertRowid);
insIdo.run(f2, 'Cicera Ribeiro', 79, 'Mobilidade reduzida apos cirurgia de quadril');

const insPl = db.prepare(`INSERT INTO plantoes
  (cuidador_id, idoso_id, modalidade, data_inicio, data_fim, hora_inicio, hora_fim, valor_total, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const p1 = Number(insPl.run(3, i1, 'diaria', '2026-09-01', '2026-09-05', '07:00', '19:00', 800, 'concluido').lastInsertRowid);
insPl.run(1, i1, 'diaria', '2026-10-14', '2026-10-18', '07:00', '19:00', 700, 'solicitado');

db.prepare('INSERT INTO avaliacoes (plantao_id, autor, nota, comentario) VALUES (?, ?, ?, ?)')
  .run(p1, 'familia', 5, 'Muito atencioso com meu pai. Chegou no horario todos os dias.');
db.prepare('INSERT INTO avaliacoes (plantao_id, autor, nota, comentario) VALUES (?, ?, ?, ?)')
  .run(p1, 'cuidador', 5, 'Familia organizada, deixou tudo combinado.');

const conta = (t) => db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n;
console.log(`Banco recriado em ${arquivo} (driver: ${driver})`);
for (const t of ['especialidades', 'cuidadores', 'familias', 'idosos', 'plantoes', 'avaliacoes']) {
  console.log(`  ${t.padEnd(16)} ${conta(t)}`);
}
