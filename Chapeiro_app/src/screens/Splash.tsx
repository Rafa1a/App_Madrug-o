import React, { useEffect, useState } from 'react';
import {  StyleSheet, Text } from 'react-native';
import { Image, LinearProgress } from '@rneui/themed';

import { auth_user } from '../store/auth';
import { connect } from 'react-redux';
import { startPedidosListener } from '../store/action/pedidos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { startUsers } from '../store/action/user';

const Splash = ({ navigation,onFetchPedidos,onFetchUser,pedidos }: any) => {

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
        const authenticated: any = auth_user();

        // Aguarde 2 segundos para exibir a tela de carregamento.
        await new Promise(resolve => setTimeout(resolve, 2000));

        // chamada para validar e recuperar os pedidos no back-end

        if (authenticated && !loaded) {
          onFetchUser()
          onFetchPedidos();
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
    // Se os pedidos foram carregados e existem pedidos
    // console.log(pedidos)
    if (loaded && loaded1 && pedidos !== undefined) {
    // adicionar os usuarios online q fizeram pedidos como nome image ect..
          setLoaded1(false)
          navigation.replace('Pedidos');
    }
  }, [pedidos]);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/image/chapeiro_icone.png')} style={styles.image} />
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
const mapStateProps = ({ pedidos,  }: { pedidos: any; }) => {
  return {
    pedidos: pedidos.pedidos,
  };
};

const mapDispatchProps = (dispatch: any) => {
  return {
    onFetchPedidos: () => dispatch(startPedidosListener()),
    onFetchUser: () => dispatch(startUsers()),
    
  };
};

export default connect(mapStateProps,mapDispatchProps)(Splash);
