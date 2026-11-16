import { useState } from 'react';
import { Text, View } from 'react-native';
import Botao from '../componentes/Botao';
import Campo from '../componentes/Campo';
import Etiqueta from '../componentes/Etiqueta';
import Faixa from '../componentes/Faixa';
import Tela from '../componentes/Tela';
import { useAviso } from '../contexto/AvisoContexto';
import { useAcao } from '../hooks/useAcao';
import * as plantoesRepositorio from '../repositorios/plantoesRepositorio';
import { base } from '../tema';
import { periodo } from '../util/formatos';
import { errosDoServidor, mensagemDoErro, regra, semErros, validar } from '../util/validacao';

export default function AvisarAtrasoTela({ navigation, route }) {
  const { plantao } = route.params;
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const [tipo, setTipo] = useState('atraso');
  const [minutos, setMinutos] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState(null);

  async function enviar() {
    const encontrados = tipo === 'atraso'
      ? validar({ minutos }, { minutos: [regra.obrigatorio, regra.inteiroEntre(1, 720)] })
      : {};
    setErros(encontrados);
    setFalha(null);
    if (!semErros(encontrados)) return;
    await executar('avisar', async () => {
      const dados = { tipo };
      if (tipo === 'atraso') dados.minutos_atraso = Number(minutos);
      if (mensagem.trim() !== '') dados.mensagem = mensagem.trim();
      try {
        await plantoesRepositorio.avisar(plantao, dados);
        aviso.sucesso(tipo === 'atraso' ? 'A família foi avisada do atraso.' : 'Plantão cancelado e família avisada.');
        navigation.goBack();
      } catch (erro) {
        if (erro.tipo === 'validacao' && erro.detalhes) {
          setErros(errosDoServidor(erro.detalhes, { minutos_atraso: 'minutos' }));
        }
        setFalha(mensagemDoErro(erro));
      }
    });
  }

  return (
    <Tela rolavel>
      <Text style={base.subtitulo}>Plantão de {plantao.idoso.nome}</Text>
      <Text style={base.textoSecundario}>{periodo(plantao)}</Text>
      {falha ? <Faixa tipo="erro" texto={falha} /> : null}
      <View style={base.linhaQuebravel}>
        <Etiqueta texto="Vou me atrasar" selecionada={tipo === 'atraso'} desabilitada={ocupado}
          aoPressionar={() => setTipo('atraso')} />
        <Etiqueta texto="Não poderei ir" selecionada={tipo === 'cancelamento'} desabilitada={ocupado}
          aoPressionar={() => setTipo('cancelamento')} />
      </View>
      {tipo === 'atraso' ? (
        <Campo rotulo="Atraso em minutos" value={minutos} onChangeText={(texto) => {
            setMinutos(texto);
            setErros({});
          }} erro={erros.minutos}
          keyboardType="number-pad" editable={!ocupado} />
      ) : (
        <Faixa tipo="alerta" texto="Este aviso cancela o plantão. A família precisará procurar outro cuidador." />
      )}
      <Campo rotulo="Recado para a família (opcional)" value={mensagem} onChangeText={setMensagem}
        multiline maxLength={280} ajuda={`${mensagem.length} de 280 caracteres`} editable={!ocupado} />
      <Botao
        titulo={tipo === 'atraso' ? 'Avisar atraso' : 'Cancelar plantão e avisar'}
        variante={tipo === 'atraso' ? 'primario' : 'perigo'}
        aoPressionar={enviar}
        carregando={ocupado}
      />
    </Tela>
  );
}
