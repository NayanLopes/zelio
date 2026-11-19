import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Botao from './src/componentes/Botao';
import { ProvedorDeAviso } from './src/contexto/AvisoContexto';
import { ProvedorDeSessao, useSessao } from './src/contexto/SessaoContexto';
import AvaliarTela from './src/telas/AvaliarTela';
import AvisarAtrasoTela from './src/telas/AvisarAtrasoTela';
import CadastroDeCuidadorTela from './src/telas/CadastroDeCuidadorTela';
import CadastroDeFamiliaTela from './src/telas/CadastroDeFamiliaTela';
import CadastrosDeCuidadoresTela from './src/telas/CadastrosDeCuidadoresTela';
import ContaTela from './src/telas/ContaTela';
import ConversaTela from './src/telas/ConversaTela';
import ConversasTela from './src/telas/ConversasTela';
import EncontrarCuidadorTela from './src/telas/EncontrarCuidadorTela';
import EntrarTela from './src/telas/EntrarTela';
import FormularioDeIdosoTela from './src/telas/FormularioDeIdosoTela';
import IdososTela from './src/telas/IdososTela';
import MeuCadastroTela from './src/telas/MeuCadastroTela';
import PerfilDoCuidadorTela from './src/telas/PerfilDoCuidadorTela';
import PlantoesTela from './src/telas/PlantoesTela';
import SolicitarPlantaoTela from './src/telas/SolicitarPlantaoTela';
import { base, cores, espaco } from './src/tema';

const Pilha = createStackNavigator();

const opcoesDaPilha = {
  headerStyle: { backgroundColor: cores.fundo },
  headerTintColor: cores.marcaEscura,
  headerTitleStyle: { fontWeight: '700', color: cores.texto },
  headerBackTitle: 'Voltar',
  cardStyle: { flex: 1, backgroundColor: cores.fundo },
};

function telasDeEntrada() {
  return (
    <>
      <Pilha.Screen name="Entrar" component={EntrarTela} options={{ title: 'Entrar' }} />
      <Pilha.Screen name="CadastroDeFamilia" component={CadastroDeFamiliaTela} options={{ title: 'Criar conta' }} />
      <Pilha.Screen name="CadastroDeCuidador" component={CadastroDeCuidadorTela} options={{ title: 'Cadastro de cuidador' }} />
    </>
  );
}

function telasDaFamilia() {
  return (
    <>
      <Pilha.Screen name="EncontrarCuidador" component={EncontrarCuidadorTela} options={{ title: 'Encontrar cuidador' }} />
      <Pilha.Screen name="MeusPlantoes" component={PlantoesTela} options={{ title: 'Meus plantões' }} />
      <Pilha.Screen name="Idosos" component={IdososTela} options={{ title: 'Quem recebe o cuidado' }} />
      <Pilha.Screen name="PerfilDoCuidador" component={PerfilDoCuidadorTela}
        options={({ route }) => ({ title: route.params?.nome ?? 'Perfil do cuidador' })} />
      <Pilha.Screen name="SolicitarPlantao" component={SolicitarPlantaoTela} options={{ title: 'Solicitar plantão' }} />
      <Pilha.Screen name="FormularioDeIdoso" component={FormularioDeIdosoTela}
        options={({ route }) => ({ title: route.params?.idoso ? 'Editar cadastro' : 'Cadastrar pessoa' })} />
    </>
  );
}

function telasDoCuidador() {
  return (
    <>
      <Pilha.Screen name="PlantoesDoCuidador" component={PlantoesTela} options={{ title: 'Solicitações e plantões' }} />
      <Pilha.Screen name="MeuCadastro" component={MeuCadastroTela} options={{ title: 'Meu cadastro' }} />
      <Pilha.Screen name="AvisarAtraso" component={AvisarAtrasoTela} options={{ title: 'Avisar a família' }} />
    </>
  );
}

function telasEmComum() {
  return (
    <>
      <Pilha.Screen name="Conversas" component={ConversasTela} options={{ title: 'Conversas' }} />
      <Pilha.Screen name="Conversa" component={ConversaTela}
        options={({ route }) => ({ title: route.params?.nomeDoOutro ?? 'Conversa' })} />
      <Pilha.Screen name="Avaliar" component={AvaliarTela} options={{ title: 'Avaliar' }} />
    </>
  );
}

function Navegacao() {
  const { estado, usuario, restaurar, irParaEntrada } = useSessao();

  if (estado === 'restaurando') {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={cores.marca} />
        <Text style={base.textoSecundario}>Abrindo o Zelio...</Text>
      </View>
    );
  }

  if (estado === 'sem_conexao') {
    return (
      <View style={estilos.centro}>
        <Text style={base.subtitulo}>Sem conexão com o servidor</Text>
        <Text style={[base.textoSecundario, estilos.textoCentral]}>
          Sua sessão continua guardada neste aparelho. Confira a rede e tente de novo.
        </Text>
        <Botao titulo="Tentar de novo" aoPressionar={restaurar} estilo={estilos.botao} />
        <Botao titulo="Entrar com outra conta" variante="secundario" aoPressionar={irParaEntrada} estilo={estilos.botao} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Pilha.Navigator key={usuario ? `${usuario.papel}-${usuario.id}` : 'entrada'} screenOptions={opcoesDaPilha}>
        {!usuario ? telasDeEntrada() : null}
        {usuario?.papel === 'familia' ? telasDaFamilia() : null}
        {usuario?.papel === 'cuidador' ? telasDoCuidador() : null}
        {usuario?.papel === 'admin'
          ? <Pilha.Screen name="CadastrosDeCuidadores" component={CadastrosDeCuidadoresTela} options={{ title: 'Cadastros de cuidadores' }} />
          : null}
        {usuario && usuario.papel !== 'admin' ? telasEmComum() : null}
        {usuario ? <Pilha.Screen name="Conta" component={ContaTela} options={{ title: 'Minha conta' }} /> : null}
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={base.tela}>
      <SafeAreaProvider>
        <ProvedorDeSessao>
          <ProvedorDeAviso>
            <StatusBar style="dark" />
            <Navegacao />
          </ProvedorDeAviso>
        </ProvedorDeSessao>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const estilos = StyleSheet.create({
  centro: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: espaco.m,
    padding: espaco.ggg, backgroundColor: cores.fundo,
  },
  textoCentral: { textAlign: 'center' },
  botao: { alignSelf: 'stretch' },
});
