# Roteiro de Entrevistas: Coleta de Dados com Stakeholders

## Zelio: App de Freelance de Cuidadores de Idosos

**Disciplina:** Projeto Integrado em Engenharia de Software III
**Professora:** Leonara Braz (2026.2, UFC Campus Quixadá)
**Versão:** 1.0
**Documento relacionado:** `documento-requisitos-v1.md`

---

## 1. Objetivo da coleta

Validar (ou refutar) as suposições que sustentam o documento de requisitos v1. Hoje esse documento é um **rascunho baseado em pesquisa de concorrentes**, não em evidência de campo: todas as personas e boa parte dos requisitos funcionais estão marcados como "a validar".

A coleta responde a três perguntas:

1. O problema pressuposto pelo projeto é real, e é doloroso o suficiente para alguém mudar de comportamento?
2. Os diferenciais definidos (especialização por tipo de cuidado e painel de acompanhamento) importam para quem vai usar?
3. Quais requisitos estão faltando, sobrando ou mal priorizados?

### 1.1 Hipóteses a testar

Cada hipótese está ligada aos requisitos que caem se ela for falsa. Isso é o que transforma a entrevista em instrumento de engenharia, e não em conversa.

| ID | Hipótese | Se for falsa, afeta |
|---|---|---|
| H1 | A maior barreira da família ao contratar um cuidador é **confiança/segurança**, não preço nem disponibilidade | RF02, RF11, RN01 |
| H2 | Famílias querem **acompanhar o plantão em tempo quase real** e isso as faria escolher um app em vez de indicação | RF08 (diferencial central) |
| H3 | A escolha do cuidador passa por **especialidade clínica** (Alzheimer, mobilidade, pós-cirúrgico), não só por preço e disponibilidade | RF01, RF04 (diferencial central) |
| H4 | Cuidadores hoje dependem de **boca a boca** e têm ociosidade involuntária entre plantões | Proposta de valor do lado da oferta |
| H5 | Cuidadores **aceitariam preencher** um registro diário estruturado sem que isso vire motivo de abandono do app | RF08: **hipótese de maior risco** |
| H6 | Existe disposição a pagar (família) ou a ceder comissão (cuidador) por intermediação | Modelo de negócio |
| H7 | Parte relevante das famílias contratantes tem **baixa familiaridade digital** | RNF01, RNF05 |

> **Sobre H5:** o painel de acompanhamento (RF08) é o principal diferencial do projeto, mas ele transfere trabalho para o cuidador, que não é quem paga. Se cuidadores acharem o registro burocrático, o diferencial morre na prática mesmo que a família adore a ideia. Essa é a hipótese que mais merece atenção nas entrevistas do lado da oferta.

---

## 2. Método

**Técnica:** entrevista semiestruturada, individual, presencial ou por chamada de vídeo/telefone.

**Duração:** 30-45 minutos.

**Amostra mínima (para a disciplina):**

| Perfil | Quantidade mínima | Ideal |
|---|---|---|
| A: Família/contratante | 2 | 4 |
| B: Cuidador(a) de idosos | 2 | 4 |
| C: Especialista/intermediário (agência, ACS, profissional de saúde) | 0 | 1-2 |

**Recrutamento:** rede pessoal, grupos de bairro, unidades básicas de saúde, agências locais de cuidadores, grupos de WhatsApp/Facebook de cuidadores da região de Quixadá e Fortaleza.

**Critérios de inclusão:**

- Perfil A: contratou ou tentou contratar cuidador para um idoso nos últimos 24 meses.
- Perfil B: trabalha ou trabalhou como cuidador(a) de idosos de forma autônoma nos últimos 24 meses.

**Registro:** conduzido por uma pessoa só, o que exige um método diferente do de dupla. Gravação de áudio **apenas com consentimento explícito**, para não precisar dividir atenção entre conduzir e anotar. Durante a conversa, anotar apenas frases literais e reações não verbais; o resto sai da gravação. Expandir as notas e anonimizá-las em até 24h, enquanto a memória ainda ajuda.

---

## 3. Termo de consentimento (ler antes de começar)

