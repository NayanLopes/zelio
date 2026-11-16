import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import { Carregando, Falha, Vazio } from '../componentes/EstadoDaLista';
import Etiqueta from '../componentes/Etiqueta';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useAcao } from '../hooks/useAcao';
import { useConsulta } from '../hooks/useConsulta';
import * as cuidadoresRepositorio from '../repositorios/cuidadoresRepositorio';
import { base, cores, espaco } from '../tema';
import { confirmar } from '../util/confirmar';
import { ROTULO_DA_VERIFICACAO } from '../util/formatos';
import { mensagemDoErro } from '../util/validacao';

const FILTROS = [
  { valor: 'pendente', rotulo: 'Em análise' },
  { valor: 'aprovado', rotulo: 'Aprovados' },
  { valor: 'reprovado', rotulo: 'Reprovados' },
];

export default function CadastrosDeCuidadoresTela() {
  const aviso = useAviso();
  const { ocupadoCom, ocupado, executar } = useAcao();
  const [filtro, setFiltro] = useState('pendente');
  const consulta = useConsulta(useCallback(() => cuidadoresRepositorio.todosOsCadastros(), []));

  async function definir(cuidador, status) {
    await executar(`${status}-${cuidador.id}`, async () => {
      try {
        await cuidadoresRepositorio.definirVerificacao(cuidador.id, status);
        aviso.sucesso(status === 'aprovado'
          ? `${cuidador.nome} agora aparece na busca.`
          : `Cadastro de ${cuidador.nome} reprovado.`);
      } catch (erro) {
        aviso.erro(mensagemDoErro(erro));
      }
      await consulta.recarregar();
    });
  }

  async function excluir(cuidador) {
    const confirmado = await confirmar({
      titulo: `Excluir ${cuidador.nome}?`,
      texto: 'O cadastro e os documentos deste cuidador serão apagados.',
      acao: 'Excluir',
      destrutiva: true,
    });
    if (!confirmado) return;
    await executar(`excluir-${cuidador.id}`, async () => {
      try {
        await cuidadoresRepositorio.remover(cuidador.id);
        aviso.sucesso('Cadastro excluído.');
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
        data={consulta.dados.filter((c) => c.status_verificacao === filtro)}
        keyExtractor={(cuidador) => String(cuidador.id)}
        contentContainerStyle={estilos.lista}
        refreshControl={<RefreshControl refreshing={consulta.atualizando} onRefresh={consulta.recarregar} />}
        ListHeaderComponent={consulta.erro ? <Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /> : null}
        renderItem={({ item }) => (
          <View style={base.cartao}>
            <Text style={base.subtitulo}>{item.nome}</Text>
            <Text style={base.textoSecundario}>{item.email} · {item.telefone}</Text>
            <Text style={base.textoSecundario}>
              {item.bairro}, {item.cidade} · {item.anos_experiencia} anos de experiência
            </Text>
            <View style={base.linhaQuebravel}>
              {item.especialidades.map((e) => <Etiqueta key={e.id} texto={e.nome} />)}
            </View>
            <Text style={base.textoSuave}>Situação: {ROTULO_DA_VERIFICACAO[item.status_verificacao]}</Text>
            <View style={[base.linhaQuebravel, { marginTop: espaco.p }]}>
              {item.status_verificacao !== 'aprovado' ? (
                <Botao compacto titulo="Aprovar" carregando={ocupadoCom === `aprovado-${item.id}`}
                  desabilitado={ocupado} aoPressionar={() => definir(item, 'aprovado')} />
              ) : null}
              {item.status_verificacao !== 'reprovado' ? (
                <Botao compacto variante="secundario" titulo="Reprovar"
                  carregando={ocupadoCom === `reprovado-${item.id}`} desabilitado={ocupado}
                  aoPressionar={() => definir(item, 'reprovado')} />
              ) : null}
              <Botao compacto variante="perigo" titulo="Excluir" carregando={ocupadoCom === `excluir-${item.id}`}
                desabilitado={ocupado} aoPressionar={() => excluir(item)} />
            </View>
          </View>
        )}
        ListEmptyComponent={consulta.erro ? null : (
          <Vazio titulo="Nenhum cadastro" texto="Não há cuidadores nesta situação." />
        )}
      />
    );
  }

  return (
    <Tela secao="CadastrosDeCuidadores">
      <View style={estilos.filtros}>
        {FILTROS.map((opcao) => (
          <Etiqueta key={opcao.valor} texto={opcao.rotulo} selecionada={filtro === opcao.valor}
            aoPressionar={() => setFiltro(opcao.valor)} />
        ))}
      </View>
      {corpo}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  filtros: {
    flexDirection: 'row', flexWrap: 'wrap', gap: espaco.p, padding: espaco.g,
    borderBottomWidth: 1, borderBottomColor: cores.linha,
  },
  lista: { padding: espaco.g, gap: espaco.m, flexGrow: 1 },
});
