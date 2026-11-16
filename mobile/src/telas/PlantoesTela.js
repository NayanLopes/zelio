import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import Botao from '../componentes/Botao';
import CartaoDePlantao from '../componentes/CartaoDePlantao';
import { Carregando, Falha, Vazio } from '../componentes/EstadoDaLista';
import FiltroDeStatus from '../componentes/FiltroDeStatus';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import { useConsulta } from '../hooks/useConsulta';
import * as plantoesRepositorio from '../repositorios/plantoesRepositorio';
import { observarMudancas } from '../servicos/avisosDePlantao';
import { espaco } from '../tema';
import { confirmar } from '../util/confirmar';
import { ROTULO_DO_STATUS } from '../util/formatos';
import { mensagemDoErro } from '../util/validacao';

const MUDANCAS = {
  aceito: { titulo: 'Aceitar', sucesso: 'Plantão aceito. A família foi avisada.', variante: 'primario' },
  recusado: {
    titulo: 'Recusar', sucesso: 'Solicitação recusada.', variante: 'perigo',
    confirmacao: { titulo: 'Recusar a solicitação?', texto: 'A família será avisada e terá de procurar outro cuidador.', acao: 'Recusar' },
  },
  concluido: {
    titulo: 'Marcar como concluído', sucesso: 'Plantão concluído. Já é possível avaliar.', variante: 'primario',
    confirmacao: { titulo: 'Concluir o plantão?', texto: 'Depois de concluído, o plantão não muda mais de estado.', acao: 'Concluir' },
  },
  cancelado: {
    titulo: 'Cancelar', sucesso: 'Plantão cancelado.', variante: 'perigo',
    confirmacao: { titulo: 'Cancelar o plantão?', texto: 'O outro lado será avisado. Esta ação não pode ser desfeita.', acao: 'Cancelar plantão' },
  },
};

const ENCERRADOS_SEM_CONCLUSAO = ['recusado', 'cancelado'];

export default function PlantoesTela({ navigation, route }) {
  const { usuario } = useSessao();
  const lado = usuario.papel;
  const aviso = useAviso();
  const { ocupadoCom, ocupado, executar } = useAcao();
  const [status, setStatus] = useState(lado === 'cuidador' ? 'solicitado' : null);

  const consulta = useConsulta(useCallback(() => plantoesRepositorio.listar(status), [status]));
  const { recarregar } = consulta;

  useEffect(() => observarMudancas(usuario, recarregar), [usuario, recarregar]);

  async function mudar(plantao, novo) {
    const mudanca = MUDANCAS[novo];
    if (mudanca.confirmacao && !(await confirmar({ ...mudanca.confirmacao, destrutiva: mudanca.variante === 'perigo' }))) return;
    await executar(`${novo}-${plantao.id}`, async () => {
      try {
        await plantoesRepositorio.mudarStatus(plantao.id, novo);
        aviso.sucesso(mudanca.sucesso);
      } catch (erro) {
        aviso.erro(mensagemDoErro(erro));
      }
      await recarregar();
    });
  }

  async function excluir(plantao) {
    const confirmado = await confirmar({
      titulo: 'Excluir o plantão?',
      texto: 'O registro sai da sua lista e da lista do outro lado.',
      acao: 'Excluir',
      destrutiva: true,
    });
    if (!confirmado) return;
    await executar(`excluir-${plantao.id}`, async () => {
      try {
        await plantoesRepositorio.remover(plantao);
        aviso.sucesso('Plantão excluído.');
      } catch (erro) {
        aviso.erro(mensagemDoErro(erro));
      }
      await recarregar();
    });
  }

  function acoesDe(plantao) {
    const permitidas = plantao.proximos_status.filter((novo) =>
      lado === 'cuidador' || (novo !== 'aceito' && novo !== 'recusado'));
    const jaAvaliou = plantao.avaliacoes.some((a) => a.autor === lado);
    const nomeDoOutro = lado === 'familia' ? plantao.cuidador.nome : plantao.familia?.responsavel ?? 'Família';
    return (
      <>
        {permitidas.map((novo) => (
          <Botao
            key={novo}
            compacto
            titulo={MUDANCAS[novo].titulo}
            variante={MUDANCAS[novo].variante}
            carregando={ocupadoCom === `${novo}-${plantao.id}`}
            desabilitado={ocupado}
            aoPressionar={() => mudar(plantao, novo)}
          />
        ))}
        {lado === 'cuidador' && plantao.status === 'aceito' ? (
          <Botao
            compacto
            variante="secundario"
            titulo="Avisar atraso"
            desabilitado={ocupado}
            aoPressionar={() => navigation.navigate('AvisarAtraso', { plantao })}
          />
        ) : null}
        {plantao.status === 'concluido' && !jaAvaliou ? (
          <Botao
            compacto
            titulo={lado === 'familia' ? 'Avaliar cuidador' : 'Avaliar família'}
            desabilitado={ocupado}
            aoPressionar={() => navigation.navigate('Avaliar', { plantaoId: plantao.id, nomeDoOutro })}
          />
        ) : null}
        {plantao.familia ? (
          <Botao
            compacto
            variante="discreto"
            titulo="Conversar"
            desabilitado={ocupado}
            aoPressionar={() => navigation.navigate('Conversa', {
              cuidadorId: plantao.cuidador.id, familiaId: plantao.familia.id, nomeDoOutro,
            })}
          />
        ) : null}
        {ENCERRADOS_SEM_CONCLUSAO.includes(plantao.status) ? (
          <Botao
            compacto
            variante="perigo"
            titulo="Excluir"
            carregando={ocupadoCom === `excluir-${plantao.id}`}
            desabilitado={ocupado}
            aoPressionar={() => excluir(plantao)}
          />
        ) : null}
      </>
    );
  }

  const textoVazio = status === null
    ? (lado === 'familia' ? 'Você ainda não solicitou nenhum plantão.' : 'Você ainda não recebeu solicitações.')
    : `Nenhum plantão no estado "${ROTULO_DO_STATUS[status]}".`;

  let corpo;
  if (consulta.carregando) corpo = <Carregando texto="Carregando plantões..." />;
  else if (!consulta.dados) corpo = <Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} />;
  else {
    corpo = (
      <FlatList
        data={consulta.dados}
        keyExtractor={(plantao) => String(plantao.id)}
        contentContainerStyle={estilos.lista}
        refreshControl={<RefreshControl refreshing={consulta.atualizando} onRefresh={recarregar} />}
        ListHeaderComponent={consulta.erro ? <Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /> : null}
        renderItem={({ item }) => <CartaoDePlantao plantao={item} lado={lado}>{acoesDe(item)}</CartaoDePlantao>}
        ListEmptyComponent={consulta.erro ? null : (
          <Vazio
            titulo="Nada por aqui"
            texto={textoVazio}
            acao={lado === 'familia' && status === null ? 'Encontrar cuidador' : undefined}
            aoAgir={() => navigation.reset({ index: 0, routes: [{ name: 'EncontrarCuidador' }] })}
          />
        )}
      />
    );
  }

  return (
    <Tela secao={route.name}>
      <FiltroDeStatus status={status} aoMudar={setStatus} />
      {corpo}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  lista: { padding: espaco.g, gap: espaco.m, flexGrow: 1 },
});
