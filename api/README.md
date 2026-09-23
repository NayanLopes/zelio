# Zelio API

API REST do Zelio, um marketplace que conecta famílias a cuidadores de idosos autônomos.

Projeto da disciplina **Programação para Dispositivos Móveis** — Etapa 1.
Prof. Me. Nator Junior Carvalho da Costa · UFC Campus Quixadá · 2026.2

## Como rodar

```bash
npm install
npm run db:reset    # cria o banco e carrega dados de exemplo
npm start           # http://localhost:3000
```

Para desenvolver com recarga automática: `npm run dev`.
Para rodar os testes das regras de negócio: `npm test`.

O banco é um arquivo SQLite (`zelio.db`), criado na primeira execução do `db:reset`.
Não precisa instalar servidor de banco.

> **Sobre o driver.** O projeto usa `better-sqlite3`. Se a compilação nativa dele
> falhar na sua máquina, `src/db/driver.js` cai automaticamente no módulo
> `node:sqlite`, embutido no Node a partir da versão 22.5. A aplicação funciona
> nos dois casos, e a rota `GET /` informa qual driver está em uso.

## Entidades

```
familias ──< idosos ──< plantoes >── cuidadores ──< documentos
                          │                  │
                          └──< avaliacoes    └──< cuidador_especialidades >── especialidades
```

| Entidade | Papel |
|---|---|
| `cuidadores` | Profissional autônomo. Só aparece na busca depois de aprovado. |
| `especialidades` | Condição clínica atendida. Relacionamento N:N com cuidadores. |
| `documentos` | Comprovantes enviados para verificação. |
| `familias` | Quem contrata. |
| `idosos` | Beneficiário do cuidado. Pertence a uma família. |
| `plantoes` | O serviço contratado. Liga um cuidador a um idoso. |
| `avaliacoes` | Nota e comentário após a conclusão. Uma por lado. |

## Endpoints

| Método | Rota | O que faz |
|---|---|---|
| GET | `/` | Informações da API |
| GET | `/especialidades` | Lista as especialidades |
| GET | `/cuidadores` | Busca com filtros: `especialidade`, `cidade`, `bairro`, `nota_minima`, `valor_diaria_max`, `incluir_nao_aprovados` |
| GET | `/cuidadores/:id` | Um cuidador, com especialidades e reputação |
| POST | `/cuidadores` | Cadastra. Devolve 201 e `Location` |
| PATCH | `/cuidadores/:id` | Atualiza dados |
| PATCH | `/cuidadores/:id/verificacao` | Administrador aprova ou reprova |
| DELETE | `/cuidadores/:id` | Remove. 409 se houver plantão em aberto |
| GET | `/cuidadores/:id/documentos` | Documentos enviados |
| POST | `/cuidadores/:id/documentos` | Envia documento |
| GET | `/cuidadores/:id/avaliacoes` | Avaliações recebidas |
| GET | `/familias` | Lista famílias |
| GET | `/familias/:id` | Uma família, com seus idosos |
| POST | `/familias` | Cadastra |
| PATCH | `/familias/:id` | Atualiza |
| DELETE | `/familias/:id` | Remove |
| GET | `/familias/:id/idosos` | Idosos da família |
| POST | `/familias/:id/idosos` | Cadastra idoso |
| GET | `/plantoes` | Filtros: `status`, `cuidador_id`, `idoso_id`, `familia_id` |
| GET | `/plantoes/:id` | Um plantão, com as transições possíveis |
| POST | `/plantoes` | Família solicita. Nasce `solicitado` |
| PATCH | `/plantoes/:id/status` | Muda o estado, respeitando as transições |
| DELETE | `/plantoes/:id` | Remove. 409 se já concluído |
| GET | `/plantoes/:id/avaliacoes` | Avaliações do plantão |
| POST | `/plantoes/:id/avaliacoes` | Avalia. 409 se não concluído |

O arquivo `requests.http` tem exemplos prontos de cada caso, inclusive os que devem falhar.

## Regras de negócio

As regras estão nos serviços, não nas rotas, e têm teste automatizado.

**RN01 — verificação antes da vitrine.** `GET /cuidadores` só devolve quem tem
`status_verificacao = 'aprovado'`. Solicitar plantão para alguém não aprovado
responde 409.

**RN02 — aceite das duas partes.** O plantão nasce `solicitado`. As transições
são declaradas numa tabela em `src/servicos/plantoes.js`, e qualquer salto fora
dela responde 409 dizendo quais são os caminhos possíveis:

```
solicitado → aceito, recusado, cancelado
aceito     → concluido, cancelado
recusado, concluido, cancelado → (encerrado)
```

**RN03 — avaliação só depois da conclusão.** Avaliar plantão que não está
`concluido` responde 409. Cada lado avalia uma vez, garantido também por
`UNIQUE (plantao_id, autor)` no banco.

**O preço é do servidor.** `valor_total` é calculado a partir da tabela do cuidador
e do período. Se o cliente mandar `valor_total`, o campo é ignorado.

**Agenda sem sobreposição.** Um cuidador não recebe duas solicitações para períodos
que se cruzam.

## Códigos de status

| Código | Quando |
|---|---|
| 200 | Consulta ou atualização bem-sucedida |
| 201 | Recurso criado, com cabeçalho `Location` |
| 204 | Remoção bem-sucedida, sem corpo |
| 400 | Dados inválidos. O corpo traz `detalhes` com o problema de cada campo |
| 404 | Recurso ou rota inexistente |
| 409 | Conflito com uma regra de negócio ou com o estado atual |
| 500 | Erro não previsto |

Erro sempre responde `{ "erro": "..." }`, e `400` acrescenta `detalhes`:

```json
{
  "erro": "Dados invalidos",
  "detalhes": { "email": "deve ser um e-mail valido", "valor_diaria": "e obrigatorio" }
}
```

## Organização

```
src/
  server.js              sobe o servidor
  app.js                 monta o Express e a ordem dos middlewares
  rotas/                 HTTP: lê a requisição, valida, devolve resposta
  servicos/              regras de negócio e acesso ao banco
  middlewares/
    validacao.js         validação declarativa, campo a campo
    erros.js             404 e tratador central de erros
  erros/AppError.js      erro com código HTTP
  db/
    driver.js            adaptador entre better-sqlite3 e node:sqlite
    schema.sql           tabelas, chaves estrangeiras e CHECKs
    seed.js              recria o banco com dados de exemplo
testes/regras.test.js    13 testes das regras de negócio
requests.http            exemplos de requisição
```

A separação entre `rotas` e `servicos` é o que permite testar as regras sem subir
o servidor: os testes chamam os serviços diretamente.

## Documentos relacionados

- [`../docs/proposta-mobile.md`](../docs/proposta-mobile.md) — problema, público-alvo,
  funcionalidades e entidades
- [`../docs/telas-e-endpoints.md`](../docs/telas-e-endpoints.md) — telas do aplicativo,
  fluxo de navegação e o endpoint que cada tela chama
- [`../prototipo/index.html`](../prototipo/index.html) — protótipo navegável das telas
