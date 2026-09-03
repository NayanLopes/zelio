# Documento de Requisitos v1
## App de Freelance de Cuidadores de Idosos

**Disciplina:** Projeto Integrado em Engenharia de Software III
**Professora:** Leonara Braz (2026.2)

---

## 1. Introdução

### 1.1 Objetivo do documento
Este documento apresenta os requisitos funcionais e não funcionais do aplicativo, além dos principais stakeholders, personas e regras de negócio identificados na fase de coleta de dados.

### 1.2 Descrição geral do produto
Aplicativo mobile que conecta famílias que precisam de cuidados especializados para idosos a cuidadores autônomos verificados, com foco em **especialização por tipo de cuidado** (ex: Alzheimer, mobilidade reduzida, pós-cirúrgico) e **acompanhamento contínuo da família** durante o serviço.

---

## 2. Stakeholders e Personas

| Papel | Descrição |
|---|---|
| Família/Contratante | Responsável pelo idoso, busca e contrata o cuidador |
| Cuidador | Profissional autônomo que oferece o serviço |
| Idoso | Beneficiário direto do cuidado (pode ou não interagir com o app) |
| Administrador da plataforma | Modera cadastros e verifica documentação |

**Persona 1: Contratante**
Filho(a) ou responsável, entre 35-60 anos, mora com ou perto do idoso, trabalha em horário comercial e precisa de apoio confiável para cobrir períodos em que não pode estar presente.

**Persona 2: Cuidador**
Profissional autônomo, com experiência comprovada, busca flexibilidade de horário e uma forma segura de encontrar clientes sem depender só de indicação boca a boca.

*(a validar/ajustar com entrevistas reais na coleta de dados)*

---

## 3. Requisitos Funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | O sistema deve permitir cadastro de cuidadores com dados pessoais, experiência, certificações e especialidades | Alta |
| RF02 | O sistema deve permitir upload de documentos comprobatórios (antecedentes criminais, certificados) para verificação | Alta |
| RF03 | O sistema deve permitir cadastro de famílias/contratantes com dados do idoso e tipo de cuidado necessário | Alta |
| RF04 | O sistema deve permitir busca e filtro de cuidadores por especialidade, localização, disponibilidade e avaliação | Alta |
| RF05 | O sistema deve permitir chat entre família e cuidador antes da contratação | Alta |
| RF06 | O sistema deve permitir agendamento de plantões (diária, horista, mensal) | Alta |
| RF07 | O sistema deve permitir avaliação e comentário mútuo após o serviço (família avalia cuidador e vice-versa) | Média |
| RF08 | O sistema deve fornecer um painel de acompanhamento diário para a família (registro de medicação, alimentação, atividades) preenchido pelo cuidador | Alta |
| RF09 | O sistema deve permitir botão de emergência/alerta rápido durante o plantão | Média |
| RF10 | O sistema deve notificar a família em caso de cancelamento ou atraso do cuidador | Média |
| RF11 | O sistema deve permitir ao administrador aprovar ou reprovar cadastros de cuidadores | Alta |
| RF12 | O sistema deve gerar histórico de plantões realizados por cuidador e por família | Baixa |

---

## 4. Requisitos Não Funcionais

| ID | Requisito | Categoria |
|---|---|---|
| RNF01 | O aplicativo deve ter interface simples e acessível, considerando que parte dos usuários (famílias) pode ter baixa familiaridade digital | Usabilidade |
| RNF02 | Os dados sensíveis (documentos, antecedentes) devem ser armazenados de forma criptografada | Segurança |
| RNF03 | O tempo de resposta em buscas e filtros não deve ultrapassar 3 segundos | Desempenho |
| RNF04 | O sistema deve estar disponível em português (Brasil) | Localização |
| RNF05 | O aplicativo deve funcionar em dispositivos Android com no mínimo 2GB de RAM | Compatibilidade |
| RNF06 | O sistema deve seguir a LGPD no tratamento de dados pessoais e de saúde | Conformidade legal |

---

## 5. Regras de Negócio

- RN01: Um cuidador só pode ser listado nas buscas após aprovação do administrador.
- RN02: Um plantão só pode ser confirmado após aceite explícito de ambas as partes (família e cuidador).
- RN03: A família só pode avaliar o cuidador após a conclusão registrada do plantão.
- RN04: Cuidadores com nota de avaliação abaixo de um limite mínimo (a definir) ficam sujeitos à revisão do administrador.

---

## 6. Casos de Uso (visão inicial)

1. **Cadastrar cuidador.** O cuidador se cadastra, envia documentos e aguarda aprovação.
2. **Buscar cuidador.** A família filtra por especialidade/localização e visualiza perfis.
3. **Contratar plantão.** A família seleciona o cuidador, define datas e aguarda confirmação.
4. **Registrar acompanhamento.** O cuidador preenche o painel diário durante o plantão.
5. **Avaliar serviço.** Ambas as partes avaliam após a conclusão do plantão.

*(cada caso de uso pode ser detalhado com fluxo principal/alternativo depois da validação com stakeholders)*

---

## 7. Glossário

- **Plantão**: período contratado de trabalho do cuidador (diária, horista ou mensal).
- **Contratante**: família ou responsável legal que contrata o serviço.
- **Painel de acompanhamento**: registro digital preenchido pelo cuidador com informações do dia (medicação, alimentação, intercorrências).

---
