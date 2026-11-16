import { dataParaIso, numeroDoTexto } from './formatos';

const vazio = (valor) => valor === undefined || valor === null || String(valor).trim() === '';

export const regra = {
  obrigatorio: (valor) => (vazio(valor) ? 'Preencha este campo.' : null),
  email: (valor) =>
    vazio(valor) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor).trim()) ? null : 'Informe um e-mail válido.',
  tamanhoMinimo: (minimo) => (valor) =>
    vazio(valor) || String(valor).length >= minimo ? null : `Use pelo menos ${minimo} caracteres.`,
  tamanhoMaximo: (maximo) => (valor) =>
    vazio(valor) || String(valor).length <= maximo ? null : `Use no máximo ${maximo} caracteres.`,
  inteiroEntre: (minimo, maximo) => (valor) => {
    if (vazio(valor)) return null;
    const numero = Number(String(valor).trim());
    if (!Number.isInteger(numero)) return 'Informe um número inteiro.';
    if (numero < minimo || numero > maximo) return `Informe um valor entre ${minimo} e ${maximo}.`;
    return null;
  },
  valorPositivo: (valor) => {
    if (vazio(valor)) return null;
    const numero = numeroDoTexto(valor);
    return Number.isFinite(numero) && numero > 0 ? null : 'Informe um valor maior que zero.';
  },
  data: (valor) => (vazio(valor) || dataParaIso(valor) ? null : 'Use o formato DD/MM/AAAA.'),
  hora: (valor) =>
    vazio(valor) || /^([01]\d|2[0-3]):[0-5]\d$/.test(valor) ? null : 'Use o formato HH:MM.',
  telefone: (valor) =>
    vazio(valor) || String(valor).replace(/\D/g, '').length >= 10 ? null : 'Informe o telefone com DDD.',
};

export function validar(valores, esquema) {
  const erros = {};
  for (const [campo, regras] of Object.entries(esquema)) {
    for (const verificar of regras) {
      const mensagem = verificar(valores[campo]);
      if (mensagem) {
        erros[campo] = mensagem;
        break;
      }
    }
  }
  return erros;
}

export const semErros = (erros) => Object.keys(erros).length === 0;

export function semOCampo(erros, campo) {
  if (!(campo in erros)) return erros;
  const restantes = { ...erros };
  delete restantes[campo];
  return restantes;
}

const TRADUCAO_DO_SERVIDOR = [
  [/e obrigatorio/, 'Preencha este campo.'],
  [/e-mail valido/, 'Informe um e-mail válido.'],
  [/no maximo (\d+) caracteres/, 'Texto longo demais.'],
  [/numero inteiro/, 'Informe um número inteiro.'],
  [/no minimo (\d+)/, 'Valor abaixo do mínimo.'],
  [/no maximo (\d+)/, 'Valor acima do máximo.'],
  [/AAAA-MM-DD/, 'Data inválida.'],
  [/HH:MM/, 'Hora inválida.'],
  [/igual ou posterior a data_inicio/, 'A data final vem antes da inicial.'],
  [/posterior a hora_inicio/, 'A hora final precisa ser depois da inicial.'],
];

export function errosDoServidor(detalhes, nomes = {}) {
  const erros = {};
  for (const [campo, mensagem] of Object.entries(detalhes ?? {})) {
    const traducao = TRADUCAO_DO_SERVIDOR.find(([padrao]) => padrao.test(String(mensagem)));
    erros[nomes[campo] ?? campo] = traducao ? traducao[1] : String(mensagem);
  }
  return erros;
}

const MENSAGENS_DE_REGRA = [
  [/ja tem plantao em aberto nesse periodo/, 'Este cuidador já tem plantão nesse período. Escolha outras datas.'],
  [/ainda nao foi aprovado/, 'Este cuidador ainda não foi aprovado pela administração.'],
  [/ja avaliou este plantao/, 'Você já avaliou este plantão.'],
  [/So e possivel avaliar um plantao concluido/, 'Só é possível avaliar depois que o plantão for concluído.'],
  [/Nao e possivel mudar de/, 'O plantão mudou de estado. Atualize a lista e tente de novo.'],
  [/Plantao concluido nao pode ser removido/, 'Plantão concluído não pode ser excluído.'],
  [/idoso que ja tem plantoes/, 'Esta pessoa já tem plantões registrados e não pode ser excluída.'],
  [/Ja existe (usuario|um registro)/, 'Já existe um cadastro com esse e-mail.'],
  [/cuidador com plantoes solicitados ou aceitos/, 'Este cuidador tem plantões em aberto e não pode ser excluído.'],
  [/So e possivel avisar/, 'Só é possível avisar em um plantão confirmado.'],
];

export function mensagemDoErro(erro) {
  if (erro?.tipo === 'regra') {
    const conhecida = MENSAGENS_DE_REGRA.find(([padrao]) => padrao.test(erro.message));
    if (conhecida) return conhecida[1];
  }
  return erro?.message ?? 'Algo deu errado. Tente de novo.';
}
