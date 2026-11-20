# Gestão de tempo, escopo e cronograma

**Projeto:** Zelio, marketplace de cuidadores de idosos
**Disciplina:** Projeto Integrado em Engenharia de Software III
**Professora:** Leonara Braz (2026.2, UFC Campus Quixadá)
**Aluno:** Vitor Nayan
**Data:** 19/11/2026, Review Sprint 4

---

## 1. Para que serve este documento

A disciplina pede, em toda sprint review, a apresentação da gestão de tempo,
escopo e cronograma. Este documento responde a esse item e é atualizado a cada
review.

Ele registra o escopo inicial e as mudanças, o que foi entregue em cada data em
relação ao planejado, e o plano das sprints restantes. Os atrasos estão
incluídos, com causa e efeito.

---

## 2. Escopo

### 2.1 Linha de base e mudança

O escopo original, da primeira versão dos documentos, descrevia um produto que
acompanhava a execução do cuidado: a família contratava pelo aplicativo e depois
acompanhava, dia a dia, o registro de medicação, alimentação e atividades
preenchido pelo cuidador, com botão de emergência durante o plantão.

Em setembro, em conversa com a professora, o escopo foi reduzido. O produto
passou a ser um marketplace de contratação, no modelo de aplicativos de serviço
sob demanda: a família busca, escolhe, conversa, contrata e avalia. O serviço
acontece fora do aplicativo.

### 2.2 O que saiu e por quê

| Item | Motivo da saída |
|---|---|
| RF08: painel de acompanhamento diário | Punha o aplicativo dentro da execução do serviço. Exigia tratar dado de saúde de forma contínua, o que muda base legal e arquitetura, e dependia de o cuidador preencher formulário todo dia, a hipótese de maior risco do projeto |
| RF09: botão de emergência | Cria expectativa de resposta que a plataforma não tem como honrar |
| RF12: histórico de plantões | Prioridade baixa desde a v1; a listagem por status já atende |

A consequência arquitetural foi grande: saiu um módulo inteiro, duas decisões
de arquitetura, dois cenários de qualidade e dois riscos. O registro está na
seção 15 do documento de arquitetura v2.

### 2.3 Antecipação do aplicativo para a sprint 4

O aplicativo mobile estava planejado para a sprint 5 e foi entregue na 4.

A antecipação veio da disciplina de Programação para Dispositivos Móveis, cuja
Etapa 2 pede o aplicativo consumindo a API, com entrega em 01/12 e apresentação
em 02/12. As duas disciplinas compartilham o produto, então o mesmo código
atende às duas entregas. Em outubro, a outra disciplina tirou tempo deste
projeto (seção 3.3). Nesta sprint, o esforço nela fez este projeto avançar.

### 2.4 Entradas não planejadas na sprint 4

| Item | Motivo da entrada |
|---|---|
| Edição e exclusão de idoso na API | O cadastro só permitia leitura e criação. A família não corrigia uma idade digitada errada nem removia um registro duplicado |
| Correção de autorização em `GET /plantoes` | Uma família listava os plantões de outra trocando o `familia_id` da consulta. A rota passou a filtrar pelo dono do token |
| `better-sqlite3` como dependência opcional | No Node 26 a instalação da API falhava sem o Windows SDK. Com a dependência opcional, a API usa o SQLite embutido do Node |
| API publicada no Render e APK Android | Demonstração no celular sem depender do computador do aluno na mesma rede |

Os quatro itens são pequenos e cabem no incremento da sprint. Os dois primeiros
corrigem falhas encontradas ao construir as telas: o aplicativo expôs lacunas
que os testes da API não cobriam.

### 2.5 Entrada de escopo: segurança do cuidador

Na sprint 3 entraram três requisitos novos, RF13, RF14 e RF15, depois de uma
observação do professor da disciplina de Programação para Dispositivos Móveis.

O projeto tratava segurança como problema da família: verificar o cuidador,
conferir documentos, exibir reputação. A observação: o cuidador também corre
risco, e maior em alguns sentidos, porque é ele quem entra sozinho na casa de um
desconhecido.

A entrada é deliberada e tem custo. Ela concentra trabalho na sprint 5, e a
autenticação entregue na sprint 4 é pré-requisito dos três requisitos. A
alternativa seria registrar a lacuna e seguir, e foi descartada: uma plataforma
que verifica um lado só empresta credibilidade ao lado não verificado. Esse é o
risco R10 da arquitetura.

### 2.6 Efeito da redução sobre o prazo

A redução diminuiu o trabalho de implementação e aumentou, no curto prazo, o
trabalho de documentação: todo documento escrito sob o escopo antigo precisou
ser revisto. Esse retrabalho é a causa direta do primeiro atraso descrito na
seção 3.3.

---

## 3. Cronograma

### 3.1 Entregas da AV1

| Aula | Data | Entregável | Situação |
|---|---|---|---|
| 2 | 20/08 | Roteiro de coleta de dados | Entregue na data |
| 3 | 27/08 | V1 do documento de arquitetura | Entregue na data |
| 4 | 03/09 | V1 do documento de requisitos | Entregue na data |
| 5 | 10/09 | Protótipo de alta fidelidade + registros de validação | Protótipo entregue na data. **Registros de validação não entregues** |

### 3.2 Sprint reviews

