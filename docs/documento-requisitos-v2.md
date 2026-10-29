# Documento de Requisitos v2
## Zelio — marketplace de cuidadores de idosos

**Disciplina:** Projeto Integrado em Engenharia de Software III
**Professora:** Leonara Braz (2026.2)
**Aluno:** Vitor Nayan — Universidade Federal do Ceará, Campus Quixadá

---

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| v1 | 03/09/2026 | Primeira versão, com doze requisitos funcionais |
| v2 | 28/10/2026 | Redução de escopo para o modelo de marketplace. Saíram RF08, RF09 e RF12; a seção 8 registra o motivo de cada saída |

A numeração dos requisitos remanescentes foi mantida. Renumerar quebraria as
referências no documento de arquitetura, no protótipo e nos commits já feitos, e
a lacuna deixa visível que houve uma decisão de corte.

---

## 1. Introdução

### 1.1 Objetivo do documento

Apresentar os requisitos funcionais e não funcionais do Zelio, junto dos
stakeholders, personas e regras de negócio identificados na coleta de dados.

### 1.2 Descrição geral do produto

O Zelio é um aplicativo mobile que conecta famílias a cuidadores de idosos
autônomos verificados. O diferencial está em duas coisas: a busca por
**especialização de cuidado** (Alzheimer, mobilidade reduzida, pós-cirúrgico) em
vez de uma categoria genérica de "cuidador", e a **verificação documental antes
da vitrine** — quem não foi aprovado por um administrador não aparece na busca.

O ciclo começa e termina no aplicativo: a família busca, escolhe, conversa,
solicita o plantão, e depois da conclusão as duas partes se avaliam.

### 1.3 Limites do produto

O Zelio intermedia a contratação. Ele não acompanha a execução do cuidado.

Estão fora do escopo, por decisão registrada na seção 8:

- acompanhamento do serviço enquanto ele acontece, incluindo registro diário de
  medicação, alimentação e atividades;
- acionação de emergência;
- prontário ou plano de cuidado;
- pagamento dentro do aplicativo — o valor é combinado e pago fora.

O único dado de saúde tratado é uma descrição curta da condição do idoso,
escrita pela própria família, usada para que o cuidador decida se aceita o
plantão.

---

## 2. Stakeholders e personas

| Papel | Descrição |
|---|---|
| Família / contratante | Responsável pelo idoso. Busca, escolhe e contrata o cuidador |
| Cuidador | Profissional autônomo que oferece o serviço |
| Idoso | Beneficiário do cuidado. Não é usuário do aplicativo |
| Administrador da plataforma | Confere documentação e aprova ou reprova cadastros |

**Persona 1 — contratante.** Filho ou responsável, entre 35 e 60 anos, mora com ou
perto do idoso, trabalha em horário comercial e precisa cobrir os períodos em que
não pode estar presente. Parte desse público tem pouca familiaridade digital, o
que impõe alvos de toque grandes e nenhum ícone sem rótulo de texto.

**Persona 2 — cuidador.** Profissional autônomo com experiência comprovada. O
trabalho hoje chega por indicação, em rajadas, sem previsibilidade de agenda nem
de renda. Busca um jeito de ser encontrado sem depender de quem se lembra dele.

> As duas personas vieram da definição inicial do projeto e seguem em validação.
> O registro das conversas está em `docs/validacao/`.

---

## 3. Requisitos funcionais

| ID | Requisito | Prioridade | Situação |
|---|---|---|---|
| RF01 | Cadastro de cuidadores com dados pessoais, experiência, certificações e especialidades | Alta | Implementado na API |
| RF02 | Envio de documentos comprobatórios (antecedentes criminais, certificados) para verificação | Alta | Implementado na API |
| RF03 | Cadastro de famílias com dados do idoso e tipo de cuidado necessário | Alta | Implementado na API |
| RF04 | Busca e filtro de cuidadores por especialidade, localização e avaliação | Alta | Implementado na API |
| RF05 | Chat entre família e cuidador antes da contratação | Alta | Previsto — exige recurso de tempo real |
| RF06 | Agendamento de plantões nas modalidades horista, diária e mensal | Alta | Implementado na API |
| RF07 | Avaliação e comentário mútuo após a conclusão do plantão | Média | Implementado na API |
| RF10 | Aviso à família em caso de cancelamento ou atraso do cuidador | Média | Implementado na API |
| RF11 | Aprovação ou reprovação de cadastros de cuidadores pelo administrador | Alta | Implementado na API |

A coluna de situação se refere à API REST em `api/`. "Implementado" significa que
existe endpoint, validação e teste automático cobrindo o requisito.

