import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Image, LinearProgress } from '@rneui/themed';
import { auth_user } from '../store/auth';
import { connect } from 'react-redux';
import { startCardapio } from '../store/action/cardapio';
import { fetchadicionar_mesa, startPedidosListener } from '../store/action/pedidos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchuser_func_get, startUsers } from '../store/action/user';
import { startfechado_aberto } from '../store/action/message_fechado_aberto';
import { startpaesListeners } from '../store/action/paes';

const Splash = ({ navigation, pedidos, cardapio, onFetchPedidos, onFetchCardapio,onFetchUsers,onFechar_aberto,onUsers_funcGet,onPaes }: any) => {
  const [loaded, setLoaded] = useState(false);
  const [loaded1, setLoaded1] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let subs = true;
    if (progress < 1 && progress !== 0) {
      setTimeout(() => {
        if (subs) {
          setProgress(progress + 0.1);
        }
      }, 100);
    }
   
    return () => {
      subs = false;
    };
  }, [progress]);

  useEffect(()=>{
    setProgress(0.1);
  },[])

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Aguarde a verificação da autenticação.
        const authenticated: any =  auth_user();

        // Aguarde 2 segundos para exibir a tela de carregamento.
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Se o usuário estiver autenticado e ainda não carregou os dados
        if (authenticated && !loaded) {
          // funcoes q retornam pedidos cardapio e users
          await onFetchPedidos();
          await onFetchCardapio();
          await onFetchUsers();
          await onFechar_aberto();
          await onUsers_funcGet();
          await onPaes();
          
          // Atualize o estado para evitar o loop
          setLoaded(true);
          
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };

    // Chame a função de verificação da autenticação.
    checkAuthentication();
  }, [loaded]);

  useEffect(() => {

    // console.log(pedidos)
    // Se os pedidos foram carregados e existem pedidos
    if (loaded && loaded1 && cardapio !== undefined && pedidos !== undefined) {
      // console.log('rafa tava certo caraio')
      navigation.replace('Pedidos');
      setLoaded1(false)
    }
  }, [pedidos,cardapio]);
 

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/image/icone.png')} style={styles.image} />
      <Text style={styles.header}>Madrugão</Text>
      <LinearProgress
        style={{ marginVertical: 10 }}
        value={progress}
        variant="determinate"
        color='#DE6F00'
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202124',
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 50,
    fontFamily: 'Lato-Thin',
    color: '#F4F7FC',
  },
});

const mapStateToProps = ({ cardapio, pedidos }: { cardapio: any, pedidos: any }) => {
  return {
    cardapio: cardapio.cardapio,
    pedidos: pedidos.pedidos,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onFetchPedidos: () => dispatch(startPedidosListener()),
    onFetchCardapio: () => dispatch(startCardapio()),
    onFetchUsers: () => dispatch(startUsers()),

    onFechar_aberto: () => dispatch(startfechado_aberto()),
    onUsers_funcGet:()=>dispatch(fetchuser_func_get()),
    onPaes : () => dispatch(startpaesListeners())

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
