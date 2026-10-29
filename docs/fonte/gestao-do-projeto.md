# Gestão de tempo, escopo e cronograma

**Projeto:** Zelio — marketplace de cuidadores de idosos
**Disciplina:** Projeto Integrado em Engenharia de Software III
**Professora:** Leonara Braz (2026.2, UFC Campus Quixadá)
**Aluno:** Vitor Nayan
**Data:** 28/10/2026 — Review Sprint 3

---

## 1. Para que serve este documento

A disciplina pede, em toda sprint review, a apresentação da gestão de tempo,
escopo e cronograma. Este documento é a resposta a esse item e é atualizado a
cada review.

Ele registra três coisas: o que o escopo era e o que virou, o que foi entregue
em cada data em relação ao que estava planejado, e como fica o plano do que
falta. A parte do meio inclui o que atrasou, porque cronograma que só mostra o
que deu certo não serve para decidir nada.

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
| RF08 — painel de acompanhamento diário | Punha o aplicativo dentro da execução do serviço. Exigia tratar dado de saúde de forma contínua, o que muda base legal e arquitetura, e dependia de o cuidador preencher formulário todo dia — a hipótese de maior risco do projeto, e não verificada |
| RF09 — botão de emergência | Cria expectativa de resposta que a plataforma não tem como honrar |
| RF12 — histórico de plantões | Prioridade baixa desde a v1; a listagem por status já atende |

A consequência arquitetural foi grande: saiu um módulo inteiro, duas decisões
de arquitetura, dois cenários de qualidade e dois riscos. O registro está na
seção 15 do documento de arquitetura v2.

### 2.3 Entrada de escopo: segurança do cuidador

Nem toda mudança de escopo é corte. Na sprint 3 entraram três requisitos novos,
RF13, RF14 e RF15, depois de uma observação do professor da disciplina de
Programação para Dispositivos Móveis.

O projeto vinha tratando segurança como problema da família: verificar o
cuidador, conferir documentos, exibir reputação. A observação foi simples e
difícil de contestar — o cuidador também corre risco, e maior em alguns
sentidos, porque é ele quem entra sozinho na casa de um desconhecido.

A entrada é deliberada e tem custo. Ela aumenta o trabalho da sprint 5 e torna a
autenticação, já planejada para a sprint 4, pré-requisito de mais coisas. A
alternativa seria registrar a lacuna e seguir, e isso foi descartado por um
motivo específico: uma plataforma que verifica um lado só empresta credibilidade
ao lado não verificado. Isso é o risco R10 da arquitetura, e não é um risco que
se possa deixar para depois sem mudar o que a interface promete enquanto isso.

### 2.4 Efeito da redução sobre o prazo

A redução diminuiu o trabalho de implementação e aumentou, no curto prazo, o
trabalho de documentação: todo documento escrito sob o escopo antigo precisou
ser revisto. Esse retrabalho é a causa direta do atraso descrito na seção 3.3,
e era previsível — mudança de escopo depois de documentação escrita sempre
cobra esse preço.

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
| — | 22/10 | V2 de arquitetura, requisitos e protótipo atualizado | **Entregue com 6 dias de atraso, em 28/10** |
| 11 | 29/10 | Sprint Review 3 | Esta apresentação |

### 3.3 O que atrasou, e por quê

Entre 24/09 e 28/10 não houve nenhum commit no repositório. São 34 dias sem
registro de trabalho, que cobrem a Sprint Review 2 e o prazo das V2.

A causa não foi o volume de trabalho. A V2 dos documentos, feita em um dia,
mostra que a tarefa não era de 34 dias. O que aconteceu foi concentração de
esforço na outra disciplina do projeto, Programação para Dispositivos Móveis,
cuja Etapa 1 venceu em setembro e consumiu a API, a documentação da proposta e
o protótipo. Terminada aquela entrega, o projeto ficou parado em vez de voltar
para a frente desta disciplina.

O erro de gestão foi tratar as duas disciplinas como filas separadas, atendendo
uma de cada vez, em vez de manter um ritmo mínimo nas duas. Como as duas
compartilham o mesmo produto, parar uma significou parar o produto.

### 3.4 Impacto na nota

A Sprint Review 2 valia 10% da AV2 e não foi apresentada. Isso não é
recuperável e está registrado aqui porque gestão de cronograma que omite a
própria falha não é gestão.

O que resta da AV2 — sprints 3, 4, 5 e 6 — soma 75%, e as duas últimas
concentram 45%. O plano da seção 4 foi montado para que o esforço cresça em
direção a elas, e não o contrário.

---

## 4. Replanejamento

### 4.1 Sprints restantes

| Sprint | Review | Peso | Incremento planejado |
|---|---|---|---|
| 3 | 29/10 | 15% | V2 de requisitos, arquitetura e roteiro; RF10 implementado na API com a regra RN05; separação em três camadas (ADR-10); segurança do cuidador incorporada ao escopo (RF13-RF15) |
| 4 | 12/11 | 15% | Autenticação e sessão na API; duas entrevistas de validação realizadas e registradas, com H10 na pauta |
| 5 | 26/11 | 20% | Verificação do lado da família (RF13) e o que o cuidador vê antes de aceitar (RF14); aplicativo em React Native consumindo a API: busca, perfil e solicitação de plantão |
| 6 | 03/12 | 25% | Fluxo completo até a avaliação; consolidação das entrevistas; ajuste dos requisitos conforme a evidência coletada |

### 4.2 Regra de ritmo adotada

Para não repetir o erro da seção 3.3: **nenhuma semana sem commit**. O
repositório é o instrumento de medição, e um intervalo de 34 dias nele é
visível para qualquer pessoa que olhe. Essa é a métrica, e não uma estimativa
de horas que ninguém confere.

### 4.3 Dependência crítica

A validação com stakeholder é pedida em todas as seis reviews e, até agora, não
foi entregue em nenhuma. Ela não depende de código e não pode ser recuperada no
fim do semestre: duas entrevistas feitas em dezembro não embasam decisões
tomadas em setembro.

Por isso ela é a primeira tarefa da Sprint 4, e não a última. O registro da
primeira conversa, feita de forma informal, está em `docs/validacao/` e é
tratado pelo que é: uma conversa sem método, anotada depois, que serve de
indício e não de evidência.

---

## 5. Riscos de cronograma

| Risco | Probabilidade | Efeito | O que fazer |
|---|---|---|---|
| Não conseguir agendar entrevistas a tempo da Sprint 4 | Média | A dependência da seção 4.3 escorrega de novo | Começar o recrutamento hoje, não na semana da review. Aceitar conversa por telefone |
| A outra disciplina voltar a consumir todo o tempo | Alta | Repetição do atraso de outubro | Regra de ritmo da seção 4.2; usar o fato de as duas compartilharem o produto a favor, e não contra |
| Aplicativo em React Native não ficar pronto para a Sprint 5 | Média | 20% da AV2 em risco | Fatiar por tela e não por camada: uma tela funcionando ponta a ponta vale mais que três pela metade |
| Trabalhar sozinho e adoecer ou ter imprevisto | Baixa | Sem equipe, não há a quem repassar | Manter o incremento sempre integrado em `develop`, para que exista algo apresentável a qualquer momento |