---

## 4. Requisitos não funcionais

| ID | Requisito | Categoria |
|---|---|---|
| RNF01 | Interface simples e acessível, considerando que parte das famílias tem baixa familiaridade digital | Usabilidade |
| RNF02 | Documentos comprobatórios devem ser armazenados de forma criptografada e nunca expostos na busca | Segurança |
| RNF03 | O tempo de resposta de busca e filtro não deve ultrapassar 3 segundos | Desempenho |
| RNF04 | Interface e conteúdo em português do Brasil | Localização |
| RNF05 | Funcionar em dispositivos Android com no mínimo 2 GB de RAM | Compatibilidade |
| RNF06 | A descrição da condição do idoso é dado pessoal sensível e exige consentimento específico e destacado da família, nos termos do art. 11 da LGPD | Conformidade legal |

Sobre a RNF06: a v1 tratava o tema como "dados pessoais e de saúde" de forma
genérica. Com o escopo reduzido, o único dado sensível que o sistema guarda é a
descrição da condição, escrita pela família. Isso não configura tutela da saúde,
então a base legal aplicável é o consentimento, e ele precisa ser pedido de forma
destacada das demais cláusulas.

---

## 5. Regras de negócio

- **RN01.** Um cuidador só aparece nas buscas depois da aprovação do administrador.
- **RN02.** Um plantão só é confirmado após aceite explícito das duas partes: a
  família solicita, o cuidador aceita.
- **RN03.** A família só pode avaliar depois da conclusão do plantão, e cada lado
  avalia uma única vez.
- **RN04.** Cuidadores com nota abaixo de um limite mínimo ficam sujeitos à revisão
  do administrador. O limite ainda não foi definido e depende de volume de uso.

As três primeiras estão implementadas na camada de serviços da API, com teste
automático cada uma. A tentativa de violar qualquer uma delas responde 409.

---

## 6. Casos de uso

1. **Cadastrar cuidador.** O cuidador se cadastra, envia documentos e aguarda
   aprovação. Enquanto espera, não aparece na busca.
2. **Aprovar cadastro.** O administrador confere os documentos e libera ou recusa.
3. **Buscar cuidador.** A família filtra por especialidade e região e abre perfis.
4. **Conversar antes de contratar.** Família e cuidador combinam detalhes pelo chat.
5. **Solicitar plantão.** A família escolhe modalidade, período e envia a solicitação.
6. **Responder solicitação.** O cuidador aceita ou recusa. Só o aceite confirma.
7. **Avaliar serviço.** Depois da conclusão, as duas partes se avaliam.

O fluxo detalhado de cada caso, com caminho principal e alternativo, entra na
próxima versão, depois das sessões de validação.

---

## 7. Glossário

- **Plantão.** Período contratado de trabalho do cuidador, nas modalidades horista,
  diária ou mensal.
- **Contratante.** Família ou responsável legal que contrata o serviço.
- **Verificação.** Conferência dos documentos do cuidador pelo administrador. É o
  que separa um cadastro de um perfil visível na busca.
- **Solicitação.** Pedido de plantão enviado pela família, ainda sem confirmação.
  Vira plantão confirmado quando o cuidador aceita.
- **Especialidade.** Tipo de cuidado em que o cuidador declara ter experiência.
  É o eixo da busca.

---

## 8. Requisitos removidos na v2

A redução de escopo foi acordada com a professora em setembro de 2026. O produto passou
a ser um marketplace de contratação, no modelo de aplicativos de serviço sob
demanda, e deixou de tentar cobrir a execução do cuidado.

| ID | Requisito | Por que saiu |
|---|---|---|
| RF08 | Painel de acompanhamento diário preenchido pelo cuidador | Punha o aplicativo dentro da execução do serviço. Exigia tratar dado de saúde de forma contínua, o que muda a base legal e a arquitetura inteira, e dependia de o cuidador preencher um formulário todo dia — hipótese de maior risco do projeto e não verificada |
| RF09 | Botão de emergência durante o plantão | Cria expectativa de resposta que a plataforma não tem como honrar. Um botão de socorro que só envia notificação é pior que não ter botão, porque desloca a ligação para o SAMU |
| RF12 | Histórico de plantões por cuidador e por família | Prioridade baixa desde a v1. Com o escopo reduzido, a listagem de plantões por status já atende o que a tela precisa |

Nada do que saiu foi descartado por dificuldade de implementação. RF08 e RF09
saíram porque mudavam a natureza do produto; RF12 saiu por prioridade.
