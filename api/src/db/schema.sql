PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS avaliacoes;
DROP TABLE IF EXISTS plantoes;
DROP TABLE IF EXISTS idosos;
DROP TABLE IF EXISTS familias;
DROP TABLE IF EXISTS documentos;
DROP TABLE IF EXISTS cuidador_especialidades;
DROP TABLE IF EXISTS cuidadores;
DROP TABLE IF EXISTS especialidades;

-- Especialidade clinica. O filtro por especialidade e o diferencial do Zelio
-- frente a aplicativos genericos de servicos domesticos.
CREATE TABLE especialidades (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT    NOT NULL UNIQUE
);

CREATE TABLE cuidadores (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  nome               TEXT    NOT NULL,
  email              TEXT    NOT NULL UNIQUE,
  telefone           TEXT    NOT NULL,
  cidade             TEXT    NOT NULL,
  bairro             TEXT    NOT NULL,
  anos_experiencia   INTEGER NOT NULL DEFAULT 0,
  valor_diaria       REAL    NOT NULL,
  valor_hora         REAL    NOT NULL,
  -- RN01: so aparece na busca depois de aprovado pelo administrador
  status_verificacao TEXT    NOT NULL DEFAULT 'pendente'
                     CHECK (status_verificacao IN ('pendente','aprovado','reprovado')),
  criado_em          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE cuidador_especialidades (
  cuidador_id      INTEGER NOT NULL REFERENCES cuidadores(id)    ON DELETE CASCADE,
  especialidade_id INTEGER NOT NULL REFERENCES especialidades(id) ON DELETE CASCADE,
  PRIMARY KEY (cuidador_id, especialidade_id)
);

CREATE TABLE documentos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  cuidador_id  INTEGER NOT NULL REFERENCES cuidadores(id) ON DELETE CASCADE,
  tipo         TEXT    NOT NULL CHECK (tipo IN ('antecedentes','certificado','identidade')),
  status       TEXT    NOT NULL DEFAULT 'em_analise'
               CHECK (status IN ('em_analise','aprovado','reprovado')),
  enviado_em   TEXT    NOT NULL DEFAULT (datetime('now')),
  conferido_em TEXT
);

CREATE TABLE familias (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  responsavel TEXT    NOT NULL,
  email       TEXT    NOT NULL UNIQUE,
  telefone    TEXT    NOT NULL,
  cidade      TEXT    NOT NULL,
  bairro      TEXT    NOT NULL,
  criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- O idoso e beneficiario do cuidado, nao usuario do aplicativo.
-- "condicao" e uma descricao curta escrita pela propria familia,
-- nao um prontuario: o escopo do projeto nao inclui dado clinico.
CREATE TABLE idosos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  familia_id INTEGER NOT NULL REFERENCES familias(id) ON DELETE CASCADE,
  nome       TEXT    NOT NULL,
  idade      INTEGER NOT NULL CHECK (idade BETWEEN 40 AND 120),
  condicao   TEXT
);

CREATE TABLE plantoes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  cuidador_id INTEGER NOT NULL REFERENCES cuidadores(id),
  idoso_id    INTEGER NOT NULL REFERENCES idosos(id),
  modalidade  TEXT    NOT NULL CHECK (modalidade IN ('horista','diaria','mensal')),
  data_inicio TEXT    NOT NULL,
  data_fim    TEXT    NOT NULL,
  hora_inicio TEXT    NOT NULL,
  hora_fim    TEXT    NOT NULL,
  valor_total REAL    NOT NULL CHECK (valor_total >= 0),
  -- RN02: nasce sempre como 'solicitado'. So o cuidador move para 'aceito'.
  status      TEXT    NOT NULL DEFAULT 'solicitado'
              CHECK (status IN ('solicitado','aceito','recusado','concluido','cancelado')),
  criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- RN03: so existe avaliacao de plantao concluido (garantido no servico).
-- Cada lado avalia uma vez so.
CREATE TABLE avaliacoes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  plantao_id INTEGER NOT NULL REFERENCES plantoes(id) ON DELETE CASCADE,
  autor      TEXT    NOT NULL CHECK (autor IN ('familia','cuidador')),
  nota       INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (plantao_id, autor)
);

CREATE INDEX idx_cuidadores_busca  ON cuidadores (status_verificacao, cidade, bairro);
CREATE INDEX idx_plantoes_cuidador ON plantoes (cuidador_id, status);
CREATE INDEX idx_plantoes_idoso    ON plantoes (idoso_id, status);
