import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Carregando, Vazio } from '../componentes/EstadoDaLista';
import Tela from '../componentes/Tela';
import { useSessao } from '../contexto/SessaoContexto';
import * as conversasRepositorio from '../repositorios/conversasRepositorio';
import { base, cores, espaco } from '../tema';
import { horaDaMensagem, isoParaData } from '../util/formatos';

export default function ConversasTela({ navigation }) {
  const { usuario } = useSessao();
  const [conversas, setConversas] = useState(null);

  const carregar = useCallback(async () => {
    setConversas(await conversasRepositorio.conversas(usuario));
  }, [usuario]);

  useFocusEffect(useCallback(() => {
    carregar();
  }, [carregar]));

  useEffect(() => conversasRepositorio.observar(() => carregar()), [carregar]);

  if (conversas === null) return <Tela secao="Conversas"><Carregando /></Tela>;

  return (
    <Tela secao="Conversas">
      <FlatList
        data={conversas}
        keyExtractor={(c) => `${c.cuidadorId}-${c.familiaId}`}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [base.cartao, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('Conversa', {
              cuidadorId: item.cuidadorId, familiaId: item.familiaId, nomeDoOutro: item.nomeDoOutro,
            })}
          >
            <View style={base.entre}>
              <Text style={[base.subtitulo, { flex: 1 }]} numberOfLines={1}>{item.nomeDoOutro}</Text>
              {item.naoLidas > 0 ? (
                <View style={estilos.contador}>
                  <Text style={estilos.textoDoContador}>{item.naoLidas}</Text>
                </View>
              ) : null}
            </View>
            <Text style={base.textoSecundario} numberOfLines={2}>{item.ultimaMensagem}</Text>
            <Text style={base.textoSuave}>
              {isoParaData(item.ultimaEm.slice(0, 10))} às {horaDaMensagem(item.ultimaEm)}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={(
          <Vazio
            titulo="Nenhuma conversa neste aparelho"
            texto={usuario.papel === 'familia'
              ? 'Abra o perfil de um cuidador e toque em "Conversar antes".'
              : 'Quando uma família escrever para você com o aplicativo aberto, a conversa aparece aqui.'}
          />
        )}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: { padding: espaco.g, gap: espaco.m, flexGrow: 1 },
  contador: {
    minWidth: 26, height: 26, borderRadius: 13, paddingHorizontal: 6,
    backgroundColor: cores.marca, alignItems: 'center', justifyContent: 'center',
  },
  textoDoContador: { color: cores.sobreMarca, fontWeight: '700', fontSize: 13 },
});
