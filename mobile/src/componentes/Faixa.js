import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../tema';

const TIPOS = {
  info: { fundo: cores.marcaSuave, texto: cores.marcaEscura },
  sucesso: { fundo: cores.sucessoSuave, texto: cores.sucesso },
  alerta: { fundo: cores.alertaSuave, texto: cores.alerta },
  erro: { fundo: cores.criticoSuave, texto: cores.critico },
};

export default function Faixa({ tipo = 'info', titulo, texto }) {
  const aparencia = TIPOS[tipo];
  return (
    <View style={[estilos.faixa, { backgroundColor: aparencia.fundo }]}>
      {titulo ? <Text style={[estilos.titulo, { color: aparencia.texto }]}>{titulo}</Text> : null}
      {texto ? <Text style={[estilos.texto, { color: aparencia.texto }]}>{texto}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: { borderRadius: 12, padding: espaco.m, gap: espaco.pp },
  titulo: { fontSize: 15, fontWeight: '700' },
  texto: { fontSize: 15, lineHeight: 21 },
});
