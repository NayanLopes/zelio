import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const CHAVE_DO_TOKEN = 'zelio.token';
const disponivel = Platform.OS !== 'web';

export async function guardarToken(token) {
  if (!disponivel) return;
  await SecureStore.setItemAsync(CHAVE_DO_TOKEN, token);
}

export async function lerToken() {
  if (!disponivel) return null;
  return SecureStore.getItemAsync(CHAVE_DO_TOKEN);
}

export async function apagarToken() {
  if (!disponivel) return;
  await SecureStore.deleteItemAsync(CHAVE_DO_TOKEN);
}
