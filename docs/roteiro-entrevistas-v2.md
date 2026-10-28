# Roteiro de Entrevistas: Coleta de Dados com Stakeholders

## Zelio: marketplace de cuidadores de idosos

**Disciplina:** Projeto Integrado em Engenharia de Software III
**Professora:** Leonara Braz (2026.2, UFC Campus Quixadá)
**Aluno:** Vitor Nayan
**Versão:** 2.0
**Documento relacionado:** `documento-requisitos-v2.md`

---

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| v1 | 20/08/2026 | Primeira versão, com sete hipóteses |
| v2 | 28/10/2026 | Saíram H2 e H5, que testavam o painel de acompanhamento, junto dos blocos de pergunta ligados a ele. Entraram H8 e H9. O bloco de apresentação da solução foi reescrito para o produto atual |

H2 e H5 testavam funcionalidades que não existem mais. Perguntar sobre elas
gastaria o tempo da entrevista, que é curto, com algo que não decide nada.

---

## 1. Objetivo da coleta

Validar ou refutar as suposições que sustentam o documento de requisitos. Ele
continua sendo um documento **baseado em pesquisa de concorrentes e raciocínio
sobre o domínio**, não em evidência de campo: as duas personas seguem marcadas
como a validar.

A coleta responde a três perguntas:

1. O problema pressuposto pelo projeto é real, e é doloroso o suficiente para
   alguém mudar de comportamento?
2. Os diferenciais definidos — especialização por tipo de cuidado e verificação
   antes da vitrine — importam para quem vai usar?
3. Quais requisitos estão faltando, sobrando ou mal priorizados?

### 1.1 Hipóteses a testar

Cada hipótese está ligada aos requisitos que caem se ela for falsa. Isso é o que transforma a entrevista em instrumento de engenharia, e não em conversa.

| ID | Hipótese | Se for falsa, afeta |
|---|---|---|
| H1 | A maior barreira da família ao contratar um cuidador é **confiança/segurança**, não preço nem disponibilidade | RF02, RF11, RN01 |
| H3 | A escolha do cuidador passa por **especialidade clínica** (Alzheimer, mobilidade, pós-cirúrgico), não só por preço e disponibilidade | RF01, RF04 (diferencial central) |
| H4 | Cuidadores hoje dependem de **boca a boca** e têm ociosidade involuntária entre plantões | Proposta de valor do lado da oferta |
| H6 | Existe disposição a pagar (família) ou a ceder comissão (cuidador) por intermediação | Modelo de negócio |
| H7 | Parte relevante das famílias contratantes tem **baixa familiaridade digital** | RNF01, RNF05 |
| H8 | A verificação feita por uma plataforma **substitui, na prática, o peso da indicação pessoal** na decisão da família | RF02, RF11, RN01: **hipótese de maior risco** |
| H9 | A família quer **conversar com o cuidador antes de contratar**, e é nessa conversa que a decisão se fecha | RF05 |

> **Sobre H8.** Com o corte de escopo, a hipótese de maior risco mudou de lado.
> Antes era H5, sobre o cuidador aceitar preencher o registro diário. Agora é H8,
> e ela é mais fundamental: o produto inteiro aposta que um selo de verificação
> pode ocupar o lugar que hoje é da indicação de um conhecido. Se a família disser
> "eu só contrato quem alguém que eu conheço indicou", o marketplace não tem como
> existir na forma projetada — nem a busca, nem a verificação, nem a reputação
> resolvem. É a primeira coisa a investigar, e a mais desconfortável de ouvir.
>
> H2 e H5 saíram da lista na v2. As duas testavam o painel de acompanhamento, que
> deixou de fazer parte do produto.

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

### Bloco 3: Confiança e verificação (10 min) *(testa H8, a hipótese de maior risco)*

12. Fora essa pessoa, você considerou alguém que **não** tinha sido indicado por conhecido? O que aconteceu? *(H8)*
13. Imagina que você não tivesse ninguém para indicar. O que você faria? *(H8: deixe a pessoa pensar, não ofereça o app como saída)*
14. O que precisaria estar comprovado sobre alguém desconhecido para você deixar essa pessoa sozinha com [o idoso]? *(H8: essa é a pergunta central da entrevista)*
15. Você já contratou algum serviço para dentro de casa por aplicativo? Diarista, montador, cuidador? Como foi? *(H8: comportamento passado vale mais que opinião)*

### Bloco 4: Especialização (5 min)

16. Se você fosse procurar alguém hoje, o que **precisaria** ter na pessoa para você considerar? *(H3: deixe falar antes de sondar)*
17. Você acha que cuidar de alguém com [a condição que ela citou] exige preparo diferente? Isso pesou na escolha? *(H3)*

### Bloco 5: Reação à solução (5 min) *(só agora)*

> "Deixa eu te contar o que estou pensando: um aplicativo onde você encontra cuidadores de idosos que já tiveram antecedentes, curso e referências conferidos antes de aparecer ali. Você filtra por tipo de cuidado, conversa com a pessoa pelo aplicativo antes de decidir, e combina o plantão por lá. O serviço em si acontece normalmente, fora do aplicativo, e no fim vocês dois se avaliam."

