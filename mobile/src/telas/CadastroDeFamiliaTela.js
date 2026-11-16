import { useState } from 'react';
import Botao from '../componentes/Botao';
import Campo from '../componentes/Campo';
import Faixa from '../componentes/Faixa';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import * as familiasRepositorio from '../repositorios/familiasRepositorio';
import { errosDoServidor, mensagemDoErro, regra, semErros, semOCampo, validar } from '../util/validacao';

const ESQUEMA = {
  responsavel: [regra.obrigatorio, regra.tamanhoMaximo(120)],
  email: [regra.obrigatorio, regra.email],
  telefone: [regra.obrigatorio, regra.telefone, regra.tamanhoMaximo(20)],
  cidade: [regra.obrigatorio, regra.tamanhoMaximo(80)],
  bairro: [regra.obrigatorio, regra.tamanhoMaximo(80)],
  senha: [regra.obrigatorio, regra.tamanhoMinimo(6), regra.tamanhoMaximo(72)],
};

export default function CadastroDeFamiliaTela() {
  const { entrar } = useSessao();
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const [valores, setValores] = useState({
    responsavel: '', email: '', telefone: '', cidade: '', bairro: '', senha: '',
  });
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState(null);

  const mudar = (campo) => (texto) => {
    setValores((atuais) => ({ ...atuais, [campo]: texto }));
    setErros((atuais) => semOCampo(atuais, campo));
  };

  async function enviar() {
    const encontrados = validar(valores, ESQUEMA);
    setErros(encontrados);
    setFalha(null);
    if (!semErros(encontrados)) return;
    await executar('cadastrar', async () => {
      const email = valores.email.trim().toLowerCase();
      try {
        await familiasRepositorio.cadastrar({
          responsavel: valores.responsavel.trim(),
          email,
          telefone: valores.telefone.trim(),
          cidade: valores.cidade.trim(),
          bairro: valores.bairro.trim(),
          senha: valores.senha,
        });
        await entrar(email, valores.senha);
        aviso.sucesso('Conta criada. Agora cadastre quem vai receber o cuidado.');
      } catch (erro) {
        if (erro.tipo === 'validacao' && erro.detalhes) setErros(errosDoServidor(erro.detalhes));
        setFalha(mensagemDoErro(erro));
      }
    });
  }

  return (
    <Tela rolavel>
      {falha ? <Faixa tipo="erro" texto={falha} /> : null}
      <Campo rotulo="Seu nome completo" value={valores.responsavel} onChangeText={mudar('responsavel')}
        erro={erros.responsavel} editable={!ocupado} />
      <Campo rotulo="E-mail" value={valores.email} onChangeText={mudar('email')} erro={erros.email}
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} editable={!ocupado} />
      <Campo rotulo="Telefone com DDD" value={valores.telefone} onChangeText={mudar('telefone')}
        erro={erros.telefone} keyboardType="phone-pad" editable={!ocupado} />
      <Campo rotulo="Cidade" value={valores.cidade} onChangeText={mudar('cidade')} erro={erros.cidade}
        editable={!ocupado} />
      <Campo rotulo="Bairro" value={valores.bairro} onChangeText={mudar('bairro')} erro={erros.bairro}
        editable={!ocupado} />
      <Campo rotulo="Crie uma senha" value={valores.senha} onChangeText={mudar('senha')} erro={erros.senha}
        ajuda="Pelo menos 6 caracteres." secureTextEntry editable={!ocupado} />
      <Botao titulo="Criar conta" aoPressionar={enviar} carregando={ocupado} />
    </Tela>
  );
}
