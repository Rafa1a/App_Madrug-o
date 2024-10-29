import React, { useEffect, useState } from 'react';
import {  StyleSheet, Text, View, FlatList, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { setPedidos_MESA, setPedidos_MESA_status_true} from '../store/action/pedidos';
import Pedido from '../components/Pedido'
import { pedido_inter, user_on } from '../interface/inter';
import Header from '../components/Header_pedidos';
import { NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  pedidos: pedido_inter[];
  pedidos_mesa:any
  pedidos_mesa_true:any
  onFetchCardapio:() => void
  onFetchPedidos_Mesa:(pedidos_mesa:any)=>void
  onFetchPedidos_Mesa_true:(pedidos_mesa:any)=>void
  name_on?: string;
  image_on?:string;
  status_chapeiro?:boolean;
  users:user_on[];
  navigation: NavigationProp<any,any>;
}
const Pedidos = ({ pedidos,pedidos_mesa,pedidos_mesa_true,onFetchPedidos_Mesa,onFetchPedidos_Mesa_true,navigation }:Props) => {

  // chamada para validar e recuperar os pedidos no back-end 
  //esta sendo feito no APP principal
  // useEffect(() => {

  //   onFetchPedidos();
  //   onFetchCardapio();
    
  // }, []);
  
  // // adicionar os usuarios online q fizeram pedidos como nome image ect..
  // esta sendo atualizado no onSnapshot
  // useEffect(() => {
  //   pedidos.forEach((item) => {
  //     if (item.localidade === 'ONLINE' && item.id_user) {
  //       onFetchUser()
  //     }
  //   });
  // }, [pedidos]);
  
// logica para separar os pedidos de Mesa em um novo array :

// id:cur.id, ids:[cur.id],status:false,localidade:'MESA', numero_mesa: cur.numero_mesa, itens_all: [{ itens: cur.itens }]


  // recuperar pedido e  agrupar pedidos do mesmo numero de mesa
  useEffect(()=>{
    
    const pedidosMesa = pedidos.filter((item: pedido_inter) => item.localidade === 'MESA' && item.status===false);

    const pedidosAgrupados:pedido_inter[] = pedidosMesa.reduce((acc:any, cur:any,index) => {

      const found = acc.find((item:any) => item.numero_mesa === cur.numero_mesa);
      
      if (found) {
        found.itens_all.push({ itens: cur.itens});
        found.ids.push(cur.id);
        
      } else {
        acc.push({id:cur.id, ids:[cur.id],status:false,localidade:'MESA', numero_mesa: cur.numero_mesa, itens_all: [{ itens: cur.itens }] } );
      }
      acc.sort((a:any, b:any) => a.numero_mesa - b.numero_mesa)
      return acc;
    }, []);
    
    // console.log(pedidosAgrupados[0]);
    onFetchPedidos_Mesa(pedidosAgrupados)
  }, [pedidos])
  //ids de pedidos agrupados status === true lista de pedidos finalizados
  useEffect(() => {
    const pedidosMesa = pedidos.filter((item: pedido_inter) => item.status===true && item.localidade==='MESA');
    // console.log(pedidosMesa)
    const pedidosAgrupados:any = pedidosMesa.reduce((acc:any, cur:any) => {
      const found = acc.find((item:any) => item.ids?.some(id => id === cur.id));      
      // console.log('n',found)
      if (found) {
        found.itens_all.push({ itens: cur.itens});
        if (!found.ids.includes(cur.id)) {
          found.ids.push(cur.id);
        }
      } else {
        acc.push({
          id:cur.id, 
          ids:[...cur.list_ids || [cur.id]],
          status:false,
          numero_mesa: cur.numero_mesa, 
          itens_all: [{ itens: cur.itens }],
        });
      }
      // console.log(acc)
      return acc;
    }, []);
    // console.log('pedidos_agrupados',pedidosAgrupados[1].ids.join('')) 
    pedidosAgrupados.sort((a:any, b:any) => a.numero_mesa - b.numero_mesa)
    onFetchPedidos_Mesa_true(pedidosAgrupados)
  }, [pedidos]) 
  // console.log('pedidos_mesa',pedidos_mesa) 
  return (
    <SafeAreaView style={styles.container}>
   
      <Header mesa navigation={navigation} />
      
      <FlatList
        style={{flex:1}}
        
        data={pedidos_mesa}
        //item ja retorna apenas os status_chapeiro de acordo com o back0end query
        keyExtractor={item => `${item.id}`}
        renderItem={({ item,index }) => {
            
            // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
            if (item.localidade === 'MESA') {
            
              if(item.status===false) {

                return <Pedido ids={item.ids} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} ordem={item.ordem} {...item}/>;

              }
              // else return <Pedido ids={item.ids} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} ordem={item.ordem} {...item}/>;
              
            } 
          return null;
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      <FlatList
        style={{flex:1}}
        data={pedidos_mesa_true}
        //item ja retorna apenas os status_chapeiro de acordo com o back0end query
        keyExtractor={item => `${item.id}`}
        renderItem={({ item,index }) => {
            // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
              return <Pedido ids={item.ids} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} list_ids_boolean {...item}/>;
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  
});

const mapStateProps = ({ pedidos, user }: { pedidos: any, user: any}) => {
  return {
    pedidos: pedidos.pedidos,
    users:user.users,
    pedidos_mesa:pedidos.pedidos_mesa,
    pedidos_mesa_true:pedidos.pedidos_mesa_true

  };
};


const mapDispatchProps = (dispatch: any) => {
  return {
    onFetchPedidos_Mesa: (pedidos_mesa:any) => dispatch(setPedidos_MESA(pedidos_mesa)),
    onFetchPedidos_Mesa_true: (pedidos_mesa:any) => dispatch(setPedidos_MESA_status_true(pedidos_mesa))
  };
};

export default connect(mapStateProps, mapDispatchProps)(Pedidos);
