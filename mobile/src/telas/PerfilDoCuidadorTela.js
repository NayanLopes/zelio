import { useCallback } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import { Carregando, Falha } from '../componentes/EstadoDaLista';
import { NotaFixa, NotaResumida } from '../componentes/Estrelas';
import Etiqueta from '../componentes/Etiqueta';
import Faixa from '../componentes/Faixa';
import Tela from '../componentes/Tela';
import { useSessao } from '../contexto/SessaoContexto';
import { useConsulta } from '../hooks/useConsulta';
import * as cuidadoresRepositorio from '../repositorios/cuidadoresRepositorio';
import { base } from '../tema';
import { isoParaData, moeda } from '../util/formatos';

export default function PerfilDoCuidadorTela({ navigation, route }) {
  const { cuidadorId } = route.params;
  const { usuario } = useSessao();

  const consulta = useConsulta(useCallback(async () => {
    const [cuidador, avaliacoes] = await Promise.all([
      cuidadoresRepositorio.porId(cuidadorId),
      cuidadoresRepositorio.avaliacoes(cuidadorId),
    ]);
    return { cuidador, avaliacoes };
  }, [cuidadorId]));

  if (consulta.carregando) return <Tela><Carregando /></Tela>;
  if (!consulta.dados) return <Tela><Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /></Tela>;

  const { cuidador, avaliacoes } = consulta.dados;

  return (
    <Tela
      rolavel
      controleDeAtualizacao={<RefreshControl refreshing={consulta.atualizando} onRefresh={consulta.recarregar} />}
    >
      {consulta.erro ? <Faixa tipo="erro" texto={consulta.erro.message} /> : null}
      <Text style={base.titulo}>{cuidador.nome}</Text>
      {cuidador.status_verificacao === 'aprovado'
        ? <Faixa tipo="sucesso" titulo="Cadastro verificado" texto="Antecedentes, certificados e referências conferidos pela administração." />
        : <Faixa tipo="alerta" titulo="Cadastro em análise" texto="Este cuidador ainda não pode receber solicitações." />}
      <Text style={base.textoSecundario}>
        {cuidador.bairro}, {cuidador.cidade} · {cuidador.anos_experiencia} anos de experiência
      </Text>
      <NotaResumida media={cuidador.nota_media} total={cuidador.total_avaliacoes} />
      <View style={base.linhaQuebravel}>
        {cuidador.especialidades.map((e) => <Etiqueta key={e.id} texto={e.nome} />)}
      </View>
      <View style={base.cartao}>
        <View style={base.entre}>
          <Text style={base.texto}>Diária</Text>
          <Text style={base.subtitulo}>{moeda(cuidador.valor_diaria)}</Text>
        </View>
        <View style={base.entre}>
          <Text style={base.texto}>Hora</Text>
          <Text style={base.subtitulo}>{moeda(cuidador.valor_hora)}</Text>
        </View>
      </View>
      {usuario.papel === 'familia' ? (
        <>
          <Botao
            titulo="Solicitar plantão"
            desabilitado={cuidador.status_verificacao !== 'aprovado'}
            aoPressionar={() => navigation.navigate('SolicitarPlantao', { cuidadorId: cuidador.id, nome: cuidador.nome })}
          />
          <Botao
            titulo="Conversar antes"
            variante="secundario"
            aoPressionar={() => navigation.navigate('Conversa', {
              cuidadorId: cuidador.id, familiaId: usuario.familia_id, nomeDoOutro: cuidador.nome,
            })}
          />
        </>
      ) : null}
      <Text style={base.subtitulo}>Avaliações de famílias</Text>
      {avaliacoes.length === 0
        ? <Text style={base.textoSecundario}>Este cuidador ainda não recebeu avaliações.</Text>
        : avaliacoes.map((avaliacao) => (
          <View key={avaliacao.id} style={base.cartao}>
            <View style={base.entre}>
              <Text style={[base.texto, { fontWeight: '700' }]}>{avaliacao.autor}</Text>
              <NotaFixa nota={avaliacao.nota} />
            </View>
            {avaliacao.comentario ? <Text style={base.textoSecundario}>{avaliacao.comentario}</Text> : null}
            <Text style={base.textoSuave}>{isoParaData(avaliacao.criado_em)}</Text>
          </View>
        ))}
    </Tela>
  );
}
