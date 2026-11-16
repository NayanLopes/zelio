import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import Campo from '../componentes/Campo';
import Faixa from '../componentes/Faixa';
import Tela from '../componentes/Tela';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import { ultimoEmail } from '../repositorios/sessaoRepositorio';
import { base, espaco } from '../tema';
import { regra, semErros, semOCampo, validar } from '../util/validacao';

export default function EntrarTela({ navigation }) {
  const { entrar } = useSessao();
  const { ocupado, executar } = useAcao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState(null);

  useEffect(() => {
    let ativo = true;
    ultimoEmail().then((guardado) => {
      if (ativo && guardado) setEmail((atual) => (atual === '' ? guardado : atual));
    });
    return () => {
      ativo = false;
    };
  }, []);

  async function enviar() {
    const encontrados = validar({ email, senha }, {
      email: [regra.obrigatorio, regra.email],
      senha: [regra.obrigatorio],
    });
    setErros(encontrados);
    setFalha(null);
    if (!semErros(encontrados)) return;
    await executar('entrar', async () => {
      try {
        await entrar(email.trim().toLowerCase(), senha);
      } catch (erro) {
        setFalha(erro);
      }
    });
  }

  return (
    <Tela rolavel>
      <View style={{ gap: espaco.pp, marginTop: espaco.g }}>
        <Text style={base.titulo}>Zelio</Text>
        <Text style={base.textoSecundario}>Cuidadores de idosos verificados, perto de você.</Text>
      </View>
      {falha ? <Faixa tipo="erro" texto={falha.message} /> : null}
      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={(texto) => {
          setEmail(texto);
          setErros((atuais) => semOCampo(atuais, 'email'));
        }}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!ocupado}
      />
      <Campo
        rotulo="Senha"
        value={senha}
        onChangeText={(texto) => {
          setSenha(texto);
          setErros((atuais) => semOCampo(atuais, 'senha'));
        }}
        erro={erros.senha}
        secureTextEntry
        editable={!ocupado}
        onSubmitEditing={enviar}
      />
      <Botao titulo="Entrar" aoPressionar={enviar} carregando={ocupado} />
      <View style={{ gap: espaco.p, marginTop: espaco.g }}>
        <Text style={base.subtitulo}>Ainda não tem conta?</Text>
        <Botao
          titulo="Preciso de um cuidador"
          variante="secundario"
          desabilitado={ocupado}
          aoPressionar={() => navigation.navigate('CadastroDeFamilia')}
        />
        <Botao
          titulo="Sou cuidador"
          variante="secundario"
          desabilitado={ocupado}
          aoPressionar={() => navigation.navigate('CadastroDeCuidador')}
        />
      </View>
    </Tela>
  );
}
