import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import Campo from '../componentes/Campo';
import { Carregando, Falha } from '../componentes/EstadoDaLista';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import { useConsulta } from '../hooks/useConsulta';
import { API_URL } from '../config';
import * as familiasRepositorio from '../repositorios/familiasRepositorio';
import { observarConexao } from '../servicos/mqttServico';
import { base } from '../tema';
import { errosDoServidor, mensagemDoErro, regra, semErros, semOCampo, validar } from '../util/validacao';

const ROTULO_DO_PAPEL = { familia: 'Família', cuidador: 'Cuidador', admin: 'Administração' };

const ESQUEMA = {
  responsavel: [regra.obrigatorio, regra.tamanhoMaximo(120)],
  telefone: [regra.obrigatorio, regra.telefone, regra.tamanhoMaximo(20)],
  cidade: [regra.obrigatorio, regra.tamanhoMaximo(80)],
  bairro: [regra.obrigatorio, regra.tamanhoMaximo(80)],
};

function DadosDaFamilia() {
  const { usuario } = useSessao();
  const consulta = useConsulta(
    useCallback(() => familiasRepositorio.porId(usuario.familia_id), [usuario.familia_id]),
  );
  if (consulta.carregando) return <Carregando />;
  if (!consulta.dados) return <Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} />;
  return <FormularioDaFamilia familia={consulta.dados} />;
}

function FormularioDaFamilia({ familia }) {
  const { usuario, renomear } = useSessao();
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const [valores, setValores] = useState({
    responsavel: familia.responsavel, telefone: familia.telefone, cidade: familia.cidade, bairro: familia.bairro,
  });
  const [erros, setErros] = useState({});

  const mudar = (campo) => (texto) => {
    setValores((atuais) => ({ ...atuais, [campo]: texto }));
    setErros((atuais) => semOCampo(atuais, campo));
  };

  async function salvar() {
    const encontrados = validar(valores, ESQUEMA);
    setErros(encontrados);
    if (!semErros(encontrados)) return;
    await executar('salvar', async () => {
      try {
        const atualizada = await familiasRepositorio.atualizar(usuario.familia_id, {
          responsavel: valores.responsavel.trim(),
          telefone: valores.telefone.trim(),
          cidade: valores.cidade.trim(),
          bairro: valores.bairro.trim(),
        });
        renomear(atualizada.responsavel);
        aviso.sucesso('Dados atualizados.');
      } catch (erro) {
        if (erro.tipo === 'validacao' && erro.detalhes) setErros(errosDoServidor(erro.detalhes));
        aviso.erro(mensagemDoErro(erro));
      }
    });
  }

  return (
    <>
      <Text style={base.subtitulo}>Seus dados</Text>
      <Campo rotulo="Nome completo" value={valores.responsavel} onChangeText={mudar('responsavel')}
        erro={erros.responsavel} editable={!ocupado} />
      <Campo rotulo="Telefone com DDD" value={valores.telefone} onChangeText={mudar('telefone')}
        erro={erros.telefone} keyboardType="phone-pad" editable={!ocupado} />
      <Campo rotulo="Cidade" value={valores.cidade} onChangeText={mudar('cidade')} erro={erros.cidade}
        editable={!ocupado} />
      <Campo rotulo="Bairro" value={valores.bairro} onChangeText={mudar('bairro')} erro={erros.bairro}
        editable={!ocupado} />
      <Botao titulo="Salvar alterações" aoPressionar={salvar} carregando={ocupado} />
    </>
  );
}

export default function ContaTela() {
  const { usuario, sair } = useSessao();
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const [mensagensConectadas, setMensagensConectadas] = useState(false);

  useEffect(() => observarConexao(setMensagensConectadas), []);

  async function encerrar() {
    await executar('sair', async () => {
      try {
        await sair();
      } catch (erro) {
        aviso.erro(mensagemDoErro(erro));
      }
    });
  }

  return (
    <Tela secao="Conta" rolavel>
      <View style={base.cartao}>
        <Text style={base.subtitulo}>{usuario.nome}</Text>
        <Text style={base.textoSecundario}>{usuario.email}</Text>
        <Text style={base.textoSecundario}>Perfil: {ROTULO_DO_PAPEL[usuario.papel]}</Text>
      </View>
      {usuario.papel === 'familia' ? <DadosDaFamilia /> : null}
      <View style={base.cartao}>
        <Text style={base.textoSuave}>Servidor: {API_URL}</Text>
        <Text style={base.textoSuave}>
          Mensagens em tempo real: {mensagensConectadas ? 'conectado' : 'sem conexão'}
        </Text>
      </View>
      <Botao titulo="Sair da conta" variante="perigo" aoPressionar={encerrar} carregando={ocupado} />
    </Tela>
  );
}
