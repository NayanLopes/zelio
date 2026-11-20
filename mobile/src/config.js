export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
export const BROKER = process.env.EXPO_PUBLIC_MQTT_BROKER ?? 'wss://mqtt.acilab.com.br';
export const RAIZ_DOS_TOPICOS = (process.env.EXPO_PUBLIC_MQTT_RAIZ ?? 'ufc-quixada/zelio').replace(/\/+$/, '');
export const TEMPO_LIMITE_MS = 60000;
export const LIMITE_DE_MENSAGENS_GUARDADAS = 200;
