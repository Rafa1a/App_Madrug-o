/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Switch } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {  fetchPedidos_ordem_adicionar, fetchPedidos_ordem_retirar } from '../store/action/pedidos';



 const mini_lista = (props: any) => {
    //switch bebidas
    // const [bebidas, props.setBebidas] = React.useState(false);
        //atualiar bebidas bolean
    useEffect(() => {
      console.log('item :',props.item.id)
      const bebidas_bolean = props.array_bebidas?.includes(props.item.id)
      console.log('bebidas_bolean',bebidas_bolean)
      props.item.categoria === 'bebidas'?props.setBebidas(bebidas_bolean):null 
      console.log('////////////////////////////// :')

    }, [props.array_bebidas]);

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
      const func = async () => {
        if(props.bebidas){
          if(props.item.categoria === 'bebidas'){
            await props.onFetchPedidos_ordem_adicionar(props.item.id,props.id_pedido);
            setDataLoaded(true);
          }
        }
      }
      func();
    }, [props.bebidas]);

    useEffect(() => {
      if (dataLoaded) {
        const bebidas_bolean = props.array_bebidas?.includes(props.item.id);
        props.item.categoria === 'bebidas'?props.setBebidas(bebidas_bolean):null 
      }
    }, [dataLoaded]);
    
    return (
        <View style={styles.container_lista_miniindex0}>

            <Text style={{fontFamily:'Roboto-Regular',color:'#fff',fontSize:17}} >{props.item.name_p}</Text>
        
            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor: '#5e6163',borderRadius:20,width:'50%'}}
            onPress={() => props.item.categoria === 'bebidas'?props.setBebidas(true):null}
            >
                <Text style={{fontFamily:'Roboto-Regular',color:'#fff',fontSize:15}}
                numberOfLines={1} 
                ellipsizeMode='tail'
                >x{props.item.quantidade}</Text>

                {props.item.categoria === 'bebidas'?
                <Switch
                value={props.bebidas}
                onValueChange={() => props.setBebidas(true)}
                />: null
                }
            </TouchableOpacity>
            {props.item.adicionar_p?
            <>
                <Text style={{fontFamily:'Roboto-Regular',color:'#FFFF',fontSize:17}}>
                    Adicionar :
                </Text>
                <Text style={{fontFamily:'Roboto-Regular',color:'#49d810',fontSize:16}}
                numberOfLines={1} 
                ellipsizeMode='tail'
                >
                    {props.item.adicionar_p?.join(', ')}
                </Text>
            </>:null}
            {props.item.retirar_p? 
            <>
              <Text style={{fontFamily:'Roboto-Regular',color:'#FFFF',fontSize:17}}>
                  Retirar :
              </Text>
              <Text style={{fontFamily:'Roboto-Regular',color:'#d84910',fontSize:16}}
              numberOfLines={1} 
              ellipsizeMode='tail'
              >
                  {props.item.retirar_p?.join(', ')}
              </Text>
            </>
            :null}
           <Text style={{fontFamily:'Roboto-Regular',color:'#FFFF',fontSize:17}}>----------------------------------</Text>
        </View>
    );
}


const styles = StyleSheet.create({
      container_lista_miniindex0: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    
        height:"100%",
        width: "100%"
      },
});
const mapDispatchProps = (dispatch: any) => {
  return {
    onFetchPedidos_ordem_adicionar: (id_item:string,id_pedido:string,) => dispatch(fetchPedidos_ordem_adicionar(id_item,id_pedido)),
    onFetchPedidos_ordem_retirar: (id_item:string,id_pedido:string,) => dispatch(fetchPedidos_ordem_retirar(id_item,id_pedido)),
    
  };
};

export default connect(null,mapDispatchProps)(mini_lista)