import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NumeroProps } from '../interface/inter';

// Numero Da mesa Componente
const Numero = (props: NumeroProps) => {
  // Condição de style se está em primeiro ou não  ///////////////ponto para mudar de cor
  const stilo_pedidos = (
    <View style={props.styles ? styles.circleindex0 : styles.circle}>
      <Text style={styles.text}>
        {props.number.toString()}
      </Text>
    </View>
  );
  // Condição de tamanho (maior ou menor)
  // Boolean para saber se é componente ou a tela de navegação Pedido
  return (
    <View style={styles.container}>
      {stilo_pedidos}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '46%',
    aspectRatio: 1,
  },
  circle: {
    width: 46,
    height: 46,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3C4043',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  text: {
    fontSize: 20,
    color: '#3C4043',
  },
  circleindex0: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3C4043',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default Numero;