> Olá, meu nome é ___ e sou estudante de Engenharia de Software da UFC em Quixadá. Estou desenvolvendo sozinho um projeto acadêmico de um aplicativo para conectar famílias e cuidadores de idosos, chamado Zelio.
>
> Gostaria de conversar por uns 30 minutos sobre a sua experiência. **Não estou vendendo nada** e não existe resposta certa ou errada. Quanto mais sincero você for, inclusive sobre o que não funcionaria, mais útil para mim.
>
> Suas respostas serão usadas **somente para fins acadêmicos**, e seu nome, o nome do idoso e qualquer dado que identifique vocês não aparecerão no trabalho. Você pode se recusar a responder qualquer pergunta e pode interromper a entrevista a qualquer momento, sem precisar justificar.
>
> Posso gravar o áudio só para não perder informação enquanto anoto? A gravação será apagada ao fim da disciplina. **( ) Sim  ( ) Não**
>
> Você concorda em participar? **( ) Sim  ( ) Não**

*Registrar data, forma do consentimento (verbal gravado ou assinado) e perfil do participante na ficha de campo (Seção 8).*

---

## 4. Regras de condução

O erro mais comum em coleta de requisitos é o entrevistado dizer o que acha que você quer ouvir. Estas regras existem para evitar isso:

1. **Pergunte sobre o passado, não sobre o futuro.** "Me conta como foi a última vez que você precisou contratar alguém" vale mais que "Você usaria um app assim?". Opinião sobre o futuro é grátis; comportamento passado é evidência.
2. **Não apresente a solução no começo.** Só descreva o app no bloco final (Bloco 5). Antes disso, o entrevistado precisa contar o problema com as palavras dele.
3. **Nunca faça pergunta indutora.** Errado: "Você não acha importante saber se o idoso tomou o remédio?". Certo: "Como você fica sabendo o que aconteceu durante o dia?".
4. **Persiga o específico.** A cada resposta genérica, pergunte "me dá um exemplo de quando isso aconteceu".
5. **Vá atrás do custo real.** "O que você fez a respeito?", "Quanto tempo isso tomou?", "Quanto você pagou?". Problema que ninguém gastou tempo nem dinheiro para resolver não é problema.
6. **Silêncio é ferramenta.** Depois da resposta, espere três segundos. A parte útil costuma vir aí.
7. **Anote frases literais.** Citações diretas valem mais que paráfrases no relatório e na defesa do documento.
8. **Cheque a gravação antes de começar.** Sozinho, se a gravação falhar você perde a entrevista inteira, porque não há segunda pessoa anotando.

---

## 5. Roteiro A: Família / Contratante

### Bloco 1: Contexto (5 min)

1. Me fala um pouco sobre a sua rotina e sobre a pessoa idosa de quem você cuida ou ajuda a cuidar.
2. Quem mais participa desse cuidado hoje? Como vocês se dividem?
3. Que tipo de cuidado ela precisa? *(sondar sem sugerir: mobilidade, memória, medicação, higiene, pós-cirúrgico)*

### Bloco 2: A última contratação (15 min) *(núcleo da entrevista)*

4. Me conta como foi a **última vez** que vocês precisaram de alguém de fora para ajudar. O que aconteceu?
5. Como vocês encontraram essa pessoa? *(sondar: indicação de quem, quanto tempo levou, quantas pessoas consideraram)*
6. O que fez vocês escolherem **essa** pessoa e não outra?
7. Vocês chegaram a verificar alguma coisa sobre ela? Documento, referência, curso? Como? *(H1)*
8. Teve algum momento em que vocês ficaram inseguros ou desconfiados? Me conta. *(H1)*
9. Quanto vocês pagaram e como foi combinado? *(H6)*
10. O que deu errado nessa contratação, ou o que vocês fariam diferente?
11. Já aconteceu de precisar de alguém de última hora, ou do cuidador faltar? Como resolveram? *(RF10)*

### Bloco 3: Acompanhamento (10 min) *(testa o diferencial)*

12. Nos dias em que o cuidador está lá e você não está, **como você fica sabendo** o que aconteceu? *(H2)*
13. Tem alguma coisa que você gostaria de saber e hoje não sabe? *(H2)*
14. Já teve alguma situação de emergência ou susto durante um plantão? Como foi? *(RF09)*
15. Alguém registra medicação ou alimentação de alguma forma? Caderno, WhatsApp, nada? *(H2, RF08)*

