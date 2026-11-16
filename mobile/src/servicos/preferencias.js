import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIXO = '@zelio/';

export async function lerTexto(chave) {
  try {
    return await AsyncStorage.getItem(PREFIXO + chave);
  } catch {
    return null;
  }
}

export async function salvarTexto(chave, valor) {
  await AsyncStorage.setItem(PREFIXO + chave, valor);
}

export async function lerJson(chave, padrao, valido = () => true) {
  const texto = await lerTexto(chave);
  if (texto === null) return padrao;
  try {
    const valor = JSON.parse(texto);
    return valido(valor) ? valor : padrao;
  } catch {
    return padrao;
  }
}

export async function salvarJson(chave, valor) {
  await AsyncStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
}

export async function remover(chave) {
  await AsyncStorage.removeItem(PREFIXO + chave);
}
