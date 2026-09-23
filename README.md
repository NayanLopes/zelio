# Zelio

Marketplace que conecta famílias a cuidadores de idosos autônomos verificados.
A família busca, escolhe, conversa, contrata e avalia; o serviço acontece fora do
aplicativo.

## Diferenciais

- **Busca por especialidade clínica** — Alzheimer, mobilidade reduzida, pós-cirúrgico,
  e não "cuidador" como categoria genérica ao lado de diarista e babá.
- **Verificação antes da vitrine** — antecedentes, certificações e referências são
  conferidos por um administrador. Quem não foi aprovado não aparece na busca.
- **Aceite das duas partes** — a família solicita, o cuidador aceita. Nada é
  confirmado por decisão de um lado só.

## Estrutura do repositório

| Pasta | Conteúdo |
|---|---|
| [`api/`](api/) | API REST em Node.js e Express, com banco SQLite |
| [`docs/`](docs/) | Documentos de engenharia e de idealização |
| [`prototipo/`](prototipo/) | Protótipo navegável das telas |

## Documentação

| Documento | Descrição |
|---|---|
| [`docs/proposta-mobile.md`](docs/proposta-mobile.md) | Problema, público-alvo, funcionalidades e entidades |
| [`docs/telas-e-endpoints.md`](docs/telas-e-endpoints.md) | Telas, fluxo de navegação e o endpoint que cada tela chama |
| [`docs/documento-requisitos-v1.md`](docs/documento-requisitos-v1.md) | Requisitos funcionais e não funcionais, personas, regras de negócio |
| [`docs/documento-arquitetura-v1.md`](docs/documento-arquitetura-v1.md) | Drivers, visões C4, modelo de dados, decisões de arquitetura |
| [`docs/roteiro-entrevistas-v1.md`](docs/roteiro-entrevistas-v1.md) | Roteiro de coleta de dados com stakeholders |
| [`api/README.md`](api/README.md) | Endpoints, regras de negócio e códigos de status da API |

> **Nota de escopo.** O projeto foi reduzido para o modelo de marketplace descrito
> acima. Os documentos de requisitos, arquitetura e roteiro de entrevistas ainda
> descrevem o escopo anterior, que incluía acompanhamento do serviço em andamento,
> e estão em revisão.

## Rodando a API

```bash
cd api
npm install
npm run db:reset
npm start
```

A API sobe em `http://localhost:3000`. Os exemplos de requisição estão em
[`api/requests.http`](api/requests.http).

## Fluxo de trabalho no Git

- `main` — versão estável
- `develop` — integração do que está em desenvolvimento
- `feature/*` — uma branch por funcionalidade, aberta a partir de `develop`

## Contexto acadêmico

Universidade Federal do Ceará, Campus Quixadá — 2026.2

- **Projeto Integrado em Engenharia de Software III** (Profa. Leonara Braz) —
  requisitos, arquitetura, coleta de dados e protótipo.
- **Programação para Dispositivos Móveis** (Prof. Nator Junior Carvalho da Costa) —
  proposta da solução, API REST e projeto das telas.
