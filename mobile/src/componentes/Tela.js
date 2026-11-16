import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import BarraInferior from './BarraInferior';
import { useSessao } from '../contexto/SessaoContexto';
import { base } from '../tema';

export default function Tela({ children, secao, rolavel = false, controleDeAtualizacao }) {
  const { usuario } = useSessao();
  const alturaDoCabecalho = useHeaderHeight();
  const corpo = rolavel
    ? (
      <ScrollView
        contentContainerStyle={base.conteudo}
        keyboardShouldPersistTaps="handled"
        refreshControl={controleDeAtualizacao}
      >
        {children}
      </ScrollView>
    )
    : <View style={base.tela}>{children}</View>;
  return (
    <KeyboardAvoidingView
      style={base.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? alturaDoCabecalho : 0}
    >
      {corpo}
      {secao && usuario ? <BarraInferior papel={usuario.papel} atual={secao} /> : null}
    </KeyboardAvoidingView>
  );
}
