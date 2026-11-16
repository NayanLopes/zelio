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
  nome: [regra.obrigatorio, regra.tamanhoMaximo(120)],
  idade: [regra.obrigatorio, regra.inteiroEntre(40, 120)],
  condicao: [regra.tamanhoMaximo(300)],
};

export default function FormularioDeIdosoTela({ navigation, route }) {
  const idoso = route.params?.idoso ?? null;
  const { usuario } = useSessao();
  const aviso = useAviso();
  const { ocupado, executar } = useAcao();
  const [valores, setValores] = useState({
    nome: idoso?.nome ?? '',
    idade: idoso ? String(idoso.idade) : '',
    condicao: idoso?.condicao ?? '',
  });
  const [erros, setErros] = useState({});
  const [falha, setFalha] = useState(null);

  const mudar = (campo) => (texto) => {
    setValores((atuais) => ({ ...atuais, [campo]: texto }));
    setErros((atuais) => semOCampo(atuais, campo));
  };

  async function salvar() {
    const encontrados = validar(valores, ESQUEMA);
    setErros(encontrados);
    setFalha(null);
    if (!semErros(encontrados)) return;
    await executar('salvar', async () => {
      const dados = { nome: valores.nome.trim(), idade: Number(valores.idade) };
      if (valores.condicao.trim() !== '') dados.condicao = valores.condicao.trim();
      try {
        if (idoso) {
          await familiasRepositorio.atualizarIdoso(usuario.familia_id, idoso.id, dados);
          aviso.sucesso('Dados atualizados.');
        } else {
          await familiasRepositorio.adicionarIdoso(usuario.familia_id, dados);
          aviso.sucesso(`${dados.nome} foi cadastrado.`);
        }
        navigation.goBack();
      } catch (erro) {
        if (erro.tipo === 'validacao' && erro.detalhes) setErros(errosDoServidor(erro.detalhes));
        setFalha(mensagemDoErro(erro));
      }
    });
  }

  return (
    <Tela rolavel>
      {falha ? <Faixa tipo="erro" texto={falha} /> : null}
      <Campo rotulo="Nome" value={valores.nome} onChangeText={mudar('nome')} erro={erros.nome} editable={!ocupado} />
      <Campo rotulo="Idade" value={valores.idade} onChangeText={mudar('idade')} erro={erros.idade}
        keyboardType="number-pad" ajuda="Entre 40 e 120 anos." editable={!ocupado} />
      <Campo rotulo="Condição de saúde (opcional)" value={valores.condicao} onChangeText={mudar('condicao')}
        erro={erros.condicao} multiline maxLength={300}
        ajuda="Por exemplo: Alzheimer inicial, anda com apoio." editable={!ocupado} />
      <Botao titulo={idoso ? 'Salvar alterações' : 'Cadastrar'} aoPressionar={salvar} carregando={ocupado} />
    </Tela>
  );
}
