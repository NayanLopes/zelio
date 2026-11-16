import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Botao from '../componentes/Botao';
import { Carregando, Vazio } from '../componentes/EstadoDaLista';
import Faixa from '../componentes/Faixa';
import Mensagem from '../componentes/Mensagem';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import * as conversasRepositorio from '../repositorios/conversasRepositorio';
import { observarConexao } from '../servicos/mqttServico';
import { cores, espaco } from '../tema';

export default function ConversaTela({ route }) {
  const { cuidadorId, familiaId, nomeDoOutro } = route.params;
  const { usuario } = useSessao();
  const aviso = useAviso();
  const margens = useSafeAreaInsets();
  const { ocupado, executar } = useAcao();
  const [mensagens, setMensagens] = useState(null);
  const [texto, setTexto] = useState('');
  const [conectado, setConectado] = useState(false);
  const lista = useRef(null);

  useEffect(() => {
    let ativo = true;
    const par = { cuidadorId, familiaId };
    const ler = () => conversasRepositorio.mensagens(usuario, par).then((guardadas) => {
      if (!ativo) return;
      setMensagens(guardadas);
      conversasRepositorio.marcarComoLida(usuario, par);
    });
    ler();
    const parar = conversasRepositorio.observar((mudou) => {
      if (mudou.cuidadorId === cuidadorId && mudou.familiaId === familiaId) ler();
    });
    return () => {
      ativo = false;
      parar();
    };
  }, [usuario, cuidadorId, familiaId]);

  useEffect(() => observarConexao(setConectado), []);

  async function enviar() {
    const limpo = texto.trim();
    if (limpo === '') return;
    await executar('enviar', async () => {
      const enviada = await conversasRepositorio.enviar(usuario, { cuidadorId, familiaId }, limpo, nomeDoOutro);
      if (!enviada) {
        aviso.erro('Mensagem não enviada. Sem conexão com o servidor de mensagens.');
        return;
      }
      setTexto('');
    });
  }

  if (mensagens === null) return <Tela><Carregando /></Tela>;

  return (
    <Tela>
      {conectado ? null : (
        <View style={estilos.faixa}>
          <Faixa tipo="alerta" texto="Conectando ao servidor de mensagens. O envio fica disponível em instantes." />
        </View>
      )}
      <FlatList
        ref={lista}
        data={mensagens}
        keyExtractor={(mensagem) => mensagem.id}
        renderItem={({ item }) => <Mensagem mensagem={item} minha={item.de === usuario.papel} />}
        contentContainerStyle={estilos.lista}
        onContentSizeChange={() => lista.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={(
          <Vazio
            titulo="Nenhuma mensagem ainda"
            texto={`Escreva para ${nomeDoOutro} e combine os detalhes antes do plantão. As mensagens chegam quando os dois estão com o aplicativo aberto.`}
          />
        )}
      />
      <View style={[estilos.rodape, { paddingBottom: Math.max(margens.bottom, espaco.p) }]}>
        <TextInput
          style={estilos.entrada}
          placeholder="Digite uma mensagem"
          placeholderTextColor={cores.textoSuave}
          accessibilityLabel="Mensagem"
          value={texto}
          onChangeText={setTexto}
          maxLength={1000}
          multiline
        />
        <Botao
          titulo="Enviar"
          compacto
          aoPressionar={enviar}
          carregando={ocupado}
          desabilitado={!conectado || texto.trim() === ''}
        />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  faixa: { padding: espaco.m },
  lista: { flexGrow: 1, paddingVertical: espaco.p },
  rodape: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: espaco.p,
    paddingHorizontal: espaco.m,
    paddingTop: espaco.p,
    borderTopWidth: 1,
    borderTopColor: cores.linha,
  },
  entrada: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: cores.linha,
    borderRadius: 12,
    paddingHorizontal: espaco.m,
    paddingVertical: espaco.p,
    fontSize: 16,
    color: cores.texto,
  },
});
