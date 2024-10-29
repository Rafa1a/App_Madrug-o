import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon } from '@rneui/themed';
import Number from '../Number';
import { pedido_props } from '../../interface/inter';
import { connect } from 'react-redux';
import { fetch_mesa_status_user_call } from '../../store/action/mesas';
import { fetch_user_call } from '../../store/action/user';

const Pedido = (props: pedido_props) => {
  const [numero_mesa_user_call, setNumero_mesa_user_call] = useState<any>([]) 
  const [user_logado, setUser_logado] = useState<any>([]) 
  useEffect(()=>{
    const numero_mesa_user_call_ = props.users.find(user => user.call === props.numero_mesa || null)
    const user_logado_ = props.users.find(user => user.uid === props.user_login.uid)

    setNumero_mesa_user_call(numero_mesa_user_call_)
    setUser_logado(user_logado_)
  },[props.users])
 
  // console.log(props.user_login.uid)
 
  //styles seria preto ou branco 
  // styles diz se esta em primeiro ou nao na ordem de pedidos || refere a cor pois o primeiro item o funco é branco e o restante é preto ...
  const userormesa = props.styles?
  <Number number={props.numero_mesa} styles/>
  :
  <Number number={props.numero_mesa} />

  

  //atualizar os status_call para false e status_user_call para false e ainda atualizar para call 0 o valor no user, ou seja resetar os valores para ele pode fazer novos atendimentos
  const func_Uptades = () => {
    
      // console.log(user_logado) 

    console.log(numero_mesa_user_call)
    // caso ja esteja sendo atendido
    if(numero_mesa_user_call && numero_mesa_user_call.uid !== user_logado.uid){
      Alert.alert(`Esta sendo atendido por ${numero_mesa_user_call.name_func}`)
    }
    else if(user_logado.call === 0 || user_logado.call === undefined){
      props.onUpMesa_user_call(props.id) 
      // console.log(user_logado)
      props.onUpUser_call(user_logado.id,props.numero_mesa)
      props.setIdstate(props.id)

    } //caso ainda nao finalizou o atendimento
    else {
      Alert.alert('Finalize o Atendimento para mudar')
    }
   
  }

  return  (
      
    <View style={styles.containerM}>
      <TouchableOpacity onPress={func_Uptades}>
        <View style={props.styles?styles.containerindex0:styles.container}>
          <View style={styles.content}>
            {userormesa}
            {props.status?null:<Text style={{marginLeft:30,color:"#f10404"}}>{props.ordem}</Text>}
          </View>
        </View>
      </TouchableOpacity>
      {props.user_call? numero_mesa_user_call?
      <Avatar
        size={100}
        rounded
        source={{uri:numero_mesa_user_call.image_fun}}
        containerStyle={{
          width: 45,
          margin: 7,
          aspectRatio: 1,
        }}
      />:null
      :null}
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
    width: "100%"
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
 