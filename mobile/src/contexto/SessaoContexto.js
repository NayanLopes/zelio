import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { aoEncerrarSessao } from '../servicos/api';
import * as sessaoRepositorio from '../repositorios/sessaoRepositorio';
import * as conversasRepositorio from '../repositorios/conversasRepositorio';

const SessaoContexto = createContext(null);

export function ProvedorDeSessao({ children }) {
  const [estado, setEstado] = useState('restaurando');
  const [usuario, setUsuario] = useState(null);

  const aplicarRestauracao = useCallback((restaurado) => {
    setUsuario(restaurado);
    setEstado(restaurado ? 'dentro' : 'fora');
  }, []);

  const semConexao = useCallback(() => {
    setUsuario(null);
    setEstado('sem_conexao');
  }, []);

  useEffect(() => {
    let ativo = true;
    sessaoRepositorio.restaurar().then(
      (restaurado) => {
        if (ativo) aplicarRestauracao(restaurado);
      },
      () => {
        if (ativo) semConexao();
      },
    );
    return () => {
      ativo = false;
    };
  }, [aplicarRestauracao, semConexao]);

  const restaurar = useCallback(async () => {
    setEstado('restaurando');
    try {
      aplicarRestauracao(await sessaoRepositorio.restaurar());
    } catch {
      semConexao();
    }
  }, [aplicarRestauracao, semConexao]);

  useEffect(() => {
    aoEncerrarSessao(() => {
      sessaoRepositorio.esquecerSessaoLocal();
      setUsuario(null);
      setEstado('fora');
    });
    return () => aoEncerrarSessao(null);
  }, []);

  useEffect(() => {
    if (!usuario) return undefined;
    return conversasRepositorio.iniciar(usuario);
  }, [usuario]);

  const entrar = useCallback(async (email, senha) => {
    const autenticado = await sessaoRepositorio.entrar(email, senha);
    setUsuario(autenticado);
    setEstado('dentro');
  }, []);

  const sair = useCallback(async () => {
    await sessaoRepositorio.sair();
    setUsuario(null);
    setEstado('fora');
  }, []);

  const irParaEntrada = useCallback(async () => {
    await sessaoRepositorio.esquecerSessaoLocal();
    setUsuario(null);
    setEstado('fora');
  }, []);

  const renomear = useCallback((nome) => {
    setUsuario((atual) => (atual ? { ...atual, nome } : atual));
  }, []);

  const valor = useMemo(
    () => ({ estado, usuario, entrar, sair, restaurar, irParaEntrada, renomear }),
    [estado, usuario, entrar, sair, restaurar, irParaEntrada, renomear],
  );

  return <SessaoContexto.Provider value={valor}>{children}</SessaoContexto.Provider>;
}

export const useSessao = () => useContext(SessaoContexto);
