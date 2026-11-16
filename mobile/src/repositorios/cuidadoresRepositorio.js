import { api, exigirLista, exigirObjeto } from '../servicos/api';
import { lerJson, salvarJson } from '../servicos/preferencias';

const CHAVE_DO_FILTRO = 'filtro-da-busca';
const FILTRO_PADRAO = { especialidade: null, notaMinima: false };

const filtroValido = (valor) =>
  valor !== null && typeof valor === 'object'
  && (valor.especialidade === null || typeof valor.especialidade === 'string')
  && typeof valor.notaMinima === 'boolean';

export const lerFiltro = () => lerJson(CHAVE_DO_FILTRO, FILTRO_PADRAO, filtroValido);
export const salvarFiltro = (filtro) => salvarJson(CHAVE_DO_FILTRO, filtro);
export const filtroPadrao = () => ({ ...FILTRO_PADRAO });

export async function especialidades() {
  return exigirLista(await api.get('/especialidades'));
}

export async function buscar(filtro) {
  return exigirLista(await api.get('/cuidadores', {
    especialidade: filtro.especialidade,
    nota_minima: filtro.notaMinima ? 4 : undefined,
  }));
}

export async function todosOsCadastros() {
  return exigirLista(await api.get('/cuidadores', { incluir_nao_aprovados: 'true' }));
}

export async function porId(id) {
  return exigirObjeto(await api.get(`/cuidadores/${id}`), ['id', 'nome', 'especialidades']);
}

export async function avaliacoes(id) {
  return exigirLista(await api.get(`/cuidadores/${id}/avaliacoes`));
}

export async function cadastrar(dados) {
  return exigirObjeto(await api.post('/cuidadores', dados), ['id']);
}

export async function atualizar(id, dados) {
  return exigirObjeto(await api.patch(`/cuidadores/${id}`, dados), ['id']);
}

export async function documentos(id) {
  return exigirLista(await api.get(`/cuidadores/${id}/documentos`));
}

export async function enviarDocumento(id, tipo) {
  return exigirObjeto(await api.post(`/cuidadores/${id}/documentos`, { tipo }), ['id']);
}

export async function definirVerificacao(id, status) {
  return exigirObjeto(
    await api.patch(`/cuidadores/${id}/verificacao`, { status_verificacao: status }),
    ['id', 'status_verificacao'],
  );
}

export const remover = (id) => api.delete(`/cuidadores/${id}`);
