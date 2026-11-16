import { Alert } from 'react-native';

export function confirmar({ titulo, texto, acao, destrutiva = false }) {
  return new Promise((resolver) => {
    Alert.alert(
      titulo,
      texto,
      [
        { text: 'Voltar', style: 'cancel', onPress: () => resolver(false) },
        { text: acao, style: destrutiva ? 'destructive' : 'default', onPress: () => resolver(true) },
      ],
      { cancelable: true, onDismiss: () => resolver(false) },
    );
  });
}
