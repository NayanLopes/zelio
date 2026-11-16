import mqtt from 'mqtt';
import { BROKER } from '../config';

const cliente = mqtt.connect(BROKER, {
  clientId: `zelio_rn_${Math.random().toString(16).slice(2)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 5000,
});

cliente.setMaxListeners(50);

const assinantesPorFiltro = new Map();
const observadoresDeConexao = new Set();

function avisarConexao() {
  for (const observador of observadoresDeConexao) observador(cliente.connected);
}

cliente.on('connect', () => {
  for (const filtro of assinantesPorFiltro.keys()) cliente.subscribe(filtro, { qos: 1 });
  avisarConexao();
});
cliente.on('close', avisarConexao);
cliente.on('offline', avisarConexao);
cliente.on('error', avisarConexao);

export function combina(filtro, topico) {
  const partesDoFiltro = filtro.split('/');
  const partesDoTopico = topico.split('/');
  for (let i = 0; i < partesDoFiltro.length; i += 1) {
    if (partesDoFiltro[i] === '#') return true;
    if (partesDoTopico[i] === undefined) return false;
    if (partesDoFiltro[i] !== '+' && partesDoFiltro[i] !== partesDoTopico[i]) return false;
  }
  return partesDoFiltro.length === partesDoTopico.length;
}

export function publicar(topico, objeto) {
  return new Promise((resolver) => {
    if (!cliente.connected) {
      resolver(false);
      return;
    }
    cliente.publish(topico, JSON.stringify(objeto), { qos: 1 }, (erro) => resolver(!erro));
  });
}

export function assinar(filtro, receber) {
  const ouvinte = (topico, carga) => {
    if (!combina(filtro, topico)) return;
    let dados;
    try {
      dados = JSON.parse(carga.toString());
    } catch {
      return;
    }
    receber(topico, dados);
  };

  const quantos = assinantesPorFiltro.get(filtro) ?? 0;
  assinantesPorFiltro.set(filtro, quantos + 1);
  if (quantos === 0 && cliente.connected) cliente.subscribe(filtro, { qos: 1 });
  cliente.on('message', ouvinte);

  return () => {
    cliente.removeListener('message', ouvinte);
    const restantes = (assinantesPorFiltro.get(filtro) ?? 1) - 1;
    if (restantes > 0) {
      assinantesPorFiltro.set(filtro, restantes);
      return;
    }
    assinantesPorFiltro.delete(filtro);
    if (cliente.connected) cliente.unsubscribe(filtro);
  };
}

export function observarConexao(observador) {
  observadoresDeConexao.add(observador);
  observador(cliente.connected);
  return () => observadoresDeConexao.delete(observador);
}
