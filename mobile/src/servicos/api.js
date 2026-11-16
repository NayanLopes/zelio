import { API_URL, TEMPO_LIMITE_MS } from '../config';

export class ErroDeApi extends Error {
  constructor(tipo, mensagem, { status = null, detalhes = null } = {}) {
    super(mensagem);
    this.name = 'ErroDeApi';
    this.tipo = tipo;
    this.status = status;
    this.detalhes = detalhes;
  }
}

let tokenAtual = null;
let avisarSessaoEncerrada = null;

export function definirToken(token) {
  tokenAtual = token;
}

export function aoEncerrarSessao(funcao) {
  avisarSessaoEncerrada = funcao;
}

function montarUrl(caminho, consulta) {
  const pares = Object.entries(consulta ?? {})
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`);
  return `${API_URL}${caminho}${pares.length ? `?${pares.join('&')}` : ''}`;
}

function erroDaResposta(status, corpo, enviouToken) {
  const mensagemDoServidor = typeof corpo.erro === 'string' ? corpo.erro : null;
  if (status === 401 && enviouToken) {
    return new ErroDeApi('sessao', 'Sua sessão terminou. Entre de novo.', { status });
  }
  if (status === 401) {
    return new ErroDeApi('credenciais', 'E-mail ou senha incorretos.', { status });
  }
  if (status === 400) {
    const detalhes = corpo.detalhes && typeof corpo.detalhes === 'object' ? corpo.detalhes : null;
    return new ErroDeApi('validacao', mensagemDoServidor ?? 'Dados inválidos.', { status, detalhes });
  }
  if (status === 403) {
    return new ErroDeApi('permissao', mensagemDoServidor ?? 'Você não tem permissão para isso.', { status });
  }
  if (status === 404) {
    return new ErroDeApi('ausente', mensagemDoServidor ?? 'Registro não encontrado.', { status });
  }
  if (status === 409) {
    return new ErroDeApi('regra', mensagemDoServidor ?? 'A operação entrou em conflito com uma regra.', { status });
  }
  return new ErroDeApi('servidor', 'O servidor falhou ao atender o pedido. Tente de novo em instantes.', { status });
}

async function requisitar(metodo, caminho, { corpo, consulta } = {}) {
  const cabecalhos = { Accept: 'application/json' };
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';
  const enviouToken = Boolean(tokenAtual);
  if (enviouToken) cabecalhos.Authorization = `Bearer ${tokenAtual}`;

  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  let resposta;
  let texto;
  try {
    resposta = await fetch(montarUrl(caminho, consulta), {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controle.signal,
    });
    texto = await resposta.text();
  } catch {
    throw new ErroDeApi('conexao', 'Sem conexão com o servidor. Confira a rede e tente de novo.');
  } finally {
    clearTimeout(relogio);
  }

  if (resposta.status === 204) return null;

  let dados;
  try {
    dados = JSON.parse(texto);
  } catch {
    throw new ErroDeApi('resposta_invalida', 'O servidor respondeu em um formato inesperado.', {
      status: resposta.status,
    });
  }
  if (dados === null || typeof dados !== 'object') {
    throw new ErroDeApi('resposta_invalida', 'O servidor respondeu em um formato inesperado.', {
      status: resposta.status,
    });
  }

  if (resposta.ok) return dados;

  const erro = erroDaResposta(resposta.status, dados, enviouToken);
  if (erro.tipo === 'sessao' && avisarSessaoEncerrada) avisarSessaoEncerrada();
  throw erro;
}

export function exigirLista(dados) {
  if (!Array.isArray(dados)) {
    throw new ErroDeApi('resposta_invalida', 'O servidor respondeu em um formato inesperado.');
  }
  return dados;
}

export function exigirObjeto(dados, campos = []) {
  const valido = dados !== null && typeof dados === 'object' && !Array.isArray(dados)
    && campos.every((campo) => dados[campo] !== undefined);
  if (!valido) {
    throw new ErroDeApi('resposta_invalida', 'O servidor respondeu em um formato inesperado.');
  }
  return dados;
}

export const api = {
  get: (caminho, consulta) => requisitar('GET', caminho, { consulta }),
  post: (caminho, corpo) => requisitar('POST', caminho, { corpo }),
  patch: (caminho, corpo) => requisitar('PATCH', caminho, { corpo }),
  delete: (caminho) => requisitar('DELETE', caminho),
};
