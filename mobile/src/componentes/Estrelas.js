import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, espaco } from '../tema';

const NOTAS = [1, 2, 3, 4, 5];

export function NotaResumida({ media, total }) {
  if (media === null || media === undefined) return <Text style={estilos.semNota}>Sem avaliações ainda</Text>;
  const avaliacoes = total === 1 ? '1 avaliação' : `${total} avaliações`;
  return <Text style={estilos.resumo}>★ {String(media.toFixed(1)).replace('.', ',')} ({avaliacoes})</Text>;
}

export function NotaFixa({ nota }) {
  return (
    <Text style={estilos.fixa} accessibilityLabel={`Nota ${nota} de 5`}>
      {NOTAS.map((n) => (n <= nota ? '★' : '☆')).join('')}
    </Text>
  );
}

export function SeletorDeNota({ nota, aoEscolher, desabilitado }) {
  return (
    <View style={estilos.seletor}>
      {NOTAS.map((n) => (
        <Pressable
          key={n}
          onPress={() => aoEscolher(n)}
          disabled={desabilitado}
          accessibilityRole="button"
          accessibilityLabel={`Nota ${n}`}
          accessibilityState={{ selected: n === nota }}
          style={estilos.alvo}
        >
          <Text style={[estilos.estrela, n <= nota && estilos.estrelaMarcada]}>{n <= nota ? '★' : '☆'}</Text>
          <Text style={estilos.numero}>{n}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  semNota: { fontSize: 14, color: cores.textoSuave },
  resumo: { fontSize: 15, fontWeight: '600', color: cores.alerta },
  fixa: { fontSize: 16, color: cores.alerta, letterSpacing: 2 },
  seletor: { flexDirection: 'row', justifyContent: 'space-between' },
  alvo: { minWidth: 56, minHeight: 64, alignItems: 'center', justifyContent: 'center', gap: espaco.pp },
  estrela: { fontSize: 36, color: cores.textoSuave },
  estrelaMarcada: { color: cores.alerta },
  numero: { fontSize: 13, color: cores.textoSecundario },
});
