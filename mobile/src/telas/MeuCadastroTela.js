import { useCallback, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import Campo from '../componentes/Campo';
import { Carregando, Falha } from '../componentes/EstadoDaLista';
import Faixa from '../componentes/Faixa';
import SeletorDeEspecialidades from '../componentes/SeletorDeEspecialidades';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import { useConsulta } from '../hooks/useConsulta';
import * as cuidadoresRepositorio from '../repositorios/cuidadoresRepositorio';
import { base } from '../tema';
import {
  ROTULO_DA_VERIFICACAO, ROTULO_DO_DOCUMENTO, isoParaData, numeroDoTexto,
} from '../util/formatos';
import { errosDoServidor, mensagemDoErro, regra, semErros, semOCampo, validar } from '../util/validacao';

const FAIXA_DA_VERIFICACAO = {
  pendente: { tipo: 'alerta', titulo: 'Cadastro em análise', texto: 'Você ainda não aparece na busca. Envie os documentos e aguarde a conferência.' },
  aprovado: { tipo: 'sucesso', titulo: 'Cadastro aprovado', texto: 'Seu perfil está visível para as famílias.' },
  reprovado: { tipo: 'erro', titulo: 'Cadastro reprovado', texto: 'Seus documentos não foram aceitos. Envie novos documentos para outra análise.' },
};

const ESQUEMA = {
  telefone: [regra.obrigatorio, regra.telefone, regra.tamanhoMaximo(20)],
  cidade: [regra.obrigatorio, regra.tamanhoMaximo(80)],
  bairro: [regra.obrigatorio, regra.tamanhoMaximo(80)],
  anosDeExperiencia: [regra.obrigatorio, regra.inteiroEntre(0, 70)],
  valorDaDiaria: [regra.obrigatorio, regra.valorPositivo],
  valorDaHora: [regra.obrigatorio, regra.valorPositivo],
};

const NOMES_DOS_CAMPOS = {
  anos_experiencia: 'anosDeExperiencia', valor_diaria: 'valorDaDiaria', valor_hora: 'valorDaHora',
};

const TIPOS_DE_DOCUMENTO = ['identidade', 'antecedentes', 'certificado'];

const paraTexto = (numero) => String(numero).replace('.', ',');

export default function MeuCadastroTela() {
  const { usuario } = useSessao();
  const consulta = useConsulta(useCallback(async () => {
    const [cuidador, documentos, opcoes] = await Promise.all([
      cuidadoresRepositorio.porId(usuario.cuidador_id),
      cuidadoresRepositorio.documentos(usuario.cuidador_id),
      cuidadoresRepositorio.especialidades(),
    ]);
    return { cuidador, documentos, opcoes };
  }, [usuario.cuidador_id]));

  if (consulta.carregando) return <Tela secao="MeuCadastro"><Carregando /></Tela>;
  if (!consulta.dados) return <Tela secao="MeuCadastro"><Falha erro={consulta.erro} aoTentarDeNovo={consulta.tentarDeNovo} /></Tela>;
  return <Cadastro consulta={consulta} />;
}

function Cadastro({ consulta }) {
  const { usuario } = useSessao();
  const aviso = useAviso();
  const { ocupadoCom, ocupado, executar } = useAcao();
  const { cuidador, documentos, opcoes } = consulta.dados;
  const [valores, setValores] = useState({
    telefone: cuidador.telefone,
    cidade: cuidador.cidade,
    bairro: cuidador.bairro,
    anosDeExperiencia: String(cuidador.anos_experiencia),
    valorDaDiaria: paraTexto(cuidador.valor_diaria),
    valorDaHora: paraTexto(cuidador.valor_hora),
  });
  const [especialidades, setEspecialidades] = useState(cuidador.especialidades.map((e) => e.id));
  const [erros, setErros] = useState({});

  const mudar = (campo) => (texto) => {
    setValores((atuais) => ({ ...atuais, [campo]: texto }));
    setErros((atuais) => semOCampo(atuais, campo));
  };

  async function salvar() {
    const encontrados = validar(valores, ESQUEMA);
    if (especialidades.length === 0) encontrados.especialidades = 'Escolha pelo menos uma.';
    setErros(encontrados);
    if (!semErros(encontrados)) return;
    await executar('salvar', async () => {
      try {
        await cuidadoresRepositorio.atualizar(usuario.cuidador_id, {
          telefone: valores.telefone.trim(),
          cidade: valores.cidade.trim(),
          bairro: valores.bairro.trim(),
          anos_experiencia: Number(valores.anosDeExperiencia),
          valor_diaria: numeroDoTexto(valores.valorDaDiaria),
          valor_hora: numeroDoTexto(valores.valorDaHora),
          especialidades,
        });
        aviso.sucesso('Cadastro atualizado.');
        await consulta.recarregar();
      } catch (erro) {
        if (erro.tipo === 'validacao' && erro.detalhes) setErros(errosDoServidor(erro.detalhes, NOMES_DOS_CAMPOS));
        aviso.erro(mensagemDoErro(erro));
      }
    });
  }

  async function enviarDocumento(tipo) {
    await executar(`documento-${tipo}`, async () => {
      try {
        await cuidadoresRepositorio.enviarDocumento(usuario.cuidador_id, tipo);
        aviso.sucesso(`${ROTULO_DO_DOCUMENTO[tipo]} enviado para análise.`);
        await consulta.recarregar();
      } catch (erro) {
        aviso.erro(mensagemDoErro(erro));
      }
    });
  }

  const faixa = FAIXA_DA_VERIFICACAO[cuidador.status_verificacao] ?? FAIXA_DA_VERIFICACAO.pendente;

  return (
    <Tela
      secao="MeuCadastro"
      rolavel
      controleDeAtualizacao={<RefreshControl refreshing={consulta.atualizando} onRefresh={consulta.recarregar} />}
    >
      {consulta.erro ? <Faixa tipo="erro" texto={consulta.erro.message} /> : null}
      <Text style={base.titulo}>{cuidador.nome}</Text>
      <Faixa tipo={faixa.tipo} titulo={faixa.titulo} texto={faixa.texto} />

      <Text style={base.subtitulo}>Documentos</Text>
      {documentos.length === 0
        ? <Text style={base.textoSecundario}>Nenhum documento enviado ainda.</Text>
        : documentos.map((documento) => (
          <View key={documento.id} style={base.cartao}>
            <View style={base.entre}>
              <Text style={[base.texto, { flex: 1 }]}>{ROTULO_DO_DOCUMENTO[documento.tipo] ?? documento.tipo}</Text>
              <Text style={[base.textoSecundario, { fontWeight: '700' }]}>
                {ROTULO_DA_VERIFICACAO[documento.status] ?? documento.status}
              </Text>
            </View>
            <Text style={base.textoSuave}>Enviado em {isoParaData(documento.enviado_em)}</Text>
          </View>
        ))}
      <View style={base.linhaQuebravel}>
        {TIPOS_DE_DOCUMENTO.map((tipo) => (
          <Botao
            key={tipo}
            compacto
            variante="secundario"
            titulo={`Enviar ${ROTULO_DO_DOCUMENTO[tipo].toLowerCase()}`}
            carregando={ocupadoCom === `documento-${tipo}`}
            desabilitado={ocupado}
            aoPressionar={() => enviarDocumento(tipo)}
          />
        ))}
      </View>

      <Text style={base.subtitulo}>Dados e valores</Text>
      <Campo rotulo="Telefone com DDD" value={valores.telefone} onChangeText={mudar('telefone')}
        erro={erros.telefone} keyboardType="phone-pad" editable={!ocupado} />
      <Campo rotulo="Cidade" value={valores.cidade} onChangeText={mudar('cidade')} erro={erros.cidade}
        editable={!ocupado} />
      <Campo rotulo="Bairro" value={valores.bairro} onChangeText={mudar('bairro')} erro={erros.bairro}
        editable={!ocupado} />
      <Campo rotulo="Anos de experiência" value={valores.anosDeExperiencia}
        onChangeText={mudar('anosDeExperiencia')} erro={erros.anosDeExperiencia} keyboardType="number-pad"
        editable={!ocupado} />
      <Campo rotulo="Valor da diária (R$)" value={valores.valorDaDiaria} onChangeText={mudar('valorDaDiaria')}
        erro={erros.valorDaDiaria} keyboardType="decimal-pad" editable={!ocupado} />
      <Campo rotulo="Valor da hora (R$)" value={valores.valorDaHora} onChangeText={mudar('valorDaHora')}
        erro={erros.valorDaHora} keyboardType="decimal-pad" editable={!ocupado} />
      <SeletorDeEspecialidades opcoes={opcoes} selecionadas={especialidades} aoMudar={(escolhidas) => {
          setEspecialidades(escolhidas);
          setErros((atuais) => semOCampo(atuais, 'especialidades'));
        }}
        desabilitado={ocupado} erro={erros.especialidades} />
      <Botao titulo="Salvar alterações" aoPressionar={salvar} carregando={ocupadoCom === 'salvar'}
        desabilitado={ocupado} />
    </Tela>
  );
}
