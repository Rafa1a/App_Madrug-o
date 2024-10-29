import React, { useEffect, useState } from 'react';
import {  StyleSheet, Text, View, FlatList, Dimensions, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { setPedidos_MESA,startPedidosListener} from '../store/action/pedidos';
import { Mesas, pedido_inter, user_fun } from '../interface/inter';
import Header from '../components/headers/Header_pedidos';
import { NavigationProp } from '@react-navigation/native';
import Call_cliente from '../components/call_entrega/Call_cliente';
import { Feather } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { fetch_user_call } from '../store/action/user';
import { fetch_mesa_status_call } from '../store/action/mesas';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  status_chapeiro?:boolean;
  users:user_fun[];
  mesas:Mesas[]
  navigation: NavigationProp<any,any>;
  user_login:user_fun;
  onUpUser_call:(id:string,number:number) =>void
  onUpMesa_user_call:(id:string) =>void
  pedidos_mesa:any

}
const Pedidos = ({ mesas, users,user_login,pedidos_mesa,navigation,onUpUser_call,onUpMesa_user_call }:Props) => {
  // console.log(users);
  // console.log(mesas);
  //funcao para atualizar o estado do usario :
  const [idstate, setIdstate] = useState<string>("") 
  const [user_logado, setUser_logado] = useState<any>([]) 
  const [numero_mesa_, setNumero_mesa_] = useState<any>([]) 
  const [pedido_mesa_finalizar, setPedido_mesa_finalizaro] = useState<any>([]) 
  
  //condicao caso ja esteja fazendo um atendimento 
  useEffect(()=>{
    // funcoes para uso
    const user_logado_ = users.find(user => user.uid === user_login.uid)
    const numero_mesa__ = idstate?mesas.find(mesa=>mesa.id === idstate):null
    const pedido_mesa_finalizar = numero_mesa__?pedidos_mesa.find(mesa => mesa.numero_mesa === numero_mesa__.numero_mesa):null

    setUser_logado(user_logado_)
    setNumero_mesa_(numero_mesa__)
    setPedido_mesa_finalizaro(pedido_mesa_finalizar)
    // console.log(user_logado)
    //caso o user esteja atendendo
    if(user_logado_.call !== 0 && user_logado_.call !== undefined){
      const numero_mesa__ = mesas.find(mesa=>mesa.numero_mesa === user_logado_.call)
      //definir o estado
      setIdstate(numero_mesa__.id)
    } 

  },[idstate])  
  // console.log("user logado", user_logado)
  // console.log("state id ", idstate)
  //funcao para atualizar mesa e users para finalizar o atendimento.
  const func_update_x = async () => { 
    if(idstate){
      // console.log(idstate)
      await onUpUser_call(user_logado.id, 0)
      await onUpMesa_user_call(idstate)
      setIdstate('')
    }else {
      Alert.alert("Escolha uma Chamada")
    }
  } 
  console.log(numero_mesa_)
  // console.log(pedidos_mesa)

  // console.log(pedido_mesa_finalizar) 

  // navegar para a listagem dos pedidos podendo mudar o status do pedido para finalizado
  const func_pedido_finalizar = () =>{
    if(pedido_mesa_finalizar){
      navigation.navigate('Pedido',{ 
        ids: pedido_mesa_finalizar.ids,
        numero_mesa: pedido_mesa_finalizar.numero_mesa, 
        })
    }else {
      Alert.alert("Cliente não tem Pedido")
    }
  }
  //adicionar novos itens
  const func_pedido_adicionar = () =>{
    navigation?.navigate('Adicionar', { numero_mesa: numero_mesa_.numero_mesa, mesa:true });
  }
  // console.log(pedidos_mesa)
  return (
    <SafeAreaView style={styles.container}>
   
      <Header call navigation={navigation} />
      
      <FlatList
        data={mesas.filter(item => item.status_call===true)}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item,index }) => {
            // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
               if(item.status_user_call === true){
                return <Call_cliente  user_call users={users} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} setIdstate={setIdstate} />;
              }else {
                return <Call_cliente   users={users} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} setIdstate={setIdstate} />;
              }
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {idstate?
      <View style={styles.container_Buttons}>
        <MaterialCommunityIcons name="playlist-edit" size={35} color="tomato" onPress={func_pedido_finalizar}/>
        <Fontisto name="shopping-basket-add" size={45} color="tomato" onPress={func_pedido_adicionar}/>
        <Feather name="x-octagon" size={30} color="tomato"  onPress={func_update_x}/>
      </View>:null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#202124',
    width:"100%",
    
   
  },
  separator: {
    height: 30,
    width: '100%',
    backgroundColor: 'transparent',
  },
  container_Buttons: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity:0.8
  },
  
});

const mapStateProps = ({ pedidos, user }: {  pedidos: any, user: any}) => {
  return {
    mesas:pedidos.mesas,
    users:user.users,
    user_login:user.user,
    pedidos_mesa:pedidos.pedidos_mesa
  };
};


const mapDispatchProps = (dispatch: any) => {
  return {
    onUpMesa_user_call: (id:string) => dispatch(fetch_mesa_status_call(id)),
    onUpUser_call: (id:string,number:number) => dispatch(fetch_user_call(id,number)),
  };
};
export default connect(mapStateProps, mapDispatchProps)(Pedidos);
