import { useState } from 'react';
import { Text } from 'react-native';
import Botao from '../componentes/Botao';
import Campo from '../componentes/Campo';
import { SeletorDeNota } from '../componentes/Estrelas';
import Faixa from '../componentes/Faixa';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useSessao } from '../contexto/SessaoContexto';
import { useAcao } from '../hooks/useAcao';
import * as plantoesRepositorio from '../repositorios/plantoesRepositorio';
import { base, cores } from '../tema';
import { mensagemDoErro } from '../util/validacao';

export default function AvaliarTela({ navigation, route }) {
  const { plantaoId, nomeDoOutro } = route.params;
  const { usuario } = useSessao();
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [erroDaNota, setErroDaNota] = useState(null);
  const [falha, setFalha] = useState(null);

  async function enviar() {
    setFalha(null);
    if (nota === 0) {
      setErroDaNota('Escolha uma nota de 1 a 5.');
      return;
    }
    setErroDaNota(null);
    await executar('avaliar', async () => {
      try {
        await plantoesRepositorio.avaliar(plantaoId, usuario.papel, nota, comentario.trim());
        aviso.sucesso('Avaliação registrada. Obrigado.');
        navigation.goBack();
      } catch (erro) {
        setFalha(mensagemDoErro(erro));
      }
    });
  }

  return (
    <Tela rolavel>
      <Text style={base.subtitulo}>Como foi o plantão com {nomeDoOutro}?</Text>
      {falha ? <Faixa tipo="erro" texto={falha} /> : null}
      <SeletorDeNota nota={nota} aoEscolher={(escolhida) => {
          setNota(escolhida);
          setErroDaNota(null);
        }} desabilitado={ocupado} />
      {erroDaNota ? <Text style={{ fontSize: 14, color: cores.critico }}>{erroDaNota}</Text> : null}
      <Campo
        rotulo="Comentário (opcional)"
        value={comentario}
        onChangeText={setComentario}
        multiline
        maxLength={500}
        ajuda={`${comentario.length} de 500 caracteres`}
        editable={!ocupado}
      />
      <Botao titulo="Enviar avaliação" aoPressionar={enviar} carregando={ocupado} />
    </Tela>
  );
}
