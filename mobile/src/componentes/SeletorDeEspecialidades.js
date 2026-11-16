import { Text, View } from 'react-native';
import Etiqueta from './Etiqueta';
import { base, cores } from '../tema';

export default function SeletorDeEspecialidades({ opcoes, selecionadas, aoMudar, desabilitado, erro }) {
  function alternar(id) {
    aoMudar(selecionadas.includes(id) ? selecionadas.filter((s) => s !== id) : [...selecionadas, id]);
  }
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: cores.texto }}>Especialidades atendidas</Text>
      <View style={base.linhaQuebravel}>
        {opcoes.map((opcao) => (
          <Etiqueta
            key={opcao.id}
            texto={opcao.nome}
            selecionada={selecionadas.includes(opcao.id)}
            desabilitada={desabilitado}
            aoPressionar={() => alternar(opcao.id)}
          />
        ))}
      </View>
      {erro ? <Text style={{ fontSize: 14, color: cores.critico }}>{erro}</Text> : null}
    </View>
  );
}
