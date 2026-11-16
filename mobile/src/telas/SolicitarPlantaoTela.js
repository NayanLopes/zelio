import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import Campo from '../componentes/Campo';
import { Carregando, Falha } from '../componentes/EstadoDaLista';
import Etiqueta from '../componentes/Etiqueta';
import Faixa from '../componentes/Faixa';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import { useConsulta } from '../hooks/useConsulta';
import * as cuidadoresRepositorio from '../repositorios/cuidadoresRepositorio';
import * as familiasRepositorio from '../repositorios/familiasRepositorio';
import * as plantoesRepositorio from '../repositorios/plantoesRepositorio';
import { base, cores } from '../tema';
import {
  ROTULO_DA_MODALIDADE, dataParaIso, estimarValor, hojeEmIso, mascararData, mascararHora, moeda,
} from '../util/formatos';
import { errosDoServidor, mensagemDoErro, regra, semErros, semOCampo, validar } from '../util/validacao';

const MODALIDADES = ['diaria', 'horista', 'mensal'];

const NOMES_DOS_CAMPOS = {
  data_inicio: 'dataInicio', data_fim: 'dataFim', hora_inicio: 'horaInicio', hora_fim: 'horaFim',
  idoso_id: 'idoso',
};

export default function SolicitarPlantaoTela({ navigation, route }) {
  const { cuidadorId } = route.params;
  const { usuario } = useSessao();
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const [idosoId, setIdosoId] = useState(null);
  const [modalidade, setModalidade] = useState('diaria');
  const [valores, setValores] = useState({ dataInicio: '', dataFim: '', horaInicio: '07:00', horaFim: '19:00' });
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState(null);

  const consulta = useConsulta(useCallback(async () => {
    const [cuidador, idosos] = await Promise.all([
      cuidadoresRepositorio.porId(cuidadorId),
      familiasRepositorio.idosos(usuario.familia_id),
    ]);
    return { cuidador, idosos };
  }, [cuidadorId, usuario.familia_id]));

  const mudar = (campo, mascara) => (texto) => {
    setValores((atuais) => ({ ...atuais, [campo]: mascara(texto) }));
    setErros((atuais) => semOCampo(atuais, campo));
  };

  if (consulta.carregando) return <Tela><Carregando /></Tela>;
  if (!consulta.dados) return <Tela><Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /></Tela>;

  const { cuidador, idosos } = consulta.dados;
  const idosoEscolhido = idosos.some((i) => i.id === idosoId) ? idosoId : (idosos.length === 1 ? idosos[0].id : null);
  const inicioIso = dataParaIso(valores.dataInicio);
  const fimIso = dataParaIso(valores.dataFim);
  const estimativa = estimarValor(cuidador, modalidade, inicioIso, fimIso, valores.horaInicio, valores.horaFim);

  async function enviar() {
    const encontrados = validar(valores, {
      dataInicio: [regra.obrigatorio, regra.data],
      dataFim: [regra.obrigatorio, regra.data],
      horaInicio: [regra.obrigatorio, regra.hora],
      horaFim: [regra.obrigatorio, regra.hora],
    });
    if (!idosoEscolhido) encontrados.idoso = 'Escolha quem vai receber o cuidado.';
    if (inicioIso && inicioIso < hojeEmIso()) encontrados.dataInicio = 'A data inicial já passou.';
    if (inicioIso && fimIso && fimIso < inicioIso) encontrados.dataFim = 'A data final vem antes da inicial.';
    if (!encontrados.horaInicio && !encontrados.horaFim && valores.horaFim <= valores.horaInicio) {
      encontrados.horaFim = 'A hora final precisa ser depois da inicial.';
    }
    setErros(encontrados);
    setFalha(null);
    if (!semErros(encontrados)) return;

    await executar('solicitar', async () => {
      try {
        const plantao = await plantoesRepositorio.solicitar({
          cuidador_id: cuidador.id,
          idoso_id: idosoEscolhido,
          modalidade,
          data_inicio: inicioIso,
          data_fim: fimIso,
          hora_inicio: valores.horaInicio,
          hora_fim: valores.horaFim,
        });
        aviso.sucesso(`Solicitação enviada. Total: ${moeda(plantao.valor_total)}. Aguarde a resposta do cuidador.`);
        navigation.reset({ index: 0, routes: [{ name: 'MeusPlantoes' }] });
      } catch (erro) {
        if (erro.tipo === 'validacao' && erro.detalhes) setErros(errosDoServidor(erro.detalhes, NOMES_DOS_CAMPOS));
        setFalha(mensagemDoErro(erro));
      }
    });
  }

  return (
    <Tela rolavel>
      <Text style={base.subtitulo}>Plantão com {cuidador.nome}</Text>
      {falha ? <Faixa tipo="erro" texto={falha} /> : null}

      <Text style={base.texto}>Quem vai receber o cuidado</Text>
      {idosos.length === 0 ? (
        <Faixa tipo="alerta" texto="Você ainda não cadastrou ninguém. Cadastre a pessoa antes de solicitar." />
      ) : (
        <View style={base.linhaQuebravel}>
          {idosos.map((idoso) => (
            <Etiqueta
              key={idoso.id}
              texto={`${idoso.nome}, ${idoso.idade}`}
              selecionada={idosoEscolhido === idoso.id}
              desabilitada={ocupado}
              aoPressionar={() => {
                setIdosoId(idoso.id);
                setErros((atuais) => semOCampo(atuais, 'idoso'));
              }}
            />
          ))}
        </View>
      )}
      {erros.idoso ? <Text style={{ fontSize: 14, color: cores.critico }}>{erros.idoso}</Text> : null}
      <Botao
        titulo="Cadastrar outra pessoa"
        variante="discreto"
        compacto
        desabilitado={ocupado}
        aoPressionar={() => navigation.navigate('FormularioDeIdoso', {})}
      />

      <Text style={base.texto}>Modalidade</Text>
      <View style={base.linhaQuebravel}>
        {MODALIDADES.map((opcao) => (
          <Etiqueta
            key={opcao}
            texto={ROTULO_DA_MODALIDADE[opcao]}
            selecionada={modalidade === opcao}
            desabilitada={ocupado}
            aoPressionar={() => setModalidade(opcao)}
          />
        ))}
      </View>

      <Campo rotulo="Data de início" placeholder="DD/MM/AAAA" value={valores.dataInicio}
        onChangeText={mudar('dataInicio', mascararData)} erro={erros.dataInicio} keyboardType="number-pad"
        editable={!ocupado} />
      <Campo rotulo="Data de término" placeholder="DD/MM/AAAA" value={valores.dataFim}
        onChangeText={mudar('dataFim', mascararData)} erro={erros.dataFim} keyboardType="number-pad"
        editable={!ocupado} />
      <Campo rotulo="Hora de início" placeholder="HH:MM" value={valores.horaInicio}
        onChangeText={mudar('horaInicio', mascararHora)} erro={erros.horaInicio} keyboardType="number-pad"
        editable={!ocupado} />
      <Campo rotulo="Hora de término" placeholder="HH:MM" value={valores.horaFim}
        onChangeText={mudar('horaFim', mascararHora)} erro={erros.horaFim} keyboardType="number-pad"
        editable={!ocupado} />

      <View style={base.cartao}>
        <View style={base.entre}>
          <Text style={base.texto}>Total estimado</Text>
          <Text style={base.subtitulo}>{estimativa === null ? 'R$ --' : moeda(estimativa)}</Text>
        </View>
        <Text style={base.textoSuave}>O valor definitivo é calculado pelo servidor e aparece na confirmação.</Text>
      </View>

      <Botao titulo="Enviar solicitação" aoPressionar={enviar} carregando={ocupado} />
    </Tela>
  );
}