### Bloco 4: Especialização (5 min)

16. Se você fosse procurar alguém hoje, o que **precisaria** ter na pessoa para você considerar? *(H3: deixe falar antes de sondar)*
17. Você acha que cuidar de alguém com [a condição que ela citou] exige preparo diferente? Isso pesou na escolha? *(H3)*

### Bloco 5: Reação à solução (5 min) *(só agora)*

> "Deixa eu te contar o que estou pensando: um aplicativo onde você encontra cuidadores verificados, filtrando por especialidade, e onde o cuidador registra no celular o que aconteceu no dia (medicação, alimentação, intercorrências) e você acompanha de onde estiver."

18. O que passou pela sua cabeça agora?
19. O que nisso não te convence, ou o que te preocuparia? *(pergunte explicitamente pelo negativo)*
20. Se isso existisse na última vez, você teria usado? Por quê? *(H2)*
21. Quem na sua família conseguiria usar um app desses sozinho? *(H7, RNF01)*
22. Tem alguém que você acha que eu deveria conversar sobre isso?

---

## 6. Roteiro B: Cuidador(a)

### Bloco 1: Contexto (5 min)

1. Há quanto tempo você trabalha como cuidador(a)? Como começou?
2. Você tem formação ou curso na área? Qual? *(RF01)*
3. Como é sua semana hoje? Quantas famílias, que tipo de plantão? *(RF06)*

### Bloco 2: Conseguir trabalho (15 min) *(núcleo)*

4. Me conta como você conseguiu o seu **último** cliente. Como chegou até você? *(H4)*
5. E antes desse? *(procurar padrão: sempre indicação?)*
6. Já usou algum app, site ou grupo para achar trabalho? Qual? Como foi? *(H4: se usou, explorar bastante; por que parou?)*
7. Quantos dias no último mês você ficou sem trabalho querendo trabalhar? *(H4: quantificar a dor)*
8. O que é mais difícil na hora de conseguir um cliente novo? *(sondar: confiança da família, negociação de preço, distância)*
9. Como funciona a combinação de valor e pagamento? Já teve calote ou atraso?
10. Já recusou um trabalho? Por quê? *(entender critérios do lado da oferta)*

### Bloco 3: Rotina e registro (10 min) *(testa H5, a hipótese mais arriscada)*

11. Durante o plantão, você anota alguma coisa? Medicação, alimentação, como o idoso passou? *(H5)*
12. Como você passa para a família o que aconteceu no dia? *(H5: sondar conversa na troca, WhatsApp, caderno)*
13. Quanto tempo isso te toma?
14. Se um app pedisse para você registrar isso, tipo marcar que deu o remédio das 14h, **isso te ajudaria ou te atrapalharia**? Por quê? *(H5: pergunta central; não sugerir a resposta)*
15. Em quantos plantões você tem internet boa na casa do cliente? *(restrição de arquitetura: offline)*
16. Já teve emergência durante um plantão? O que você fez? *(RF09)*

### Bloco 4: Confiança e verificação (5 min)

17. As famílias costumam pedir documento, antecedentes, referência? Como é isso? *(H1, RF02)*
18. Você se incomodaria em mandar antecedentes criminais e certificados para um app aprovar seu cadastro? *(RF02, RF11)*
19. E ser avaliado com nota pelas famílias, como você vê? *(RF07)*

### Bloco 5: Reação à solução (5 min)

> "Estou pensando em um app onde você monta um perfil com suas especialidades, passa por uma verificação, e as famílias te encontram e contratam por ele. Durante o plantão você registra no celular o que aconteceu e a família acompanha."

20. O que você acha disso?
21. O que te faria **não** usar? *(pergunte pelo negativo)*
22. Se o app cobrasse uma porcentagem do valor do plantão, isso faria sentido para você? Quanto seria demais? *(H6)*
23. Tem colega cuidador com quem eu poderia conversar?

---

## 7. Roteiro C: Especialista / intermediário *(opcional, alto valor)*

