import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores, espaco } from '../tema';

const AvisoContexto = createContext(null);
const DURACAO_MS = 4000;

const APARENCIA = {
  sucesso: { fundo: cores.sucesso, texto: cores.sobreMarca },
  erro: { fundo: cores.critico, texto: cores.sobreMarca },
  info: { fundo: cores.texto, texto: cores.sobreMarca },
};

export function ProvedorDeAviso({ children }) {
  const [aviso, setAviso] = useState(null);
  const relogio = useRef(null);
  const margens = useSafeAreaInsets();

  const fechar = useCallback(() => {
    clearTimeout(relogio.current);
    setAviso(null);
  }, []);

  const mostrar = useCallback((tipo, texto) => {
    clearTimeout(relogio.current);
    setAviso({ tipo, texto });
    relogio.current = setTimeout(() => setAviso(null), DURACAO_MS);
  }, []);

  useEffect(() => () => clearTimeout(relogio.current), []);

  const valor = useMemo(
    () => ({
      sucesso: (texto) => mostrar('sucesso', texto),
      erro: (texto) => mostrar('erro', texto),
      info: (texto) => mostrar('info', texto),
    }),
    [mostrar],
  );

  return (
    <AvisoContexto.Provider value={valor}>
      {children}
      {aviso ? (
        <Pressable
          onPress={fechar}
          accessibilityRole="alert"
          style={[estilos.caixa, { bottom: margens.bottom + 84, backgroundColor: APARENCIA[aviso.tipo].fundo }]}
        >
          <Text style={[estilos.texto, { color: APARENCIA[aviso.tipo].texto }]}>{aviso.texto}</Text>
        </Pressable>
      ) : null}
    </AvisoContexto.Provider>
  );
}

export const useAviso = () => useContext(AvisoContexto);

const estilos = StyleSheet.create({
  caixa: {
    position: 'absolute',
    left: espaco.g,
    right: espaco.g,
    borderRadius: 12,
    paddingVertical: espaco.m,
    paddingHorizontal: espaco.g,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  texto: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
});
