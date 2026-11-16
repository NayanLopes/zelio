import { api, exigirLista, exigirObjeto } from '../servicos/api';
import { avisarMudanca } from '../servicos/avisosDePlantao';

const CAMPOS_DO_PLANTAO = ['id', 'status', 'cuidador', 'idoso', 'proximos_status'];

export async function listar(status) {
  return exigirLista(await api.get('/plantoes', { status }));
}

export async function solicitar(dados) {
  const plantao = exigirObjeto(await api.post('/plantoes', dados), CAMPOS_DO_PLANTAO);
  avisarMudanca(plantao);
  return plantao;
}

export async function mudarStatus(id, status) {
  const plantao = exigirObjeto(await api.patch(`/plantoes/${id}/status`, { status }), CAMPOS_DO_PLANTAO);
  avisarMudanca(plantao);
  return plantao;
}

export async function remover(plantao) {
  await api.delete(`/plantoes/${plantao.id}`);
  avisarMudanca(plantao);
}

export async function avaliar(id, autor, nota, comentario) {
  const corpo = { autor, nota };
  if (comentario) corpo.comentario = comentario;
  return exigirObjeto(await api.post(`/plantoes/${id}/avaliacoes`, corpo), ['id']);
}

export async function avisar(plantao, dados) {
  const resposta = exigirObjeto(await api.post(`/plantoes/${plantao.id}/avisos`, dados));
  avisarMudanca(plantao);
  return resposta;
}
