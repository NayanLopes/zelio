# Proposta da solução

**Zelio** — marketplace que conecta famílias a cuidadores de idosos autônomos.

Programação para Dispositivos Móveis · Etapa 1 · Prof. Me. Nator Junior Carvalho da Costa
UFC Campus Quixadá · 2026.2

## O problema

Quando uma família precisa contratar um cuidador para um idoso, ela normalmente
recorre a indicação de conhecidos. Isso traz dois problemas.

Para a família, não há como verificar nada: a confiança vem do intermediário que
indicou, e não de qualquer comprovação. Quem não tem uma indicação à mão acaba
contratando às cegas ou não contratando.

Para o cuidador autônomo, a consequência é ociosidade involuntária. Ele depende de
ser lembrado por alguém, então o trabalho chega em rajadas, sem previsibilidade.

Existem aplicativos de serviços domésticos que incluem "cuidador" como uma categoria
entre diarista, babá e cozinheira. Neles, cuidar de alguém com Alzheimer e cuidar de
alguém acamado são a mesma coisa, o que não corresponde à realidade do trabalho.

## Público-alvo

**Quem contrata.** Filho ou responsável, entre 35 e 60 anos, trabalha em horário
comercial e precisa cobrir os períodos em que não pode estar presente. Parte desse
público tem pouca familiaridade com aplicativos, o que impõe interface simples, alvos
de toque grandes e nenhum ícone sem rótulo.

**Quem presta o serviço.** Cuidador autônomo com experiência comprovada, que busca
previsibilidade de agenda e uma forma de ser encontrado sem depender de indicação.

**Quem modera.** Administrador da plataforma, responsável por conferir documentos e
liberar cadastros.

## Funcionalidades

1. Cadastro de cuidadores com experiência, valores e especialidades clínicas.
2. Envio de documentos comprobatórios e verificação pelo administrador.
3. Cadastro de famílias e dos idosos sob sua responsabilidade.
4. Busca de cuidadores com filtro por especialidade, cidade, bairro, nota e valor.
5. Conversa entre família e cuidador antes da contratação.
6. Solicitação de plantão, com valor calculado pelo servidor.
7. Aceite ou recusa pelo cuidador.
8. Acompanhamento do estado do plantão e aviso de cancelamento ou atraso.
9. Avaliação mútua após a conclusão, alimentando a reputação exibida na busca.

O serviço em si acontece fora do aplicativo. O Zelio intermedia a contratação e
encerra seu papel quando as duas partes se avaliam.

## Entidades e informações

| Entidade | Informações principais |
|---|---|
| **cuidador** | nome, e-mail, telefone, cidade, bairro, anos de experiência, valor da diária, valor da hora, status de verificação |
| **especialidade** | nome da condição clínica atendida |
| **documento** | tipo, status da conferência, data de envio, data da conferência |
| **família** | responsável, e-mail, telefone, cidade, bairro |
| **idoso** | nome, idade, descrição curta da condição, família responsável |
| **plantão** | cuidador, idoso, modalidade, período, horário, valor total, estado |
| **avaliação** | plantão, autor, nota de 1 a 5, comentário |

Relacionamentos: uma família tem vários idosos; um cuidador tem várias especialidades
e uma especialidade tem vários cuidadores, o que exige tabela de junção; um plantão
liga um cuidador a um idoso; um plantão tem no máximo duas avaliações, uma de cada lado.

## Por que a solução justifica uma API e um aplicativo

Três razões.

**Os dados são compartilhados entre dois aplicativos diferentes.** A família e o
cuidador veem o mesmo plantão de lados opostos, com permissões diferentes. Não há
como manter isso no dispositivo.

**As regras não podem morar no cliente.** O aceite do cuidador, o cálculo do valor e
a liberação do cadastro pelo administrador precisam ser decididos em um lugar em que
nenhum dos lados consiga interferir. Se o preço fosse calculado no aplicativo, bastaria
alterar a requisição para mudá-lo.

**O estado do plantão é uma máquina de estados com transições restritas.** Ela precisa
ser aplicada de forma consistente, independentemente de qual aplicativo fez a chamada.

## Regras de negócio

- **RN01** — Um cuidador só aparece na busca depois de aprovado pelo administrador,
  e não pode receber solicitação antes disso.
- **RN02** — Um plantão só é confirmado com o aceite explícito das duas partes. A
  família solicita; o cuidador aceita ou recusa.
- **RN03** — A avaliação só é possível depois que o plantão é concluído, e cada lado
  avalia uma única vez.
- **RN04** — O valor total é calculado pelo servidor a partir da tabela do cuidador.
- **RN05** — Um cuidador não recebe solicitações para períodos que se sobrepõem a
  plantões já solicitados ou aceitos.

## Fora do escopo desta etapa

Pagamento pelo aplicativo, acompanhamento do serviço em andamento, registro de
medicação e botão de emergência. A decisão de não incluí-los é deliberada: o Zelio
intermedia a contratação, e não a execução do cuidado.
