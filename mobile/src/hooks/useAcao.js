import { useCallback, useRef, useState } from 'react';

export function useAcao() {
  const [ocupadoCom, setOcupadoCom] = useState(null);
  const emAndamento = useRef(false);

  const executar = useCallback(async (nome, tarefa) => {
    if (emAndamento.current) return undefined;
    emAndamento.current = true;
    setOcupadoCom(nome);
    try {
      return await tarefa();
    } finally {
      emAndamento.current = false;
      setOcupadoCom(null);
    }
  }, []);

  return { ocupadoCom, ocupado: ocupadoCom !== null, executar };
}
