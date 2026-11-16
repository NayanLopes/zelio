import { StyleSheet, Text, View } from 'react-native';
import Faixa from './Faixa';
import { base, cores, espaco } from '../tema';
import { ROTULO_DA_MODALIDADE, ROTULO_DO_STATUS, moeda, periodo } from '../util/formatos';

const COR_DO_STATUS = {
  solicitado: { fundo: cores.alertaSuave, texto: cores.alerta },
  aceito: { fundo: cores.sucessoSuave, texto: cores.sucesso },
  concluido: { fundo: cores.marcaSuave, texto: cores.marcaEscura },
  recusado: { fundo: cores.criticoSuave, texto: cores.critico },
  cancelado: { fundo: cores.preenchimento, texto: cores.textoSecundario },
};

function textoDoAviso(aviso) {
  const inicio = aviso.tipo === 'atraso'
    ? `Atraso de ${aviso.minutos_atraso} minutos.`
    : 'Cancelado pelo cuidador.';
  return aviso.mensagem ? `${inicio} ${aviso.mensagem}` : inicio;
}

export default function CartaoDePlantao({ plantao, lado, children }) {
  const cor = COR_DO_STATUS[plantao.status] ?? COR_DO_STATUS.cancelado;
  const avisoRecente = plantao.avisos?.[0];
  return (
    <View style={base.cartao}>
      <View style={base.entre}>
        <Text style={[base.subtitulo, estilos.nome]}>
          {lado === 'familia' ? plantao.cuidador.nome : plantao.familia?.responsavel ?? 'Família'}
        </Text>
        <View style={[estilos.status, { backgroundColor: cor.fundo }]}>
          <Text style={[estilos.textoDoStatus, { color: cor.texto }]}>
            {ROTULO_DO_STATUS[plantao.status] ?? plantao.status}
          </Text>
        </View>
      </View>
      <Text style={base.texto}>
        Para {plantao.idoso.nome}, {plantao.idoso.idade} anos
      </Text>
      {lado === 'cuidador' && plantao.idoso.condicao
        ? <Text style={base.textoSecundario}>{plantao.idoso.condicao}</Text>
        : null}
      <Text style={base.textoSecundario}>{periodo(plantao)}</Text>
      <Text style={base.textoSecundario}>
        {ROTULO_DA_MODALIDADE[plantao.modalidade] ?? plantao.modalidade} · {moeda(plantao.valor_total)}
      </Text>
      {avisoRecente ? <Faixa tipo="alerta" titulo="Aviso do cuidador" texto={textoDoAviso(avisoRecente)} /> : null}
      {children ? <View style={estilos.acoes}>{children}</View> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  nome: { flex: 1 },
  status: { borderRadius: 999, paddingHorizontal: espaco.m, paddingVertical: espaco.pp },
  textoDoStatus: { fontSize: 13, fontWeight: '700' },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.p, marginTop: espaco.p },
});
