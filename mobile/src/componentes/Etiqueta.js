import { Pressable, StyleSheet, Text } from 'react-native';
import { cores, espaco } from '../tema';

export default function Etiqueta({ texto, selecionada = false, aoPressionar, desabilitada = false }) {
  const interativa = typeof aoPressionar === 'function';
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={!interativa || desabilitada}
      accessibilityRole={interativa ? 'button' : 'text'}
      accessibilityState={interativa ? { selected: selecionada } : undefined}
      style={[
        estilos.etiqueta,
        interativa && estilos.interativa,
        selecionada && estilos.selecionada,
        desabilitada && estilos.desabilitada,
      ]}
    >
      <Text style={[estilos.texto, selecionada && estilos.textoSelecionado]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  etiqueta: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.preenchimento,
    paddingHorizontal: espaco.m,
    paddingVertical: espaco.pp,
    justifyContent: 'center',
  },
  interativa: { minHeight: 44, paddingVertical: espaco.p, backgroundColor: cores.fundo },
  selecionada: { backgroundColor: cores.marca, borderColor: cores.marca },
  desabilitada: { opacity: 0.5 },
  texto: { fontSize: 14, fontWeight: '600', color: cores.textoSecundario },
  textoSelecionado: { color: cores.sobreMarca },
});
