import { StyleSheet } from 'react-native';

export const cores = {
  fundo: '#FFFFFF',
  preenchimento: '#F5F7F6',
  linha: '#E2E7E5',
  texto: '#14201C',
  textoSecundario: '#4A5654',
  textoSuave: '#7C8785',
  marca: '#10635A',
  marcaSuave: '#E6F2F0',
  marcaEscura: '#0B4E46',
  sucesso: '#23704A',
  sucessoSuave: '#E4F1E9',
  alerta: '#8F6212',
  alertaSuave: '#F7EEDC',
  critico: '#A32A20',
  criticoSuave: '#F9E5E2',
  sobreMarca: '#FFFFFF',
};

export const espaco = { pp: 4, p: 8, m: 12, g: 16, gg: 24, ggg: 32 };

export const base = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.g, gap: espaco.m },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.texto },
  subtitulo: { fontSize: 18, fontWeight: '700', color: cores.texto },
  texto: { fontSize: 16, color: cores.texto, lineHeight: 22 },
  textoSecundario: { fontSize: 15, color: cores.textoSecundario, lineHeight: 21 },
  textoSuave: { fontSize: 13, color: cores.textoSuave },
  cartao: {
    backgroundColor: cores.fundo,
    borderWidth: 1,
    borderColor: cores.linha,
    borderRadius: 14,
    padding: espaco.g,
    gap: espaco.p,
  },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.p },
  linhaQuebravel: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.p },
  entre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espaco.p },
});
