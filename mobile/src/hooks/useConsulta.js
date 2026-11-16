import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function useConsulta(buscar) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const pedidoAtual = useRef(0);
  const jaCarregou = useRef(false);

  const carregar = useCallback(async (modo) => {
    const pedido = pedidoAtual.current + 1;
    pedidoAtual.current = pedido;
    if (modo === 'inicial') setCarregando(true);
    else setAtualizando(true);
    try {
      const resultado = await buscar();
      if (pedidoAtual.current !== pedido) return;
      jaCarregou.current = true;
      setDados(resultado);
      setErro(null);
    } catch (falha) {
      if (pedidoAtual.current !== pedido) return;
      setErro(falha);
    } finally {
      if (pedidoAtual.current === pedido) {
        setCarregando(false);
        setAtualizando(false);
      }
    }
  }, [buscar]);

  useFocusEffect(
    useCallback(() => {
      carregar(jaCarregou.current ? 'recarga' : 'inicial');
      return () => {
        pedidoAtual.current += 1;
      };
    }, [carregar]),
  );

  return {
    dados,
    erro,
    carregando,
    atualizando,
    recarregar: useCallback(() => carregar('recarga'), [carregar]),
    tentarDeNovo: useCallback(() => carregar('inicial'), [carregar]),
  };
}
