import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../tema';
import { horaDaMensagem } from '../util/formatos';

export default function Mensagem({ mensagem, minha }) {
  return (
    <View style={[estilos.linha, { justifyContent: minha ? 'flex-end' : 'flex-start' }]}>
      <View style={[estilos.bolha, minha ? estilos.minha : estilos.doOutro]}>
        <Text style={[estilos.texto, minha && estilos.textoMeu]}>{mensagem.texto}</Text>
        <Text style={[estilos.hora, minha && estilos.horaMinha]}>{horaDaMensagem(mensagem.enviada_em)}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { width: '100%', flexDirection: 'row', paddingHorizontal: espaco.m, paddingVertical: espaco.pp },
  bolha: { maxWidth: '78%', borderRadius: 16, paddingHorizontal: espaco.m, paddingVertical: espaco.p, gap: 2 },
  minha: { backgroundColor: cores.marca, borderBottomRightRadius: 4 },
  doOutro: { backgroundColor: cores.preenchimento, borderBottomLeftRadius: 4 },
  texto: { fontSize: 16, lineHeight: 22, color: cores.texto },
  textoMeu: { color: cores.sobreMarca },
  hora: { fontSize: 11, color: cores.textoSuave, alignSelf: 'flex-end' },
  horaMinha: { color: cores.marcaSuave },
});
