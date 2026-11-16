const soDigitos = (texto) => texto.replace(/\D/g, '');

export function mascararData(texto) {
  const d = soDigitos(texto).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function mascararHora(texto) {
  const d = soDigitos(texto).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}

export function dataParaIso(texto) {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return null;
  const [, dia, mes, ano] = partes;
  const data = new Date(Date.UTC(Number(ano), Number(mes) - 1, Number(dia)));
  const existe = data.getUTCFullYear() === Number(ano)
    && data.getUTCMonth() === Number(mes) - 1
    && data.getUTCDate() === Number(dia);
  return existe ? `${ano}-${mes}-${dia}` : null;
}

export function isoParaData(iso) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : '';
}

export function hojeEmIso() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function moeda(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 'R$ --';
  const [inteiro, centavos] = numero.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

export function numeroDoTexto(texto) {
  const limpo = String(texto).trim().replace(/\./g, '').replace(',', '.');
  if (limpo === '') return NaN;
  return Number(limpo);
}

export function periodo(plantao) {
  const inicio = isoParaData(plantao.data_inicio);
  const fim = isoParaData(plantao.data_fim);
  const dias = inicio === fim ? inicio : `${inicio} a ${fim}`;
  return `${dias}, das ${plantao.hora_inicio} às ${plantao.hora_fim}`;
}

export function horaDaMensagem(iso) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '';
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${hora}:${minuto}`;
}

export const ROTULO_DO_STATUS = {
  solicitado: 'Aguardando resposta',
  aceito: 'Confirmado',
  recusado: 'Recusado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export const ROTULO_DA_MODALIDADE = {
  horista: 'Por hora',
  diaria: 'Diária',
  mensal: 'Mensal',
};

export const ROTULO_DO_DOCUMENTO = {
  antecedentes: 'Certidão de antecedentes',
  certificado: 'Certificado de curso',
  identidade: 'Documento de identidade',
};

export const ROTULO_DA_VERIFICACAO = {
  pendente: 'Em análise',
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
  em_analise: 'Em análise',
};

export function estimarValor(cuidador, modalidade, inicioIso, fimIso, horaInicio, horaFim) {
  if (!cuidador || !inicioIso || !fimIso) return null;
  const dias = Math.floor((Date.parse(`${fimIso}T00:00:00Z`) - Date.parse(`${inicioIso}T00:00:00Z`)) / 86400000) + 1;
  if (!(dias > 0)) return null;
  if (modalidade === 'diaria') return dias * cuidador.valor_diaria;
  if (modalidade === 'mensal') return dias * cuidador.valor_diaria * 0.9;
  const inicio = /^(\d{2}):(\d{2})$/.exec(horaInicio ?? '');
  const fim = /^(\d{2}):(\d{2})$/.exec(horaFim ?? '');
  if (!inicio || !fim) return null;
  const horas = (Number(fim[1]) * 60 + Number(fim[2]) - Number(inicio[1]) * 60 - Number(inicio[2])) / 60;
  if (!(horas > 0)) return null;
  return horas * dias * cuidador.valor_hora;
}
