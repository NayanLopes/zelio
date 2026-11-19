import { ScrollView, StyleSheet, View } from 'react-native';
import Etiqueta from './Etiqueta';
import { cores, espaco } from '../tema';
import { ROTULO_DO_STATUS } from '../util/formatos';

const OPCOES = [null, 'solicitado', 'aceito', 'concluido', 'recusado', 'cancelado'];

export default function FiltroDeStatus({ status, aoMudar }) {
  return (
    <View style={estilos.moldura}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.faixa}>
        {OPCOES.map((opcao) => (
          <Etiqueta
            key={opcao ?? 'todos'}
            texto={opcao === null ? 'Todos' : ROTULO_DO_STATUS[opcao]}
            selecionada={status === opcao}
            aoPressionar={() => aoMudar(opcao)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  moldura: { borderBottomWidth: 1, borderBottomColor: cores.linha },
  faixa: { paddingHorizontal: espaco.g, paddingVertical: espaco.m, gap: espaco.p },
});
