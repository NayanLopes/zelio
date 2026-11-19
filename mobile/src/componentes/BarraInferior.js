import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores, espaco } from '../tema';

const SECOES = {
  familia: [
    { rota: 'EncontrarCuidador', rotulo: 'Buscar' },
    { rota: 'MeusPlantoes', rotulo: 'Plantões' },
    { rota: 'Idosos', rotulo: 'Família' },
    { rota: 'Conversas', rotulo: 'Conversas' },
    { rota: 'Conta', rotulo: 'Conta' },
  ],
  cuidador: [
    { rota: 'PlantoesDoCuidador', rotulo: 'Plantões' },
    { rota: 'MeuCadastro', rotulo: 'Cadastro' },
    { rota: 'Conversas', rotulo: 'Conversas' },
    { rota: 'Conta', rotulo: 'Conta' },
  ],
  admin: [
    { rota: 'CadastrosDeCuidadores', rotulo: 'Cadastros' },
    { rota: 'Conta', rotulo: 'Conta' },
  ],
};

export default function BarraInferior({ papel, atual }) {
  const navegacao = useNavigation();
  const margens = useSafeAreaInsets();
  return (
    <View style={[estilos.barra, { paddingBottom: Math.max(margens.bottom, espaco.p) }]}>
      {SECOES[papel].map((secao) => {
        const ativa = secao.rota === atual;
        return (
          <Pressable
            key={secao.rota}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            onPress={() => {
              if (!ativa) navegacao.reset({ index: 0, routes: [{ name: secao.rota }] });
            }}
            style={estilos.item}
          >
            <View style={[estilos.marcador, ativa && estilos.marcadorAtivo]} />
            <Text style={[estilos.rotulo, ativa && estilos.rotuloAtivo]} numberOfLines={1}>{secao.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: cores.linha,
    backgroundColor: cores.fundo,
  },
  item: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: espaco.pp },
  marcador: { width: 28, height: 3, borderRadius: 2, backgroundColor: 'transparent' },
  marcadorAtivo: { backgroundColor: cores.marca },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.textoSuave },
  rotuloAtivo: { color: cores.marcaEscura },
});
