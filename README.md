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
| [`prototipo/`](prototipo/) | Protótipo das telas |

## Protótipo

Protótipo navegável das oito telas, com o fluxo ligado:
**[abrir no Figma](https://www.figma.com/proto/0G8ldhOI6LclbkswGdjXa2/Zelio-v1?node-id=3-1102)**

A navegação cobre os dois lados do aplicativo. Do lado da família: busca, perfil,
conversa, solicitação, lista de plantões e avaliação. Do lado do cuidador:
solicitações recebidas e o cadastro em análise. O mapa de cada tela para o endpoint
que ela chama está em [`docs/telas-e-endpoints.md`](docs/telas-e-endpoints.md).

A pasta [`prototipo/`](prototipo/) guarda a primeira rodada, em HTML, feita antes da
redução de escopo. Está mantida como registro; a versão válida é a do Figma.

## Documentação

| Documento | Descrição |
|---|---|
| [`docs/proposta-mobile.md`](docs/proposta-mobile.md) | Problema, público-alvo, funcionalidades e entidades |
| [`docs/telas-e-endpoints.md`](docs/telas-e-endpoints.md) | Telas, fluxo de navegação e o endpoint que cada tela chama |
| [`docs/documento-requisitos-v2.md`](docs/documento-requisitos-v2.md) | Requisitos funcionais e não funcionais, personas, regras de negócio |
| [`docs/documento-arquitetura-v2.md`](docs/documento-arquitetura-v2.md) | Drivers, visões C4, modelo de dados, decisões de arquitetura |
| [`docs/roteiro-entrevistas-v2.md`](docs/roteiro-entrevistas-v2.md) | Roteiro de coleta de dados com stakeholders |
| [`docs/gestao-do-projeto.md`](docs/gestao-do-projeto.md) | Escopo, cronograma planejado e realizado, replanejamento |
| [`docs/validacao/`](docs/validacao/) | Registros das conversas com stakeholders |
| [`api/README.md`](api/README.md) | Endpoints, regras de negócio e códigos de status da API |

> **Nota de escopo.** O projeto foi reduzido ao modelo de marketplace descrito
> acima. A v2 dos três documentos de engenharia aplica esse corte e registra, em
> cada um, o que saiu e por quê. A v1 continua no histórico do repositório.

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
