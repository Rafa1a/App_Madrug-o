import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Image, LinearProgress } from '@rneui/themed';
import { connect } from 'react-redux';
import { startCardapio } from '../store/action/cardapio';
import { startPedidosListener } from '../store/action/pedidos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { startUser_func } from '../store/action/user';
import { startMesas } from '../store/action/mesas';
import { startpaesListeners } from '../store/action/paes';

const Splash = ({ navigation, pedidos, cardapio, onFetchPedidos, onFetchCardapio,onFetchUser_func,onFetchMesas,OnFetchPaes }: any) => {
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

        if (!loaded) {
          // funcoes q retornam pedidos cardapio e users
          await onFetchPedidos();
          await onFetchCardapio();
          await onFetchUser_func();
          await onFetchMesas();
          await OnFetchPaes();
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
      <Image source={require('../assets/image/splash.png')} style={styles.image} />
      <Text style={styles.header}>Madrugão</Text>
      <ActivityIndicator size={"large"} color='tomato'/>
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
    onFetchUser_func: () => dispatch(startUser_func()),
    onFetchMesas: () => dispatch(startMesas()),
    OnFetchPaes : () => dispatch(startpaesListeners())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
