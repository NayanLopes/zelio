# Zelio, aplicativo mobile

Aplicativo em React Native com Expo que consome a [API do Zelio](../api/README.md). Um único aplicativo atende os três papeis: a navegação é montada de acordo com o papel que a API devolve no login.

## Como rodar

Pré-requisitos: Node.js 22.13 ou superior, a API em execução e o Expo Go no celular (ou um emulador).

```bash
npm install
cp .env.example .env
npx expo start
```

| Variável | Finalidade | Padrão |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Endereço da API | `http://localhost:3000` |
| `EXPO_PUBLIC_MQTT_BROKER` | Broker MQTT sobre WebSocket | `wss://mqtt.acilab.com.br` |
| `EXPO_PUBLIC_MQTT_RAIZ` | Prefixo dos tópicos | `ufc-quixada/zelio` |

No celular, `localhost` é o próprio celular. Use o IP do computador na rede local, por exemplo `http://192.168.0.10:3000`. No emulador Android, use `http://10.0.2.2:3000`. Depois de alterar o `.env`, reinicie com `npx expo start -c`.

Dois aparelhos apontados para a mesma API e com o mesmo `EXPO_PUBLIC_MQTT_RAIZ` conversam entre si e veem a mudança de estado dos plantões sem recarregar.

## Organização

```
App.js                    navegação e escolha das telas pelo papel
src/
  config.js               endereço da API, broker e prefixo dos tópicos
  tema.js                 cores, espaçamentos e estilos de base
  telas/                  uma tela por arquivo
  componentes/            peças de interface reutilizadas pelas telas
  repositorios/           operações de cada recurso da API e do histórico local
  servicos/               API (fetch), cofre (SecureStore), preferências (AsyncStorage), MQTT
  contexto/               sessão do usuário e aviso de sucesso ou erro
  hooks/                  consulta com carregamento e erro, ação com bloqueio de toque duplo
  util/                   validação de formulário, máscaras e formatos
```

A dependência segue um sentido só:

```
telas  →  repositorios  →  servicos  →  API, broker, armazenamento
```

| Camada | Conhece | Não conhece |
|---|---|---|
| `telas` | estado da interface, navegação, repositórios | `fetch`, token, chaves de armazenamento |
| `repositorios` | rotas da API, formato dos dados, tópicos | componentes, navegação |
| `servicos` | HTTP, SecureStore, AsyncStorage, MQTT | regras do domínio |

## Telas

| Tela | Papel | Operações na API |
|---|---|---|
| Entrar | todos | `POST /sessoes`, `GET /eu` |
| Criar conta | família | `POST /familias` |
| Cadastro de cuidador | cuidador | `GET /especialidades`, `POST /cuidadores` |
| Encontrar cuidador | família | `GET /especialidades`, `GET /cuidadores` |
| Perfil do cuidador | família | `GET /cuidadores/:id`, `GET /cuidadores/:id/avaliacoes` |
| Solicitar plantão | família | `GET /familias/:id/idosos`, `POST /plantoes` |
| Meus plantões | família | `GET /plantoes`, `PATCH /plantoes/:id/status`, `DELETE /plantoes/:id` |
| Quem recebe o cuidado | família | `GET`, `POST`, `PATCH` e `DELETE` em `/familias/:id/idosos` |
| Solicitações e plantões | cuidador | `GET /plantoes`, `PATCH /plantoes/:id/status`, `DELETE /plantoes/:id` |
| Avisar a família | cuidador | `POST /plantoes/:id/avisos` |
| Meu cadastro | cuidador | `GET` e `PATCH /cuidadores/:id`, `GET` e `POST /cuidadores/:id/documentos` |
| Avaliar | família e cuidador | `POST /plantoes/:id/avaliacoes` |
| Conversas e Conversa | família e cuidador | MQTT, sem endpoint |
| Cadastros de cuidadores | administrador | `GET /cuidadores`, `PATCH /cuidadores/:id/verificacao`, `DELETE /cuidadores/:id` |
| Minha conta | todos | `GET` e `PATCH /familias/:id`, `DELETE /sessoes` |

## Sessão e armazenamento

| Dado | Onde fica | Motivo |
|---|---|---|
| Token da sessão | SecureStore (`zelio.token`) | Dado sensível. Fica no Keystore do Android e no Keychain do iOS |
| Último e-mail usado | AsyncStorage (`@zelio/ultimo-email`) | Preferência sem segredo |
| Filtro da busca | AsyncStorage (`@zelio/filtro-da-busca`) | Preferência sem segredo, em JSON validado na leitura |
| Histórico das conversas | AsyncStorage, uma chave por conversa e por usuário | O broker não guarda mensagens |
| Plantões, cadastros e avaliações | API | Dados compartilhados entre os dois lados |

Ao abrir, o aplicativo lê o token e chama `GET /eu`. Com resposta `401`, o token é apagado e a tela de entrada aparece. Sem conexão, o token é mantido e a tela oferece nova tentativa. Ao sair, `DELETE /sessoes` revoga o token no servidor antes de apagá-lo do aparelho.

## Tempo real com MQTT

`src/servicos/mqttServico.js` cria um único cliente, reutilizado pelo aplicativo inteiro. As telas só importam `assinar`, `publicar` e `observarConexao`.

| Tópico | Conteúdo |
|---|---|
| `<raiz>/conversas/cuidador-<id>/familia-<id>` | Mensagem da conversa, em JSON |
| `<raiz>/plantoes/familia-<id>` | Sinal de que um plantão da família mudou |
| `<raiz>/plantoes/cuidador-<id>` | Sinal de que um plantão do cuidador mudou |

Cada usuário assina as próprias conversas com curinga de um nível (`+`). Toda mensagem recebida é validada antes de entrar no histórico, e mensagens repetidas são descartadas pelo identificador.

O sinal de plantão não carrega o estado. Quem recebe consulta `GET /plantoes` de novo, e a API continua sendo a única fonte do estado.

Limitações do broker da disciplina, que é público e sem autenticação:

- quem conhecer o tópico consegue ler e publicar nele;
- mensagem enviada com o destinatário desconectado não é entregue depois;
- o histórico existe só no aparelho que enviou ou recebeu.

Um produto real moveria a conversa para a API, com autenticação e armazenamento no servidor.

## Tratamento de erros

`src/servicos/api.js` classifica toda falha antes que ela chegue à tela:

| Tipo | Situação | O que a interface mostra |
|---|---|---|
| `conexao` | Sem rede, servidor fora do ar ou 60 segundos sem resposta | Aviso de conexão, com botão para tentar de novo |
| `resposta_invalida` | Corpo que não é JSON ou sem os campos esperados | Aviso de resposta inesperada |
| `sessao` | `401` em chamada com token | Volta para a tela de entrada |
| `credenciais` | `401` no login | "E-mail ou senha incorretos." |
| `validacao` | `400` com `detalhes` | Mensagem embaixo de cada campo |
| `permissao` | `403` | Mensagem da API |
| `regra` | `409` | Mensagem traduzida para a situação |
| `servidor` | `500` | Aviso genérico de falha do servidor |

Os formulários validam os campos antes de enviar. Listas mostram carregamento, lista vazia e erro como estados separados. Botões ficam desabilitados enquanto uma operação está em andamento.