| Aula | Data | Entregável | Situação |
|---|---|---|---|
| 7 | 24/09 | Sprint Review 1 + registros de validação | Apresentada. Registros não entregues |
| 9 | 08/10 | Sprint Review 2 + gestão de tempo + registros | **Não apresentada** |
| - | 22/10 | V2 de arquitetura, requisitos e protótipo atualizado | **Entregue com 6 dias de atraso, em 28/10** |
| 11 | 29/10 | Sprint Review 3 | **Não apresentada** |
| - | 19/11 | Sprint Review 4, remarcada de 12/11 | Entregue nesta data |

### 3.3 O que atrasou, e por quê

**De 24/09 a 28/10.** Nenhum commit no repositório em 34 dias, período que cobre
a Sprint Review 2 e o prazo das V2.

O volume de trabalho não explica o intervalo: a V2 dos documentos foi feita em
um dia. O esforço se concentrou na outra
disciplina do projeto, Programação para Dispositivos Móveis, cuja Etapa 1 venceu
em setembro e consumiu a API, a documentação da proposta e o protótipo.
Terminada aquela entrega, o projeto ficou parado em vez de voltar para a frente
desta disciplina.

O erro de gestão foi tratar as duas disciplinas como filas separadas, atendendo
uma de cada vez, em vez de manter um ritmo mínimo nas duas. Como as duas
compartilham o mesmo produto, parar uma significou parar o produto.

**Em 29/10.** A Sprint Review 3 não foi apresentada. O incremento estava
concluído: a V2 dos documentos, o RF10 e a separação em camadas estão no
repositório desde 28/10 e 29/10.

**De 05/11 a 16/11.** Onze dias sem commit, depois da regra de ritmo adotada em
28/10 (seção 4.2). A sprint 4 teve commits em 05/11, 16/11 e 19/11. O aplicativo
inteiro foi construído em 16/11, o que concentrou o risco da sprint em um único
dia.

### 3.4 Impacto na nota

As Sprint Reviews 2 e 3 não foram apresentadas. Juntas valiam 25% da AV2, e essa
parte não é recuperável.

O que resta da AV2, sprints 5 e 6, soma 45%. É a maior parte do que ainda está
em jogo, e o plano da seção 4 concentra o esforço nela.

---

## 4. Replanejamento

### 4.1 Sprints restantes

| Sprint | Review | Peso | Incremento |
|---|---|---|---|
| 3 | 29/10 | 15% | Não apresentada. Incremento concluído: V2 de requisitos, arquitetura e roteiro; RF10 com a regra RN05; separação em três camadas (ADR-10); segurança do cuidador no escopo (RF13 a RF15) |
| 4 | 19/11 | 15% | **Entregue:** autenticação, sessão e autorização por papel (ADR-11); aplicativo em React Native com 16 telas consumindo a API; chat por MQTT (ADR-12); edição e exclusão de idoso; API no Render e APK Android |
| 5 | 26/11 | 20% | Verificação do lado da família (RF13); o que o cuidador vê antes de aceitar (RF14); registro de início e fim do plantão (RF15); chat verificado entre dois aparelhos |
| 6 | 03/12 | 25% | Fluxo completo verificado no aparelho, da busca à avaliação, incluindo RF13 a RF15; versão final dos documentos de engenharia |

### 4.2 Regra de ritmo adotada

**Nenhuma semana sem commit.** O repositório é o instrumento de medição: a data
de cada commit é pública e qualquer pessoa confere o intervalo entre eles.

Resultado na sprint 4: a regra foi quebrada uma vez, de 05/11 a 16/11.

### 4.3 Convergência das entregas no fim do semestre

As duas disciplinas fecham no mesmo intervalo de três dias:

| Data | Entrega |
|---|---|
| 26/11 | Sprint Review 5 |
| 01/12 | Etapa 2 de Programação para Dispositivos Móveis |
| 02/12 | Apresentação da Etapa 2 |
| 03/12 | Sprint Review 6 |

O produto é o mesmo, então uma funcionalidade nova depois de 26/11 precisa ser
testada e documentada para três entregas em três dias. Por isso as
funcionalidades fecham na sprint 5. De 27/11 a 03/12 entram só correções,
testes no aparelho e documentação.

---

## 5. Riscos de cronograma

| Risco | Probabilidade | Efeito | Resposta |
|---|---|---|---|
| As entregas de 01/12 a 03/12 consumirem o tempo da sprint 6 | Alta | Sprint de maior peso feita às pressas | Funcionalidades fecham em 26/11 (seção 4.3) |
| Hibernação da API publicada durante a demonstração | Alta | O plano gratuito do Render desliga a API após 15 minutos sem acesso. O primeiro acesso demora perto de um minuto e o banco volta aos dados de exemplo | Acessar a API alguns minutos antes de apresentar. O aplicativo espera até 60 segundos pela primeira resposta |
| Chat sem verificação entre dois aparelhos | Média | RF05 apresentado sem demonstração real | Teste com dois aparelhos na sprint 5. O broker da disciplina é público e não guarda mensagens |
| Os requisitos RF13 a RF15 não caberem na sprint 5 | Média | 20% da AV2 com incremento parcial | Fatiar por tela e não por camada: uma tela funcionando de ponta a ponta vale mais que três pela metade |
| Trabalhar sozinho e ter imprevisto | Baixa | Sem equipe, não há a quem repassar | Manter o incremento sempre integrado em `develop`, para que exista algo apresentável a qualquer momento |
