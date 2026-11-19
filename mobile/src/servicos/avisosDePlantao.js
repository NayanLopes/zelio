import { RAIZ_DOS_TOPICOS } from '../config';
import { assinar, publicar } from './mqttServico';

const topicoDaFamilia = (id) => `${RAIZ_DOS_TOPICOS}/plantoes/familia-${id}`;
const topicoDoCuidador = (id) => `${RAIZ_DOS_TOPICOS}/plantoes/cuidador-${id}`;

export function avisarMudanca(plantao) {
  const aviso = { plantao_id: plantao.id, em: new Date().toISOString() };
  if (plantao.familia?.id) publicar(topicoDaFamilia(plantao.familia.id), aviso);
  if (plantao.cuidador?.id) publicar(topicoDoCuidador(plantao.cuidador.id), aviso);
}

export function observarMudancas(usuario, aoMudar) {
  if (usuario.papel === 'familia') return assinar(topicoDaFamilia(usuario.familia_id), () => aoMudar());
  if (usuario.papel === 'cuidador') return assinar(topicoDoCuidador(usuario.cuidador_id), () => aoMudar());
  return () => {};
}
