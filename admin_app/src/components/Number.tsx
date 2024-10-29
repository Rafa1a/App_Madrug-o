import React from 'react';
import {  StyleSheet, View, Text } from 'react-native';
import { NumeroProps } from '../interface/inter';
import { SafeAreaView } from 'react-native-safe-area-context';

// Numero Da mesa Componente
export default class Numero extends React.Component<NumeroProps> {
  render() {
    // condicao de style se esta em primeiro ou nao 
    const stilo_pedidos =  <View style={this.props.styles?styles.circleindex0:styles.circle}>
    <Text style={this.props.styles?styles.textindex0:styles.text}>{this.props.number.toString()}</Text>
  </View>
  // condicao de tamanho (maior ou menor) Boolean para saber se é componente ou a tela de nevagacao Pedido
  const stilo_pedido = <View style={styles.circle_pedido}>
  <Text style={styles.text_pedido}>{this.props.number.toString()}</Text>
</View>
    return (
      <SafeAreaView style={styles.container}>
        {this.props.pedido_tamanho?stilo_pedido:stilo_pedidos}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width:'46%',
    aspectRatio: 1,
  },
  circle: {
    width: 46,
    height: 46,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E8F0FE',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  },
  text: {
    fontSize: 20,
    color: '#E8F0FE',
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
  textindex0: {
    fontSize: 20,
    color: '#3C4043',
  },
  circle_pedido: {
    width: "80%",
    height: "80%",
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#E8F0FE',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_pedido: {
    fontSize: 60,
    fontFamily:"OpenSans-Bold",
    color: '#E8F0FE',
  
  },
});