Para agência de cuidadores, agente comunitário de saúde, enfermeiro(a) ou assistente social. Uma entrevista aqui vale por várias, porque a pessoa viu dezenas de casos.

1. Como as famílias da região costumam encontrar cuidadores hoje?
2. Que problemas você vê acontecerem com mais frequência nessas contratações?
3. Existe alguma exigência legal, de conselho de classe ou de vínculo trabalhista que eu preciso conhecer? *(restrição regulatória: pode virar requisito)*
4. Que tipo de registro do cuidado é considerado boa prática? Existe algum modelo?
5. Que informação sobre a saúde do idoso um cuidador **pode** e **não pode** acessar?
6. O que você acha que um app desses erraria?

---

## 8. Ficha de campo (preencher por entrevista)

```
ID da entrevista: ENT-___          Data: __/__/____      Duração: ___ min
Perfil: ( ) A Família  ( ) B Cuidador  ( ) C Especialista
Entrevistador: ____________
Consentimento: ( ) verbal ( ) assinado    Gravação autorizada: ( ) sim ( ) não
Contexto do participante (1 linha, sem identificar):
______________________________________________________________

ACHADOS
Dor mais forte relatada: ______________________________________
Solução atual (o que a pessoa faz hoje): _____________________
Citação literal marcante: "____________________________________"

VEREDITO DAS HIPÓTESES  (C = confirmou | R = refutou | N = não abordado)
H1 ___  H2 ___  H3 ___  H4 ___  H5 ___  H6 ___  H7 ___

IMPACTO NOS REQUISITOS
Requisito que ganhou força: ___________________________________
Requisito que perdeu força: ___________________________________
Requisito NOVO sugerido pela entrevista: ______________________
Surpresa (algo que não estava no nosso mapa): _________________
```

---

## 9. Matriz de rastreabilidade: pergunta → hipótese → requisito

| Pergunta | Hipótese | Requisito impactado |
|---|---|---|
| A7, A8, B17, B18 | H1 | RF02, RF11, RN01, RNF02 |
| A12, A13, A15, B11, B12, B14 | H2, H5 | **RF08** |
| A14, B16 | - | RF09 |
| A16, A17 | H3 | **RF01, RF04** |
| A11 | - | RF10 |
| B4, B5, B6, B7 | H4 | Proposta de valor (oferta) |
| B15 | - | Restrição de arquitetura (operação offline) |
| A9, B22 | H6 | Modelo de negócio |
| A21 | H7 | RNF01, RNF05 |
| B19 | - | RF07, RN04 |
| C3, C5 | - | RNF06 (LGPD), possíveis requisitos legais novos |

---

## 10. Consolidação após as entrevistas

1. **Transcrever/organizar notas** em até 24h de cada entrevista, enquanto a memória ajuda.
2. **Análise de afinidade:** recortar cada achado em um post-it (físico ou Miro/FigJam) e agrupar por tema. Temas que aparecem em 3+ entrevistas viram requisito; os que aparecem em 1 viram observação.
3. **Fechar o veredito das hipóteses** em uma tabela consolidada: confirmada, refutada ou inconclusiva, com a evidência (citação + ID da entrevista).
4. **Atualizar o documento de requisitos para v2:** ajustar personas com dados reais, repriorizar RF01-RF12, registrar requisitos novos e mover para "fora de escopo" o que não se sustentou.
5. **Registrar no documento a origem de cada mudança** (ex.: "RF08 repriorizado para Média após ENT-03 e ENT-05"). Rastreabilidade da evidência até o requisito é exatamente o que a disciplina cobra.

---

## Anexo: Erros a evitar

| Não faça | Faça |
|---|---|
| "Você usaria um app assim?" | "Como foi a última vez que você precisou disso?" |
| "Segurança é importante, né?" | "O que te deixou inseguro naquela vez?" |
| Apresentar a ideia nos primeiros 5 min | Guardar a ideia para o último bloco |
| Aceitar "seria ótimo" como validação | Perguntar "o que você fez a respeito?" |
| Só entrevistar famílias | Entrevistar os dois lados: o app tem dois mercados |
| Anotar só o que confirma a ideia | Anotar principalmente o que contraria |
