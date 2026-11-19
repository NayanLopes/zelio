import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import { Carregando, Falha, Vazio } from '../componentes/EstadoDaLista';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import { useConsulta } from '../hooks/useConsulta';
import * as familiasRepositorio from '../repositorios/familiasRepositorio';
import { base, cores, espaco } from '../tema';
import { confirmar } from '../util/confirmar';
import { mensagemDoErro } from '../util/validacao';

export default function IdososTela({ navigation }) {
  const { usuario } = useSessao();
  const aviso = useAviso();
  const { ocupadoCom, ocupado, executar } = useAcao();
  const consulta = useConsulta(
    useCallback(() => familiasRepositorio.idosos(usuario.familia_id), [usuario.familia_id]),
  );

  async function excluir(idoso) {
    const confirmado = await confirmar({
      titulo: `Excluir ${idoso.nome}?`,
      texto: 'O cadastro desta pessoa será apagado.',
      acao: 'Excluir',
      destrutiva: true,
    });
    if (!confirmado) return;
    await executar(`excluir-${idoso.id}`, async () => {
      try {
        await familiasRepositorio.removerIdoso(usuario.familia_id, idoso.id);
        aviso.sucesso(`${idoso.nome} saiu do cadastro.`);
      } catch (erro) {
        aviso.erro(mensagemDoErro(erro));
      }
      await consulta.recarregar();
    });
  }

  let corpo;
  if (consulta.carregando) corpo = <Carregando />;
  else if (!consulta.dados) corpo = <Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} />;
  else {
    corpo = (
      <FlatList
        data={consulta.dados}
        keyExtractor={(idoso) => String(idoso.id)}
        contentContainerStyle={estilos.lista}
        refreshControl={<RefreshControl refreshing={consulta.atualizando} onRefresh={consulta.recarregar} />}
        ListHeaderComponent={consulta.erro ? <Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /> : null}
        renderItem={({ item }) => (
          <View style={base.cartao}>
            <Text style={base.subtitulo}>{item.nome}</Text>
            <Text style={base.texto}>{item.idade} anos</Text>
            {item.condicao ? <Text style={base.textoSecundario}>{item.condicao}</Text> : null}
            <View style={[base.linhaQuebravel, { marginTop: espaco.p }]}>
              <Botao
                compacto
                variante="secundario"
                titulo="Editar"
                desabilitado={ocupado}
                aoPressionar={() => navigation.navigate('FormularioDeIdoso', { idoso: item })}
              />
              <Botao
                compacto
                variante="perigo"
                titulo="Excluir"
                carregando={ocupadoCom === `excluir-${item.id}`}
                desabilitado={ocupado}
                aoPressionar={() => excluir(item)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={consulta.erro ? null : (
          <Vazio
            titulo="Ninguém cadastrado"
            texto="Cadastre a pessoa que vai receber o cuidado para poder solicitar um plantão."
          />
        )}
      />
    );
  }

  return (
    <Tela secao="Idosos">
      {corpo}
      <View style={estilos.rodape}>
        <Botao titulo="Cadastrar pessoa" aoPressionar={() => navigation.navigate('FormularioDeIdoso', {})} />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: { padding: espaco.g, gap: espaco.m, flexGrow: 1 },
  rodape: { padding: espaco.g, borderTopWidth: 1, borderTopColor: cores.linha },
});
