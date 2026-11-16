import { Pressable, Text, View } from 'react-native';
import Etiqueta from './Etiqueta';
import { NotaResumida } from './Estrelas';
import { base } from '../tema';
import { moeda } from '../util/formatos';

export default function CartaoDeCuidador({ cuidador, aoPressionar }) {
  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="button"
      accessibilityLabel={`Ver perfil de ${cuidador.nome}`}
      style={({ pressed }) => [base.cartao, pressed && { opacity: 0.8 }]}
    >
      <Text style={base.subtitulo}>{cuidador.nome}</Text>
      <Text style={base.textoSecundario}>
        {cuidador.bairro}, {cuidador.cidade} · {cuidador.anos_experiencia} anos de experiência
      </Text>
      <NotaResumida media={cuidador.nota_media} total={cuidador.total_avaliacoes} />
      <View style={base.linhaQuebravel}>
        {cuidador.especialidades.map((e) => <Etiqueta key={e.id} texto={e.nome} />)}
      </View>
      <Text style={base.texto}>{moeda(cuidador.valor_diaria)} a diária · {moeda(cuidador.valor_hora)} a hora</Text>
    </Pressable>
  );
}
