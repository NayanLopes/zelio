# Projeto da aplicação mobile

Telas principais, fluxo de navegação e a ligação de cada tela com os endpoints da API.

## Fluxo de navegação

**Aplicativo da família**

```
Encontrar cuidador
      │  toque em um cuidador
      ▼
Perfil do cuidador ──── "Conversar antes" ───▶ Conversa
      │  "Solicitar plantão"
      ▼
Solicitar plantão ──── envio ───▶ Meus plantões
                                      │  "Avaliar" (só no plantão concluído)
                                      ▼
                                 Avaliar cuidador
```

**Aplicativo do cuidador**

```
Solicitações recebidas ──── aceitar ou recusar
Meu cadastro ──── envio de documentos, espera da aprovação
```

## Telas e endpoints

### 1. Encontrar cuidador

Lista de cuidadores verificados, com filtro por especialidade.

| Ação na tela | Endpoint |
|---|---|
| Carregar os filtros disponíveis | `GET /especialidades` |
| Listar os cuidadores | `GET /cuidadores` |
| Aplicar filtro de especialidade | `GET /cuidadores?especialidade=Alzheimer` |
| Filtrar por região | `GET /cuidadores?cidade=Quixada&bairro=Centro` |
| Ordenar por reputação | `GET /cuidadores?nota_minima=4` |

A lista traz `nota_media` e `total_avaliacoes` já calculados, e só contém aprovados —
a tela não precisa filtrar nada por conta própria.

### 2. Perfil do cuidador

Verificação, especialidades, valores e avaliações recebidas.

| Ação na tela | Endpoint |
|---|---|
| Carregar o perfil | `GET /cuidadores/:id` |
| Listar as avaliações | `GET /cuidadores/:id/avaliacoes` |
| Botão "Solicitar plantão" | navega para a tela 4 |
| Botão "Conversar antes" | navega para a tela 3 |

### 3. Conversa

Chat entre família e cuidador antes da contratação.

> Esta tela não tem endpoint nesta etapa. A troca de mensagens não foi implementada
> na API porque exige um recurso de tempo real que está previsto para a etapa seguinte.
> A tela existe no protótipo porque faz parte do fluxo de decisão da família.

### 4. Solicitar plantão

Modalidade, quem vai ser cuidado, período e total.

| Ação na tela | Endpoint |
|---|---|
| Carregar os idosos da família | `GET /familias/:id/idosos` |
| Cadastrar um idoso novo | `POST /familias/:id/idosos` |
| Enviar a solicitação | `POST /plantoes` |

O campo de total é exibido, mas não enviado: o servidor calcula `valor_total` a
partir da modalidade, do período e da tabela do cuidador. A resposta 201 traz o
valor definitivo, que a tela mostra na confirmação.

Erros que a tela precisa tratar:

| Resposta | Significado na interface |
|---|---|
| `400` | Destacar os campos listados em `detalhes` |
| `409` "ja tem plantao em aberto nesse periodo" | Avisar que o cuidador está ocupado |
| `409` "ainda nao foi aprovado" | Não deveria acontecer: a busca já filtra |

### 5. Meus plantões

Lista com os estados: aguardando resposta, confirmado, concluído.

| Ação na tela | Endpoint |
|---|---|
| Listar os plantões da família | `GET /plantoes?familia_id=:id` |
| Filtrar por estado | `GET /plantoes?familia_id=:id&status=solicitado` |
| Cancelar | `PATCH /plantoes/:id/status` com `{"status":"cancelado"}` |

Cada plantão vem com `proximos_status`, a lista de transições possíveis a partir do
estado atual. A tela usa isso para decidir quais botões exibir, em vez de repetir a
regra no cliente.

### 6. Avaliar o cuidador

Nota de 1 a 5 e comentário, disponível só no plantão concluído.

| Ação na tela | Endpoint |
|---|---|
| Enviar avaliação | `POST /plantoes/:id/avaliacoes` com `{"autor":"familia", ...}` |

Resposta `409` significa que o plantão não está concluído ou que a família já avaliou.

### 7. Solicitações recebidas (cuidador)

| Ação na tela | Endpoint |
|---|---|
| Listar as solicitações | `GET /plantoes?cuidador_id=:id&status=solicitado` |
| Aceitar | `PATCH /plantoes/:id/status` com `{"status":"aceito"}` |
| Recusar | `PATCH /plantoes/:id/status` com `{"status":"recusado"}` |
| Marcar como concluído | `PATCH /plantoes/:id/status` com `{"status":"concluido"}` |

### 8. Meu cadastro (cuidador)

Documentos, estado da verificação, especialidades e valores.

| Ação na tela | Endpoint |
|---|---|
| Carregar o cadastro | `GET /cuidadores/:id` |
| Listar os documentos | `GET /cuidadores/:id/documentos` |
| Enviar documento | `POST /cuidadores/:id/documentos` |
| Editar especialidades e valores | `PATCH /cuidadores/:id` |

O campo `status_verificacao` controla a faixa do topo: enquanto for `pendente`, a
tela avisa que o cuidador ainda não aparece na busca.

## Resumo da cobertura

| Endpoint | Telas que usam |
|---|---|
| `GET /especialidades` | 1, 8 |
| `GET /cuidadores` | 1 |
| `GET /cuidadores/:id` | 2, 8 |
| `POST /cuidadores` | cadastro inicial |
| `PATCH /cuidadores/:id` | 8 |
| `PATCH /cuidadores/:id/verificacao` | painel administrativo |
| `GET`/`POST /cuidadores/:id/documentos` | 8 |
| `GET /cuidadores/:id/avaliacoes` | 2 |
| `GET`/`POST /familias/:id/idosos` | 4 |
| `GET /plantoes` | 5, 7 |
| `POST /plantoes` | 4 |
| `PATCH /plantoes/:id/status` | 5, 7 |
| `POST /plantoes/:id/avaliacoes` | 6 |

O protótipo navegável das telas está em [`../prototipo/index.html`](../prototipo/index.html).
