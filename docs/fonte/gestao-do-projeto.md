# Gestão de tempo, escopo e cronograma

**Projeto:** Zelio, marketplace de cuidadores de idosos
**Disciplina:** Projeto Integrado em Engenharia de Software III
**Professora:** Leonara Braz (2026.2, UFC Campus Quixadá)
**Aluno:** Vitor Nayan
**Data:** 19/11/2026, Review Sprint 4

---

## 1. Escopo

O Zelio é um marketplace de contratação: a família busca um cuidador, conversa,
solicita o plantão e avalia depois. O serviço acontece fora do aplicativo. Esse
é o escopo desde a redução de setembro, quando saíram o acompanhamento diário
(RF08), o botão de emergência (RF09) e o histórico de plantões (RF12).

Na sprint 3 entraram três requisitos de segurança do cuidador (RF13, RF14 e
RF15), previstos para a sprint 5.

### 1.1 Mudanças na sprint 4

| Mudança | Tipo | Motivo |
|---|---|---|
| Aplicativo mobile | Antecipado da sprint 5 | A Etapa 2 de Programação para Dispositivos Móveis pede o mesmo aplicativo, com entrega em 01/12 |
| Edição e exclusão de idoso na API | Não planejado | Necessário para a tela de cadastro de idosos |
| Correção de acesso em `GET /plantoes` | Não planejado | Uma família conseguia listar os plantões de outra |
| `better-sqlite3` como dependência opcional | Não planejado | A instalação da API falhava no Node 26 |
| API no Render e APK Android | Não planejado | Demonstração no celular |

---

## 2. Cronograma

### 2.1 Planejado e realizado

| Data | Entregável | Situação |
|---|---|---|
| 20/08 | Roteiro de coleta de dados | Entregue |
| 27/08 | V1 do documento de arquitetura | Entregue |
| 03/09 | V1 do documento de requisitos | Entregue |
| 10/09 | Protótipo de alta fidelidade | Entregue |
| 24/09 | Sprint Review 1 | Apresentada |
| 08/10 | Sprint Review 2 | Não apresentada |
| 22/10 | V2 de arquitetura, requisitos e protótipo | Entregue em 28/10 |
| 29/10 | Sprint Review 3 | Não apresentada |
| 19/11 | Sprint Review 4, remarcada de 12/11 | Entregue |

### 2.2 Atrasos

De 24/09 a 28/10 o projeto ficou parado, porque o tempo foi para a Etapa 1 de
Programação para Dispositivos Móveis. A V2 dos documentos saiu com 6 dias de
atraso e a Sprint Review 2 não foi apresentada.

A Sprint Review 3 não foi apresentada. O incremento dela, a V2 dos documentos, o
RF10 e a separação da API em camadas, está no repositório desde 29/10.

Na sprint 4, de 05/11 a 16/11 não houve commit.

### 2.3 Tempo na sprint 4

| Data | Trabalho |
|---|---|
| 05/11 | Autenticação, sessão e autorização por papel na API |
| 16/11 | Aplicativo mobile, edição e exclusão de idoso, correção de acesso, dependência opcional |
| 19/11 | Documentação, publicação da API no Render, APK Android e correções da demonstração |

---

## 3. Próximas sprints

| Sprint | Review | Incremento planejado |
|---|---|---|
| 5 | 26/11 | Verificação do lado da família (RF13), informações para o cuidador antes de aceitar (RF14), início e fim do plantão (RF15), teste do chat entre dois aparelhos |
| 6 | 03/12 | Fluxo completo testado no celular, versão final dos documentos |

As entregas de Programação para Dispositivos Móveis, em 01/12 e 02/12, caem
entre as duas reviews. Como o aplicativo é o mesmo, as funcionalidades novas
entram até 26/11 e a última semana fica para correções e documentação.
