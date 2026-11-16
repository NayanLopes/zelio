import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Botao from './Botao';
import { cores, espaco } from '../tema';

const TITULO_DO_ERRO = {
  conexao: 'Sem conexão',
  resposta_invalida: 'Resposta inesperada do servidor',
  servidor: 'O servidor falhou',
};

export function Carregando({ texto = 'Carregando...' }) {
  return (
    <View style={estilos.centro}>
      <ActivityIndicator size="large" color={cores.marca} />
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

export function Falha({ erro, aoTentarDeNovo }) {
  return (
    <View style={estilos.centro}>
      <Text style={estilos.titulo}>{TITULO_DO_ERRO[erro?.tipo] ?? 'Não foi possível carregar'}</Text>
      <Text style={estilos.texto}>{erro?.message ?? 'Tente de novo em instantes.'}</Text>
      {aoTentarDeNovo ? <Botao titulo="Tentar de novo" aoPressionar={aoTentarDeNovo} variante="secundario" /> : null}
    </View>
  );
}

export function Vazio({ titulo, texto, acao, aoAgir }) {
  return (
    <View style={estilos.centro}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {texto ? <Text style={estilos.texto}>{texto}</Text> : null}
      {acao ? <Botao titulo={acao} aoPressionar={aoAgir} variante="secundario" /> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: espaco.ggg, gap: espaco.m },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto, textAlign: 'center' },
  texto: { fontSize: 15, color: cores.textoSecundario, textAlign: 'center', lineHeight: 21 },
});
