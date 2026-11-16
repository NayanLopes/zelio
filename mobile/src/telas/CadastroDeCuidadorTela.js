import { useCallback, useState } from 'react';
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
import { numeroDoTexto } from '../util/formatos';
import { errosDoServidor, mensagemDoErro, regra, semErros, semOCampo, validar } from '../util/validacao';

const ESQUEMA = {
  nome: [regra.obrigatorio, regra.tamanhoMaximo(120)],
  email: [regra.obrigatorio, regra.email],
  telefone: [regra.obrigatorio, regra.telefone, regra.tamanhoMaximo(20)],
  cidade: [regra.obrigatorio, regra.tamanhoMaximo(80)],
  bairro: [regra.obrigatorio, regra.tamanhoMaximo(80)],
  anosDeExperiencia: [regra.obrigatorio, regra.inteiroEntre(0, 70)],
  valorDaDiaria: [regra.obrigatorio, regra.valorPositivo],
  valorDaHora: [regra.obrigatorio, regra.valorPositivo],
  senha: [regra.obrigatorio, regra.tamanhoMinimo(6), regra.tamanhoMaximo(72)],
};

const NOMES_DOS_CAMPOS = {
  anos_experiencia: 'anosDeExperiencia', valor_diaria: 'valorDaDiaria', valor_hora: 'valorDaHora',
};

export default function CadastroDeCuidadorTela() {
  const { entrar } = useSessao();
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const opcoes = useConsulta(useCallback(() => cuidadoresRepositorio.especialidades(), []));
  const [valores, setValores] = useState({
    nome: '', email: '', telefone: '', cidade: '', bairro: '',
    anosDeExperiencia: '', valorDaDiaria: '', valorDaHora: '', senha: '',
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState(null);

  const mudar = (campo) => (texto) => {
    setValores((atuais) => ({ ...atuais, [campo]: texto }));
    setErros((atuais) => semOCampo(atuais, campo));
  };

  async function enviar() {
    const encontrados = validar(valores, ESQUEMA);
    if (especialidades.length === 0) encontrados.especialidades = 'Escolha pelo menos uma.';
    setErros(encontrados);
    setFalha(null);
    if (!semErros(encontrados)) return;
    await executar('cadastrar', async () => {
      const email = valores.email.trim().toLowerCase();
      try {
        await cuidadoresRepositorio.cadastrar({
          nome: valores.nome.trim(),
          email,
          telefone: valores.telefone.trim(),
          cidade: valores.cidade.trim(),
          bairro: valores.bairro.trim(),
          anos_experiencia: Number(valores.anosDeExperiencia),
          valor_diaria: numeroDoTexto(valores.valorDaDiaria),
          valor_hora: numeroDoTexto(valores.valorDaHora),
          especialidades,
          senha: valores.senha,
        });
        await entrar(email, valores.senha);
        aviso.sucesso('Cadastro enviado. Envie seus documentos para a análise.');
      } catch (erro) {
        if (erro.tipo === 'validacao' && erro.detalhes) setErros(errosDoServidor(erro.detalhes, NOMES_DOS_CAMPOS));
        setFalha(mensagemDoErro(erro));
      }
    });
  }

  if (opcoes.carregando) return <Tela><Carregando /></Tela>;
  if (opcoes.erro) return <Tela><Falha erro={opcoes.erro} aoTentarDeNovo={opcoes.tentarDeNovo} /></Tela>;

  return (
    <Tela rolavel>
      <Faixa texto="Seu perfil só aparece na busca depois que a administração conferir seus documentos." />
      {falha ? <Faixa tipo="erro" texto={falha} /> : null}
      <Campo rotulo="Nome completo" value={valores.nome} onChangeText={mudar('nome')} erro={erros.nome}
        editable={!ocupado} />
      <Campo rotulo="E-mail" value={valores.email} onChangeText={mudar('email')} erro={erros.email}
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} editable={!ocupado} />
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
      <SeletorDeEspecialidades opcoes={opcoes.dados} selecionadas={especialidades} aoMudar={(escolhidas) => {
          setEspecialidades(escolhidas);
          setErros((atuais) => semOCampo(atuais, 'especialidades'));
        }}
        desabilitado={ocupado} erro={erros.especialidades} />
      <Campo rotulo="Crie uma senha" value={valores.senha} onChangeText={mudar('senha')} erro={erros.senha}
        ajuda="Pelo menos 6 caracteres." secureTextEntry editable={!ocupado} />
      <Botao titulo="Enviar cadastro" aoPressionar={enviar} carregando={ocupado} />
    </Tela>
  );
}
