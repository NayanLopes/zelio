import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import CartaoDeCuidador from '../componentes/CartaoDeCuidador';
import { Carregando, Falha, Vazio } from '../componentes/EstadoDaLista';
import Etiqueta from '../componentes/Etiqueta';
import Tela from '../componentes/Tela';
import { useConsulta } from '../hooks/useConsulta';
import * as cuidadoresRepositorio from '../repositorios/cuidadoresRepositorio';
import { cores, espaco } from '../tema';

export default function EncontrarCuidadorTela({ navigation }) {
  const [filtro, setFiltro] = useState(null);

  useEffect(() => {
    let ativo = true;
    cuidadoresRepositorio.lerFiltro().then((guardado) => {
      if (ativo) setFiltro(guardado);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const buscar = useCallback(async () => {
    if (!filtro) return null;
    const [especialidades, cuidadores] = await Promise.all([
      cuidadoresRepositorio.especialidades(),
      cuidadoresRepositorio.buscar(filtro),
    ]);
    return { especialidades, cuidadores };
  }, [filtro]);

  const consulta = useConsulta(buscar);

  function aplicar(novo) {
    setFiltro(novo);
    cuidadoresRepositorio.salvarFiltro(novo).catch(() => {});
  }

  if (!filtro || !consulta.dados) {
    if (consulta.erro) return <Tela secao="EncontrarCuidador"><Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /></Tela>;
    return <Tela secao="EncontrarCuidador"><Carregando texto="Buscando cuidadores..." /></Tela>;
  }

  const filtrando = filtro.especialidade !== null || filtro.notaMinima;

  return (
    <Tela secao="EncontrarCuidador">
      <View style={estilos.filtros}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.faixaDeFiltros}>
          <Etiqueta
            texto="Todas"
            selecionada={filtro.especialidade === null}
            aoPressionar={() => aplicar({ ...filtro, especialidade: null })}
          />
          {consulta.dados.especialidades.map((e) => (
            <Etiqueta
              key={e.id}
              texto={e.nome}
              selecionada={filtro.especialidade === e.nome}
              aoPressionar={() => aplicar({ ...filtro, especialidade: e.nome })}
            />
          ))}
          <Etiqueta
            texto="★ Nota 4 ou mais"
            selecionada={filtro.notaMinima}
            aoPressionar={() => aplicar({ ...filtro, notaMinima: !filtro.notaMinima })}
          />
        </ScrollView>
      </View>
      {consulta.erro ? <Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /> : (
        <FlatList
          data={consulta.dados.cuidadores}
          keyExtractor={(cuidador) => String(cuidador.id)}
          contentContainerStyle={estilos.lista}
          refreshControl={<RefreshControl refreshing={consulta.atualizando} onRefresh={consulta.recarregar} />}
          renderItem={({ item }) => (
            <CartaoDeCuidador
              cuidador={item}
              aoPressionar={() => navigation.navigate('PerfilDoCuidador', { cuidadorId: item.id, nome: item.nome })}
            />
          )}
          ListEmptyComponent={(
            <Vazio
              titulo="Nenhum cuidador encontrado"
              texto={filtrando ? 'Nenhum cuidador verificado atende a esse filtro.' : 'Ainda não há cuidadores verificados.'}
              acao={filtrando ? 'Limpar filtro' : undefined}
              aoAgir={() => aplicar(cuidadoresRepositorio.filtroPadrao())}
            />
          )}
        />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  filtros: { borderBottomWidth: 1, borderBottomColor: cores.linha },
  faixaDeFiltros: { paddingHorizontal: espaco.g, paddingVertical: espaco.m, gap: espaco.p },
  lista: { padding: espaco.g, gap: espaco.m, flexGrow: 1 },
});
