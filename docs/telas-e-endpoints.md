# Projeto da aplicação mobile

Telas principais, fluxo de navegação e a ligação de cada tela com os endpoints da API.

Protótipo navegável: **[Zelio v1 no Figma](https://www.figma.com/proto/0G8ldhOI6LclbkswGdjXa2/Zelio-v1?node-id=3-1102)**

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
| Filtrar por região | `GET /cuidadores?cidade=Quixad%C3%A1&bairro=Centro` |
| Ordenar por reputação | `GET /cuidadores?nota_minima=4` |

A lista traz `nota_media` e `total_avaliacoes` já calculados, e só contém aprovados.
A tela não filtra nada por conta própria.

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

Esta tela não chama a API. A troca de mensagens usa MQTT sobre WebSocket, com um
tópico por par: `<raiz>/conversas/cuidador-<id>/familia-<id>`. O histórico fica no
AsyncStorage de cada aparelho. Os detalhes e as limitações estão em
[`../mobile/README.md`](../mobile/README.md).

### 4. Solicitar plantão

Modalidade, quem vai ser cuidado, período e total.

| Ação na tela | Endpoint |
|---|---|
| Carregar o cuidador e seus valores | `GET /cuidadores/:id` |
| Carregar os idosos da família | `GET /familias/:id/idosos` |
| Cadastrar um idoso novo | navega para a tela 10 |
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
| Listar os plantões da família | `GET /plantoes` |
| Filtrar por estado | `GET /plantoes?status=solicitado` |
| Cancelar | `PATCH /plantoes/:id/status` com `{"status":"cancelado"}` |
| Marcar como concluído | `PATCH /plantoes/:id/status` com `{"status":"concluido"}` |
| Excluir plantão recusado ou cancelado | `DELETE /plantoes/:id` |

A API devolve só os plantões de quem está autenticado, então a tela não envia
`familia_id`. Quando o cuidador muda o estado de um plantão, um sinal por MQTT faz
esta lista consultar a API de novo.

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
| Listar as solicitações | `GET /plantoes?status=solicitado` |
| Aceitar | `PATCH /plantoes/:id/status` com `{"status":"aceito"}` |
| Recusar | `PATCH /plantoes/:id/status` com `{"status":"recusado"}` |
| Marcar como concluído | `PATCH /plantoes/:id/status` com `{"status":"concluido"}` |
| Avisar atraso ou cancelamento | `POST /plantoes/:id/avisos` |
| Avaliar a família | `POST /plantoes/:id/avaliacoes` com `{"autor":"cuidador", ...}` |

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

## Telas acrescentadas na implementação

O protótipo não tinha entrada, cadastro nem administração. As telas abaixo
entraram na Etapa 2 porque a API exige autenticação e porque o cadastro do
cuidador depende de aprovação.

### 9. Entrar e criar conta

| Ação na tela | Endpoint |
|---|---|
| Entrar | `POST /sessoes` |
| Restaurar a sessão ao abrir o aplicativo | `GET /eu` |
| Criar conta de família | `POST /familias` |
| Criar conta de cuidador | `GET /especialidades`, `POST /cuidadores` |
| Sair | `DELETE /sessoes` |

### 10. Quem recebe o cuidado (família)

| Ação na tela | Endpoint |
|---|---|
| Listar | `GET /familias/:id/idosos` |
| Cadastrar | `POST /familias/:id/idosos` |
| Editar | `PATCH /familias/:id/idosos/:idosoId` |
| Excluir | `DELETE /familias/:id/idosos/:idosoId` |

Resposta `409` na exclusão significa que a pessoa já teve plantão registrado.

### 11. Minha conta

| Ação na tela | Endpoint |
|---|---|
| Carregar os dados da família | `GET /familias/:id` |
| Atualizar os dados da família | `PATCH /familias/:id` |

### 12. Cadastros de cuidadores (administrador)

| Ação na tela | Endpoint |
|---|---|
| Listar todos os cadastros | `GET /cuidadores?incluir_nao_aprovados=true` |
| Aprovar ou reprovar | `PATCH /cuidadores/:id/verificacao` |
| Excluir | `DELETE /cuidadores/:id` |

## Resumo da cobertura

| Endpoint | Telas que usam |
|---|---|
| `POST`/`DELETE /sessoes`, `GET /eu` | 9 |
| `GET /especialidades` | 1, 8, 9 |
| `GET /cuidadores` | 1, 12 |
| `GET /cuidadores/:id` | 2, 4, 8 |
| `POST /cuidadores` | 9 |
| `PATCH /cuidadores/:id` | 8 |
| `PATCH /cuidadores/:id/verificacao` | 12 |
| `DELETE /cuidadores/:id` | 12 |
| `GET`/`POST /cuidadores/:id/documentos` | 8 |
| `GET /cuidadores/:id/avaliacoes` | 2 |
| `POST /familias` | 9 |
| `GET`/`PATCH /familias/:id` | 11 |
| `GET`/`POST /familias/:id/idosos` | 4, 10 |
| `PATCH`/`DELETE /familias/:id/idosos/:idosoId` | 10 |
| `GET /plantoes` | 5, 7 |
| `POST /plantoes` | 4 |
| `PATCH /plantoes/:id/status` | 5, 7 |
| `DELETE /plantoes/:id` | 5, 7 |
| `POST /plantoes/:id/avaliacoes` | 6, 7 |
| `POST /plantoes/:id/avisos` | 7 |

A primeira rodada do protótipo, em HTML, está em [`../prototipo/index.html`](../prototipo/index.html).
