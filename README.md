## Identificação da Equipe

**Disciplina:** Programação para Dispositivos Móveis  
**Período:** 2026.2  
**Projeto:** Zelio  
**Equipe:** trabalho individual

| Nome completo | Matrícula | Turma | Turno | GitHub |
|---|---|---|---|---|
| Vitor Nayan Azevedo Lopes | 514087 | 02 | Noite | [@NayanLopes](https://github.com/NayanLopes) |

### Descrição do projeto

Zelio é um marketplace que conecta famílias a cuidadores de idosos autônomos.

Márcia mora em Quixadá, trabalha em horário comercial e cuida do pai, de 82 anos, com Alzheimer inicial. Quando precisa de alguém para ficar com ele, depende de indicação de conhecidos e não tem como conferir antecedentes nem experiência. Do outro lado, Rosângela cuida de idosos há oito anos e só trabalha quando alguém se lembra de indicá-la.

No Zelio, Márcia filtra cuidadores pela condição clínica que o pai tem, abre o perfil, vê as avaliações de outras famílias, conversa com a cuidadora e solicita o plantão. Rosângela recebe a solicitação e aceita ou recusa. Depois do plantão, as duas partes se avaliam, e a nota passa a aparecer na busca.

**Público-alvo.** Quem contrata: filho ou responsável, de 35 a 60 anos, com pouca familiaridade com aplicativos. Quem presta o serviço: cuidador autônomo com experiência comprovada. Quem modera: administrador que confere documentos e libera cadastros.

**Funcionalidades implementadas.**

- Cadastro e login de família e de cuidador, com sessão que continua depois de fechar o aplicativo.
- Busca de cuidadores verificados, com filtro por especialidade clínica e por nota.
- Perfil do cuidador com valores, especialidades e avaliações recebidas.
- Cadastro, edição e exclusão das pessoas que recebem o cuidado.
- Solicitação de plantão, com valor calculado pelo servidor.
- Aceite, recusa, conclusão, cancelamento e exclusão de plantão.
- Aviso de atraso ou de cancelamento enviado pelo cuidador.
- Avaliação mútua depois da conclusão.
- Conversa em tempo real entre família e cuidador.
- Atualização da lista de plantões no outro aparelho quando o estado muda.
- Envio de documentos pelo cuidador e aprovação do cadastro pelo administrador.

**Regras de negócio.** O cuidador só aparece na busca depois de aprovado. O plantão só é confirmado com o aceite do cuidador. A avaliação só existe depois da conclusão, uma por lado. O preço é calculado no servidor. Um cuidador não recebe dois plantões no mesmo período.

### API REST

**Tecnologias:** Node.js 18 ou superior, Express 4, SQLite com `better-sqlite3`, testes com `node:test`.

**Execução:**

```bash
cd api
npm install
npm run db:reset
npm start
```

A API sobe em `http://localhost:3000`. As variáveis de ambiente são opcionais: `PORT` (padrão 3000) e `DB_ARQUIVO` (padrão `./zelio.db`). `npm run db:reset` recria o banco com dados de exemplo. `npm test` roda os 25 testes das regras de negócio.

Usuários de exemplo, todos com a senha `zelio123`:

| Papel | E-mail |
|---|---|
| Família | `marcia@exemplo.com`, `antonio@exemplo.com` |
| Cuidador aprovado | `rosangela@exemplo.com`, `cleide@exemplo.com`, `mairton@exemplo.com` |
| Cuidador em análise | `joana@exemplo.com` |
| Administrador | `admin@zelio.app` |

**Entidades:**

| Entidade | Atributos principais |
|---|---|
| `cuidadores` | nome, e-mail, telefone, cidade, bairro, anos de experiência, valor da diária, valor da hora, status de verificação |
| `especialidades` | nome da condição clínica. Relação N:N com cuidadores |
| `documentos` | cuidador, tipo, status da conferência, data de envio |
| `familias` | responsável, e-mail, telefone, cidade, bairro |
| `idosos` | família, nome, idade, condição |
| `plantoes` | cuidador, idoso, modalidade, período, horário, valor total, status |
| `avaliacoes` | plantão, autor, nota de 1 a 5, comentário |
| `avisos` | plantão, tipo (atraso ou cancelamento), minutos de atraso, mensagem |
| `usuarios` | e-mail, senha derivada com `scrypt`, papel, vínculo com família ou cuidador |
| `sessoes` | usuário, resumo SHA-256 do token, validade |

**Endpoints:**

| Método | Rota | Finalidade |
|---|---|---|
| POST | `/sessoes` | Entra e devolve o token |
| DELETE | `/sessoes` | Sai e revoga o token |
| GET | `/eu` | Dono do token |
| GET | `/especialidades` | Lista as especialidades |
| GET | `/cuidadores` | Busca com filtros `especialidade`, `cidade`, `bairro`, `nota_minima`, `valor_diaria_max` |
| GET | `/cuidadores/:id` | Perfil com especialidades e reputação |
| POST | `/cuidadores` | Cadastro de cuidador |
| PATCH | `/cuidadores/:id` | Atualiza dados, valores e especialidades |
| PATCH | `/cuidadores/:id/verificacao` | Administrador aprova ou reprova |
| DELETE | `/cuidadores/:id` | Remove o cadastro |
| GET, POST | `/cuidadores/:id/documentos` | Lista e envia documentos |
| GET | `/cuidadores/:id/avaliacoes` | Avaliações recebidas |
| POST | `/familias` | Cadastro de família |
| GET, PATCH, DELETE | `/familias/:id` | Consulta, atualiza e remove a família |
| GET, POST | `/familias/:id/idosos` | Lista e cadastra idosos |
| PATCH, DELETE | `/familias/:id/idosos/:idosoId` | Atualiza e remove um idoso |
| GET | `/plantoes` | Plantões de quem está autenticado, com filtro `status` |
| POST | `/plantoes` | Família solicita um plantão |
| PATCH | `/plantoes/:id/status` | Muda o estado, dentro das transições permitidas |
| DELETE | `/plantoes/:id` | Remove um plantão não concluído |
| GET, POST | `/plantoes/:id/avaliacoes` | Lista e registra avaliações |
| GET, POST | `/plantoes/:id/avisos` | Lista e registra avisos de atraso ou cancelamento |

Exemplo de entrada e saída, `POST /plantoes` com `Authorization: Bearer <token>`:

```json
{
  "cuidador_id": 1,
  "idoso_id": 1,
  "modalidade": "diaria",
  "data_inicio": "2027-01-10",
  "data_fim": "2027-01-12",
  "hora_inicio": "07:00",
  "hora_fim": "19:00"
}
```

Resposta `201`, com os campos principais:

```json
{
  "id": 4,
  "status": "solicitado",
  "valor_total": 420,
  "cuidador": { "id": 1, "nome": "Rosangela Farias", "cidade": "Quixadá", "bairro": "Campo Velho" },
  "idoso": { "id": 1, "nome": "Antonio Sousa", "idade": 82, "familia_id": 1 },
  "familia": { "id": 1, "responsavel": "Marcia Sousa", "cidade": "Quixadá", "bairro": "Centro" },
  "proximos_status": ["aceito", "recusado", "cancelado"]
}
```

A lista completa, com filtros e exemplos de cada caso, está em [`api/README.md`](api/README.md) e em [`api/requests.http`](api/requests.http).

**Validações:** cada rota declara o formato esperado de cada campo. Dado inválido responde `400` com `detalhes` por campo. Falta de token ou sessão vencida responde `401`. Ação fora do papel responde `403`. Violação de regra de negócio responde `409`, com a explicação em `erro`.

```json
{ "erro": "Dados invalidos", "detalhes": { "idade": "deve ser no minimo 40" } }
```

**Persistência:** arquivo SQLite `api/zelio.db`, criado por `npm run db:reset`. As chaves estrangeiras e os `CHECK` do esquema repetem no banco as restrições que os serviços aplicam. Os dados continuam disponíveis depois de reiniciar a API e o aplicativo.

### Aplicação mobile

**Protótipo:** [Zelio v1 no Figma](https://www.figma.com/proto/0G8ldhOI6LclbkswGdjXa2/Zelio-v1?node-id=3-1102), com oito telas e a navegação ligada.

**Tecnologias:** React Native 0.88 com Expo SDK 58, JavaScript, React Navigation (pilha), `fetch` para a API, `expo-secure-store` para o token, AsyncStorage para preferências e histórico de conversa, MQTT.js sobre WebSocket para tempo real.

**Execução:**

```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

O arquivo `mobile/.env` aponta o aplicativo para a API:

```
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
```

| Onde o aplicativo roda | Valor de `EXPO_PUBLIC_API_URL` |
|---|---|
| Celular com Expo Go | `http://IP-DO-COMPUTADOR:3000`, com celular e computador na mesma rede |
| Emulador Android | `http://10.0.2.2:3000` |
| Simulador iOS | `http://localhost:3000` |

No Windows, `ipconfig` mostra o IP no campo "Endereço IPv4". O firewall precisa permitir a entrada na porta 3000. Depois de alterar o `.env`, reinicie com `npx expo start -c`.

A organização do código, a relação de telas e o uso de cada tecnologia estão em [`mobile/README.md`](mobile/README.md). O mapa de cada tela para o endpoint que ela chama está em [`docs/telas-e-endpoints.md`](docs/telas-e-endpoints.md).

### Organização Git

**main:** versão estável e entregável. Recebe apenas merges de `develop`.

**develop:** integração das funcionalidades em desenvolvimento.

**feature/\*:** uma branch por funcionalidade, aberta a partir de `develop` e integrada com `--no-ff`. Exemplos: `feature/api-rest`, `feature/autenticacao`, `feature/api-idosos`, `feature/app-mobile`.

**Contribuições:** trabalho individual. Todos os commits são de Vitor Nayan Azevedo Lopes ([@NayanLopes](https://github.com/NayanLopes)).

| Parte | Histórico |
|---|---|
| API REST | [commits em `api/`](https://github.com/NayanLopes/zelio/commits/develop/api) |
| Aplicação mobile | [commits em `mobile/`](https://github.com/NayanLopes/zelio/commits/develop/mobile) |
| Documentação e protótipo | [commits em `docs/`](https://github.com/NayanLopes/zelio/commits/develop/docs) |

## Estrutura do repositório

| Pasta | Conteúdo |
|---|---|
| [`api/`](api/) | API REST em Node.js e Express, com banco SQLite |
| [`mobile/`](mobile/) | Aplicativo em React Native com Expo |
| [`docs/`](docs/) | Documentos de engenharia em PDF, com o texto-fonte em `docs/fonte/` |
| [`prototipo/`](prototipo/) | Primeira rodada do protótipo, em HTML |

## Documentação

| Documento | Descrição |
|---|---|
| [`docs/proposta-mobile.md`](docs/proposta-mobile.md) | Problema, público-alvo, funcionalidades e entidades |
| [`docs/telas-e-endpoints.md`](docs/telas-e-endpoints.md) | Telas, fluxo de navegação e o endpoint que cada tela chama |
| [`docs/Zelio-requisitos.pdf`](docs/Zelio-requisitos.pdf) | Requisitos funcionais e não funcionais, personas, regras de negócio |
| [`docs/Zelio-arquitetura.pdf`](docs/Zelio-arquitetura.pdf) | Drivers, visões C4, modelo de dados, decisões de arquitetura |
| [`docs/Zelio-roteiro-entrevistas.pdf`](docs/Zelio-roteiro-entrevistas.pdf) | Roteiro de coleta de dados com stakeholders |
| [`docs/Zelio-gestao-do-projeto.pdf`](docs/Zelio-gestao-do-projeto.pdf) | Escopo, cronograma planejado e realizado, replanejamento |
| [`api/README.md`](api/README.md) | Endpoints, regras de negócio e códigos de status da API |
| [`mobile/README.md`](mobile/README.md) | Organização, telas e tecnologias do aplicativo |

O texto-fonte dos quatro PDFs fica em [`docs/fonte/`](docs/fonte/), em markdown.

## Contexto acadêmico

Universidade Federal do Ceará, Campus Quixadá, 2026.2.

- **Programação para Dispositivos Móveis** (Prof. Me. Nator Junior Carvalho da Costa): proposta da solução, API REST, protótipo e aplicativo.
- **Projeto Integrado em Engenharia de Software III** (Profa. Leonara Braz): requisitos, arquitetura, coleta de dados e protótipo.
