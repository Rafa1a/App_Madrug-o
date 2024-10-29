import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '@rneui/themed';
import Number from './Number';
import { pedido_props } from '../interface/inter';
import { connect } from 'react-redux';

const Pedido = (props: pedido_props) => {

     
  // Usuário ou mesa como retorno da const 
  const userormesa = props.numero_mesa ?
    // Styles seria preto ou branco 
    props.styles ? 
    <Number number={props.numero_mesa} styles /> :
     <Number number={props.numero_mesa} /> 
    :
    <Avatar
      size={100}
      rounded
      // Tem imagem do usuário? Se não, usa o ícone de anônimo           ///////////////ponto para mudar de cor
      source={props.image_on ? { uri: props.image_on } : undefined}
      icon={!props.image_on ? { name: 'account-circle', type: 'material-icons', color:  '#3C4043' } : undefined}
      containerStyle={{
        width: props.image_on ? 50 : 60,
        margin: props.image_on ? 7 : null,
        aspectRatio: 1,
      }}
    />;
  
  // Se tem o nome ou não         ///////////////ponto para mudar de cor
  const username = props.name_on ? <Text style={styles.text}>{props.name_on}</Text> : null;
  
  // Styles diz se está em primeiro ou não na ordem de pedidos ou refere a cor, pois o primeiro item o fundo é branco e o restante é preto
  const icon_lanche = props.styles ? 
  <Avatar size={60} source={props.chapeiro? require('../../assets/icones/lanche.png'): props.drinks?require('../../assets/icones/drink.png'):props.porcoes?require('../../assets/icones/porcao.png'):null} 
    containerStyle={{
      position: 'absolute',
      bottom: 5,
      right: 20,
    }} /> : null;

  return (
    <View style={[styles.containerM,]}>
      {/* ///////////////ponto para mudar de cor */}
        <View style={[props.styles ? styles.containerindex0 : styles.container,{elevation:5}]}> 
          <View style={styles.content}>
            {userormesa}
            {username}
          </View>
          {icon_lanche}
          {/* {props.styles ? <View
            style={{
              position: 'absolute',
              top: 56,
              right: 25,
              zIndex: 1,
              backgroundColor: '#0000001a',
              borderRadius: 25,
              width: 50,
              height: 15,
            }}
          /> : null} */}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerM: {
    margin: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Dimensions.get('window').width * 1 / 5.5,
    width: '100%',

  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4f7fc',
    borderRadius: 50,
    height: Dimensions.get('window').width * 1 / 7,
    width: Dimensions.get('window').width / 1.6,

  },
  containerindex0: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafd',
    borderRadius: 50,
    height: Dimensions.get('window').width * 1 / 5.5,
    width: Dimensions.get('window').width / 1.29,
    marginRight: '10%',
    marginLeft: '10%',
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'RobotoMono-Bold',
    color: '#3C4043',
  },
  //nao usado
  textindex0: {
    fontFamily: 'RobotoMono-Bold',
    color: '#3C4043',
  },
});
const mapDispatchProps = (dispatch: any) => {
  return {
    
  
  };
};
export default connect(null,mapDispatchProps)(Pedido)
