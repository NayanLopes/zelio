import { api, exigirLista, exigirObjeto } from '../servicos/api';

export async function cadastrar(dados) {
  return exigirObjeto(await api.post('/familias', dados), ['id']);
}

export async function porId(id) {
  return exigirObjeto(await api.get(`/familias/${id}`), ['id', 'responsavel']);
}

export async function atualizar(id, dados) {
  return exigirObjeto(await api.patch(`/familias/${id}`, dados), ['id']);
}

export async function idosos(familiaId) {
  return exigirLista(await api.get(`/familias/${familiaId}/idosos`));
}

export async function adicionarIdoso(familiaId, dados) {
  return exigirObjeto(await api.post(`/familias/${familiaId}/idosos`, dados), ['id']);
}

export async function atualizarIdoso(familiaId, idosoId, dados) {
  return exigirObjeto(await api.patch(`/familias/${familiaId}/idosos/${idosoId}`, dados), ['id']);
}

export const removerIdoso = (familiaId, idosoId) =>
  api.delete(`/familias/${familiaId}/idosos/${idosoId}`);
