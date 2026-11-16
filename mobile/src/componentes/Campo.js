import { StyleSheet, Text, TextInput, View } from 'react-native';
import { cores, espaco } from '../tema';

export default function Campo({ rotulo, erro, ajuda, estilo, ...entrada }) {
  return (
    <View style={[estilos.grupo, estilo]}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSuave}
        style={[estilos.entrada, entrada.multiline && estilos.multilinha, erro && estilos.entradaComErro]}
        {...entrada}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
      {!erro && ajuda ? <Text style={estilos.ajuda}>{ajuda}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { gap: espaco.pp },
  rotulo: { fontSize: 15, fontWeight: '600', color: cores.texto },
  entrada: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: cores.linha,
    borderRadius: 12,
    paddingHorizontal: espaco.m,
    paddingVertical: espaco.p,
    fontSize: 17,
    color: cores.texto,
    backgroundColor: cores.fundo,
  },
  multilinha: { minHeight: 96, textAlignVertical: 'top' },
  entradaComErro: { borderColor: cores.critico },
  erro: { fontSize: 14, color: cores.critico },
  ajuda: { fontSize: 13, color: cores.textoSuave },
});
