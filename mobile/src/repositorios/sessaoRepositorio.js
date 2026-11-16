import { api, definirToken, exigirObjeto } from '../servicos/api';
import { apagarToken, guardarToken, lerToken } from '../servicos/cofre';
import { lerTexto, salvarTexto } from '../servicos/preferencias';

const CHAVE_DO_ULTIMO_EMAIL = 'ultimo-email';

async function nomeDe(usuario) {
  if (usuario.papel === 'familia') {
    const familia = exigirObjeto(await api.get(`/familias/${usuario.familia_id}`), ['responsavel']);
    return familia.responsavel;
  }
  if (usuario.papel === 'cuidador') {
    const cuidador = exigirObjeto(await api.get(`/cuidadores/${usuario.cuidador_id}`), ['nome']);
    return cuidador.nome;
  }
  return 'Administração';
}

export async function entrar(email, senha) {
  const sessao = exigirObjeto(await api.post('/sessoes', { email, senha }), ['token', 'usuario']);
  await guardarToken(sessao.token);
  definirToken(sessao.token);
  await salvarTexto(CHAVE_DO_ULTIMO_EMAIL, email);
  return { ...sessao.usuario, nome: await nomeDe(sessao.usuario) };
}

export async function restaurar() {
  const token = await lerToken();
  if (!token) return null;
  definirToken(token);
  try {
    const usuario = exigirObjeto(await api.get('/eu'), ['id', 'papel']);
    return { ...usuario, nome: await nomeDe(usuario) };
  } catch (erro) {
    if (erro.tipo === 'sessao') {
      definirToken(null);
      await apagarToken();
      return null;
    }
    throw erro;
  }
}

export async function sair() {
  try {
    await api.delete('/sessoes');
  } catch (erro) {
    if (erro.tipo !== 'conexao' && erro.tipo !== 'sessao') throw erro;
  } finally {
    definirToken(null);
    await apagarToken();
  }
}

export async function esquecerSessaoLocal() {
  definirToken(null);
  await apagarToken();
}

export const ultimoEmail = () => lerTexto(CHAVE_DO_ULTIMO_EMAIL);
