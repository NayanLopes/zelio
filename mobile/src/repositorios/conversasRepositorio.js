import { LIMITE_DE_MENSAGENS_GUARDADAS, RAIZ_DOS_TOPICOS } from '../config';
import { assinar, publicar } from '../servicos/mqttServico';
import { lerJson, salvarJson } from '../servicos/preferencias';

const observadores = new Set();
let fila = Promise.resolve();

const donoDe = (usuario) =>
  usuario.papel === 'familia' ? `familia-${usuario.familia_id}` : `cuidador-${usuario.cuidador_id}`;

const topicoDe = (par) =>
  `${RAIZ_DOS_TOPICOS}/conversas/cuidador-${par.cuidadorId}/familia-${par.familiaId}`;

const filtroDe = (usuario) =>
  usuario.papel === 'familia'
    ? `${RAIZ_DOS_TOPICOS}/conversas/+/familia-${usuario.familia_id}`
    : `${RAIZ_DOS_TOPICOS}/conversas/cuidador-${usuario.cuidador_id}/+`;

const chaveDoIndice = (usuario) => `${donoDe(usuario)}/conversas`;
const chaveDaConversa = (usuario, par) =>
  `${donoDe(usuario)}/conversa/c${par.cuidadorId}-f${par.familiaId}`;

function parDoTopico(topico) {
  const partes = topico.split('/');
  const cuidador = /^cuidador-(\d+)$/.exec(partes[partes.length - 2] ?? '');
  const familia = /^familia-(\d+)$/.exec(partes[partes.length - 1] ?? '');
  if (!cuidador || !familia) return null;
  return { cuidadorId: Number(cuidador[1]), familiaId: Number(familia[1]) };
}

const mensagemValida = (m) =>
  m !== null && typeof m === 'object'
  && typeof m.id === 'string'
  && (m.de === 'familia' || m.de === 'cuidador')
  && typeof m.nome === 'string'
  && typeof m.texto === 'string' && m.texto.length > 0 && m.texto.length <= 1000
  && typeof m.enviada_em === 'string';

const listaValida = (valor) => Array.isArray(valor);

function emFila(tarefa) {
  const proxima = fila.then(tarefa, tarefa);
  fila = proxima.catch(() => {});
  return proxima;
}

function avisarObservadores(par) {
  for (const observador of observadores) observador(par);
}

async function guardar(usuario, par, mensagem, nomeDoOutro) {
  const chave = chaveDaConversa(usuario, par);
  const mensagens = await lerJson(chave, [], listaValida);
  if (mensagens.some((m) => m.id === mensagem.id)) return false;

  mensagens.push(mensagem);
  await salvarJson(chave, mensagens.slice(-LIMITE_DE_MENSAGENS_GUARDADAS));

  const indice = await lerJson(chaveDoIndice(usuario), [], listaValida);
  const anterior = indice.find((c) => c.cuidadorId === par.cuidadorId && c.familiaId === par.familiaId);
  const recebida = mensagem.de !== usuario.papel;
  const atualizada = {
    cuidadorId: par.cuidadorId,
    familiaId: par.familiaId,
    nomeDoOutro: nomeDoOutro ?? (recebida ? mensagem.nome : anterior?.nomeDoOutro) ?? 'Conversa',
    ultimaMensagem: mensagem.texto,
    ultimaEm: mensagem.enviada_em,
    naoLidas: (anterior?.naoLidas ?? 0) + (recebida ? 1 : 0),
  };
  const restantes = indice.filter((c) => c !== anterior);
  await salvarJson(chaveDoIndice(usuario), [atualizada, ...restantes]);
  return true;
}

export function iniciar(usuario) {
  if (usuario.papel !== 'familia' && usuario.papel !== 'cuidador') return () => {};
  return assinar(filtroDe(usuario), (topico, dados) => {
    const par = parDoTopico(topico);
    if (!par || !mensagemValida(dados)) return;
    emFila(() => guardar(usuario, par, dados)).then((nova) => {
      if (nova) avisarObservadores(par);
    });
  });
}

export function observar(observador) {
  observadores.add(observador);
  return () => observadores.delete(observador);
}

export async function enviar(usuario, par, texto, nomeDoOutro) {
  const mensagem = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    de: usuario.papel,
    nome: usuario.nome,
    texto,
    enviada_em: new Date().toISOString(),
  };
  const publicada = await publicar(topicoDe(par), mensagem);
  if (!publicada) return false;
  await emFila(() => guardar(usuario, par, mensagem, nomeDoOutro));
  avisarObservadores(par);
  return true;
}

export const mensagens = (usuario, par) =>
  emFila(() => lerJson(chaveDaConversa(usuario, par), [], listaValida));

export const conversas = (usuario) =>
  emFila(() => lerJson(chaveDoIndice(usuario), [], listaValida));

export function marcarComoLida(usuario, par) {
  return emFila(async () => {
    const indice = await lerJson(chaveDoIndice(usuario), [], listaValida);
    const alvo = indice.find((c) => c.cuidadorId === par.cuidadorId && c.familiaId === par.familiaId);
    if (!alvo || alvo.naoLidas === 0) return;
    alvo.naoLidas = 0;
    await salvarJson(chaveDoIndice(usuario), indice);
    avisarObservadores(par);
  });
}