18. O que passou pela sua cabeça agora?
19. O que nisso não te convence, ou o que te preocuparia? *(pergunte explicitamente pelo negativo)*
20. Se isso existisse na última vez, você teria usado? Por quê? *(H8)*
21. Você conversaria com a pessoa antes de contratar, ou contrataria direto pelo perfil? *(H9)*
22. Quem na sua família conseguiria usar um app desses sozinho? *(H7, RNF01)*
23. Tem alguém que você acha que eu deveria conversar sobre isso?

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

### Bloco 3: Confiança e verificação (10 min)

11. As famílias costumam pedir documento, antecedentes, referência? Como é isso? *(H1, H8, RF02)*
12. Como você faz hoje para uma família que não te conhece confiar em você? *(H8: do outro lado do balcão)*
13. Você se incomodaria em mandar antecedentes criminais e certificados para um aplicativo aprovar seu cadastro antes de você aparecer na busca? *(RF02, RF11)*
14. E esperar alguns dias por essa aprovação, sem poder trabalhar pelo app nesse tempo? *(RN01: o custo real da verificação)*
15. Ser avaliado com nota pelas famílias, como você vê? *(RF07)*
16. Você avaliaria a família também? Isso faria diferença? *(RF07: avaliação mútua)*

### Bloco 4: Combinação e recusa (5 min)

17. Quando uma família te procura, o que você pergunta antes de aceitar? *(H9, RF05)*
18. Já recusou um trabalho depois de conversar? O que te fez recusar? *(entender os critérios do lado da oferta)*
19. Quanto tempo costuma passar entre o primeiro contato e o primeiro dia de trabalho?

### Bloco 5: Reação à solução (5 min)

> "Estou pensando em um aplicativo onde você monta um perfil com suas especialidades e seus valores, manda seus documentos uma vez para serem conferidos, e depois disso as famílias te encontram pela busca. Elas te chamam, vocês conversam por ali, e se fizer sentido elas mandam uma solicitação de plantão que **você aceita ou recusa**. O serviço acontece normalmente, fora do aplicativo."

20. O que você acha disso?
21. O que te faria **não** usar? *(pergunte pelo negativo)*
22. Ter que aceitar ou recusar cada solicitação te parece bom ou chato? *(RN02: valida a regra central do sistema)*
23. Se o app cobrasse uma porcentagem do valor do plantão, isso faria sentido para você? Quanto seria demais? *(H6)*
24. Tem colega cuidador com quem eu poderia conversar?

---

## 7. Roteiro C: Especialista / intermediário *(opcional, alto valor)*

Para agência de cuidadores, agente comunitário de saúde, enfermeiro(a) ou assistente social. Uma entrevista aqui vale por várias, porque a pessoa viu dezenas de casos.

1. Como as famílias da região costumam encontrar cuidadores hoje?
2. Que problemas você vê acontecerem com mais frequência nessas contratações?
3. Existe alguma exigência legal, de conselho de classe ou de vínculo trabalhista que eu preciso conhecer? *(restrição regulatória: pode virar requisito)*
4. Que informação sobre a saúde do idoso um cuidador **pode** e **não pode** receber antes de aceitar um trabalho? *(RNF06, define o limite do campo de condição)*
5. Na sua experiência, família aceita contratar alguém que não foi indicado por conhecido? O que muda a resposta? *(H8)*
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
H1 ___  H3 ___  H4 ___  H6 ___  H7 ___  H8 ___  H9 ___

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
| A7, A8, B11 | H1 | RF02, RF11, RN01, RNF02 |
| A12, A13, A14, A15, A20, B12, C5 | **H8** | **RF02, RF11, RN01** |
| A16, A17 | H3 | **RF01, RF04** |
| A21, B17 | H9 | RF05 |
| A11 | - | RF10 |
| B4, B5, B6, B7 | H4 | Proposta de valor (oferta) |
| B13, B14 | - | RF02, RF11, RN01 |
| B15, B16 | - | RF07, RN03, RN04 |
| B22 | - | **RN02** |
| A9, B23 | H6 | Modelo de negócio |
| A22 | H7 | RNF01, RNF05 |
| C3, C4 | - | RNF06 (LGPD), possíveis requisitos legais novos |

A linha de H8 é a mais larga da matriz de propósito: sete perguntas, nos três
roteiros, cercando a mesma hipótese por ângulos diferentes. É o que se faz com a
hipótese de maior risco — não se pergunta uma vez e se dá por satisfeito.

---

## 10. Consolidação após as entrevistas

1. **Transcrever/organizar notas** em até 24h de cada entrevista, enquanto a memória ajuda.
2. **Análise de afinidade:** recortar cada achado em um post-it (físico ou Miro/FigJam) e agrupar por tema. Temas que aparecem em 3+ entrevistas viram requisito; os que aparecem em 1 viram observação.
3. **Fechar o veredito das hipóteses** em uma tabela consolidada: confirmada, refutada ou inconclusiva, com a evidência (citação + ID da entrevista).
4. **Atualizar o documento de requisitos para v3:** ajustar personas com dados reais, repriorizar os requisitos, registrar requisitos novos e mover para fora de escopo o que não se sustentou.
5. **Registrar no documento a origem de cada mudança** (por exemplo: "RF05 repriorizado para Alta após ENT-02 e ENT-04"). A rastreabilidade da evidência até o requisito é exatamente o que a disciplina cobra.
6. **Guardar a ficha preenchida** em `docs/validacao/`, uma por entrevista, anonimizada. A ficha é entregável de sprint review, e não anotação pessoal.

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
