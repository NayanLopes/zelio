import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { cores, espaco } from '../tema';

const VARIANTES = {
  primario: { fundo: cores.marca, texto: cores.sobreMarca, borda: cores.marca },
  secundario: { fundo: cores.fundo, texto: cores.marcaEscura, borda: cores.marca },
  perigo: { fundo: cores.fundo, texto: cores.critico, borda: cores.critico },
  discreto: { fundo: cores.preenchimento, texto: cores.texto, borda: cores.linha },
};

export default function Botao({
  titulo, aoPressionar, variante = 'primario', carregando = false, desabilitado = false, compacto = false, estilo,
}) {
  const aparencia = VARIANTES[variante];
  const inativo = desabilitado || carregando;
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        estilos.botao,
        compacto && estilos.compacto,
        { backgroundColor: aparencia.fundo, borderColor: aparencia.borda },
        inativo && estilos.inativo,
        pressed && estilos.pressionado,
        estilo,
      ]}
    >
      {carregando
        ? <ActivityIndicator color={aparencia.texto} />
        : <Text style={[estilos.texto, compacto && estilos.textoCompacto, { color: aparencia.texto }]}>{titulo}</Text>}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: espaco.g,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compacto: { minHeight: 44, paddingHorizontal: espaco.m },
  texto: { fontSize: 17, fontWeight: '700' },
  textoCompacto: { fontSize: 15 },
  inativo: { opacity: 0.5 },
  pressionado: { opacity: 0.8 },
});
