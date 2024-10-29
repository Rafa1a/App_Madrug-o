import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import Number from '../Number';
import { pedido_props } from '../../interface/inter';
import { connect } from 'react-redux';
import { fetchExcluirPedido_Mesa } from '../../store/action/pedidos';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetch_mesa_status_user_call } from '../../store/action/mesas';
import { fetch_user_call } from '../../store/action/user';

const Pedido = (props: pedido_props) => {
 
 
  // console.log(props.user_login.uid)
 
  //styles seria preto ou branco 
  // styles diz se esta em primeiro ou nao na ordem de pedidos || refere a cor pois o primeiro item o funco é branco e o restante é preto ...
  const userormesa = props.styles?
  <Number number={props.numero_mesa} styles/>
  :
  <Number number={props.numero_mesa} />

  // busacar id em entregando do user q esta atentendo o pedido (mesa) especifica
  // usar para aparecer a imagem.

  const numero_mesa_user_entregando = props.users.find(user => {
    return user.entregando?.includes(props.id)
  })

  const func_click = () => {
    const itemId = props.id;
  
    // Verifica se o item já está presente no array
    const isItemPresent = props.state_click.includes(itemId);
    
    // Verfica se o numero da mesa é igual aos q estao presentes
    const array_state = props.state_all_array.find(item => {
      return props.state_click.some(i=> item.id=== i)
    })
    
    const user_logado = props.users.find(user => user.uid === props.user_login.uid)
    /////////////////////////////////////////////////////////////////////////
    // verifica se ja esta sendo atendido por outro user
    if(numero_mesa_user_entregando && numero_mesa_user_entregando?.uid !==  user_logado?.uid){
      return Alert.alert(`Esta sendo atendido por ${numero_mesa_user_entregando?.name_func}`)
    }
    /////////////////////////////////////////////////////////////////////////
    //verifica se o array state estiver undefinid pode adicionar pq esta vazio ou se for o mesmo numero de mesa. 
    // else if(array_state?.numero_mesa === props.numero_mesa || !array_state ){
      // Cria uma cópia do array atual
      const newArray = [...props.state_click];
      if (isItemPresent) {
        // Se o item já está presente, remove-o
        const index = newArray.indexOf(itemId);
        newArray.splice(index, 1);
      } else {
        // Se o item não está presente, adiciona-o
        newArray.push(itemId);
      }
    // Atualiza o estado com o novo array

      props.setState_click(newArray);

    // }
    /////////////////////////////////////////////////////////////////////////
    // se não for o mesmo numero de mesa :
    // else {
    //   Alert.alert('Você só pode atender o mesmo numero de mesa, de uma unica vez')
    // }
    // console.log(props.state_click);
  };

  return  (
      
    <View style={styles.containerM}>
      <TouchableOpacity onPress={func_click}>
        <View style={props.styles?styles.containerindex0:styles.container}>
          <View style={styles.content}>
            {userormesa}
            {props.status?null:<Text style={{marginLeft:30,color:"#f10404"}}>{props.ordem}</Text>}
          </View>
        </View>
        
        {props.chapeiro?
        <Avatar size={35} source={require('../../assets/image/lanche.png')} 
          containerStyle={{
            position:'absolute',
            bottom:5,
            right:70
          }}/>:null
        }
        {props.porcoes?
        <Avatar size={35} source={require('../../assets/image/porcao.png')} 
          containerStyle={{
            position:'absolute',
            bottom:5,
            right:70
          }}/>:null
        }
        {props.drinks?
        <Avatar size={35} source={require('../../assets/image/drink.png')} 
          containerStyle={{
            position:'absolute',
            bottom:5,
            right:70
          }}/>:null
        }
      </TouchableOpacity>
      {props.chapeiro? 
      null:numero_mesa_user_entregando?
      <Avatar
        size={100}
        rounded
        source={{uri:numero_mesa_user_entregando.image_fun}}
        containerStyle={{
          width: 45,
          margin: 7,
          aspectRatio: 1,
        }}
      />:null}
    </View>
  
  );
};

const styles = StyleSheet.create({
  containerM: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height:Dimensions.get('window').width*1/5.5,
    width: "100%",
    marginBottom:30,
  },
  container: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3C4043',
    borderRadius: 50,
    height:Dimensions.get('window').width*1/7,
    width: Dimensions.get('window').width/1.6
  },
  containerindex0: {
    
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F7FC',
    borderRadius: 50,
    height:Dimensions.get('window').width*1/5.5,
    width: Dimensions.get('window').width/1.29,
    marginRight:"10%",
    marginLeft:"10%",
    
  },
 
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  text: {
    fontFamily:"RobotoMono-Bold",
    color: '#E8F0FE',
  },
  textindex0: {
    fontFamily:"RobotoMono-Bold",
    color: '#3C4043',
  },
  numbers: {
    width:'38%',
    aspectRatio: 1,
  },
  outros: {},
});


const mapStateProps = ({ user }: {  user: any}) => {
  return {
    user_login:user.user,
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onUpMesa_user_call: (id:string) => dispatch(fetch_mesa_status_user_call(id)),
    onUpUser_call: (id:string,number:number) => dispatch(fetch_user_call(id,number)),
  };
};
export default connect(mapStateProps, mapDispatchProps)(Pedido)
 