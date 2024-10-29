import { Button, Divider } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Loja_up, controle_caixa_add, set_Abertura_valor } from '../store/action/message_fechado_aberto';
import { connect } from 'react-redux';
import { deletePedidos } from '../store/action/pedidos';
import { fetchAtualizarCardapioIdPedidosLimpeza } from '../store/action/cardapio';
import { fetchAtualizarUserLimpeza } from '../store/action/user';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Controle_caixa_props {
    route:RouteProp<any, any>
    navigation:NavigationProp<any>

}
const Controle_caixa = (props: Controle_caixa_props) =>{
   

    ///////////////////Dados do caixa////////////////////////////////////
    const {data_abertura, data_fechamento, abertura, total, lucro, dinheiro_caixa, cartao_caixa, pix_caixa, pedidos} = props.route.params;
    
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView > 
            
            {/* data abertura */}
            <View
            style={{
                flexDirection: 'row',
                padding: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:18}}>Data de Abertura : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:17}}>{new Date(data_abertura).toLocaleString()}</Text>
            </View>
            {/* data abertura */}
            {/* data fechamento */}
            <View
            style={{
                flexDirection: 'row',
                padding: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:18}}> Fechamento : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:17}}>{new Date(data_fechamento).toLocaleString()}</Text>
            </View>
            {/* data fechamento */}

            <Divider style={{width:'100%',margin:2}}/>

            {/* Valor de abertura */}
            <View
            style={{
                flexDirection: 'row',
                padding: 20,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                margin: 10,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Abertura : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{abertura}</Text>
            </View>
            {/* Valor de abertura */}

            <Divider style={{width:'100%',margin:2}}/>

            {/* Total */}
            <View
            style={{
                flexDirection: 'row',
                padding: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Total : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{total}</Text>
            </View>
            {/* Total */}

            <Divider style={{width:'100%',margin:2}}/>

            {/* Lucro */}
            <View
            style={{
                flexDirection: 'row',
                padding: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Lucro : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{lucro}</Text>
            </View>
            {/* Lucro */}

            <Divider style={{width:'100%',margin:2}}/>

            {/* dinheiro vendas */}
            <View
            style={{
                flexDirection: 'row',
                padding: 5,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:19}}>Dinheiro : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{dinheiro_caixa}</Text>
            </View>
            {/* dinheiro vendas */}

            {/* cartao vendas */}
            <View
            style={{
                flexDirection: 'row',
                padding: 5,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:19}}>Cartão : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{cartao_caixa}</Text>
            </View>
            {/* cartao vendas */}
            
            {/* pix vendas */}
            <View
            style={{
                flexDirection: 'row',
                padding: 5,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderRadius: 5,
                // Adicione outros estilos conforme necessário
            }}
            >
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:19}}>Pix : </Text>
                <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{pix_caixa}</Text>
            </View>

            {/* pix vendas */}
            {/* Lista pedidos */}
           

            <FlatList
                data={pedidos.sort((a:any,b:any)=>a.ordem-b.ordem)}
                renderItem={({ item }) => {
                    const totalValue = item.itens.reduce((acc:any, current:any) => acc + (current.valor_p*current.quantidade||1), 0);
                    const pagamento = () => {
                        if (item.localidade === 'MESA'){
                            if(item.dinheiro_mesa)return 'Dinheiro'
                            if(item.pix_mesa)return 'Pix'
                            if(item.cartao_mesa)return 'Cartão'
                        }else {
                            if(item.dinheiro)return 'Dinheiro'
                            if(item.pix)return 'Pix'
                            if(item.cartao?.elo || item.cartao?.mastercard || item.cartao?.visa)return 'Cartão'
                        }
                    }
                    return (
                        <View style={{flexDirection:'column', justifyContent: 'space-between', backgroundColor: '#333', padding: 10, marginVertical: 5, borderRadius: 5}}>
                            <View style={{flexDirection:'row', justifyContent: 'space-between', backgroundColor: '#3C4043', padding: 10, marginVertical: 5, borderRadius: 5}}>
                                <View style={{flexDirection:'column'}}>
                                {(item.pegar_local ===false || item.pegar_local === undefined) && item.localidade !== 'MESA'? 
                                    <Text style={{color:'red'}}>Entrega: + 5</Text>: null}
                                    {(item.pegar_local ===false || item.pegar_local === undefined) && item.localidade !== 'MESA'? <Text style={{color:'white', fontSize: 16}}>Valor total : {totalValue + 5}</Text>:<Text style={{color:'white', fontSize: 16}}>Valor total : {totalValue}</Text>}
                                </View>
                                <Text style={{color:'white', fontSize: 16}}>pagamento : {pagamento()} </Text>
                            </View>
                            <Text style={{color:'white', fontSize: 16}}>Ordem : {item.ordem}</Text>
                        </View>
                    );
                }}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
            />
        </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#202124',
      },
});

const mapStateProps = ({pedidos,message ,fechado_abertura}: {pedidos:any,message:any,fechado_abertura:any }) => {
    return {
      fechado_aberto: message.fechado_aberto,
      pedidos: pedidos.pedidos,
      abertura_valor: fechado_abertura.abertura_valor
    };
  };
  const mapDispatchProps = (dispatch: any) => {
    return {
      onFechar_abrir: (id:string,fechado_aberto:any,data_fechado_aberto:any,abertura:number) => dispatch(Loja_up(id,fechado_aberto,data_fechado_aberto,abertura)),
      setAbertura_valor: (valor:any) => dispatch(set_Abertura_valor(valor)),
      onControle_caixa_add : (
        data_abertura:number,
        data_fechamento:number,
        abertura:number,
        total:number,
        lucro:number,
        dinheiro_caixa:number,
        cartao_caixa:number,
        pix_caixa:number,
        pedidos:any ) => dispatch(controle_caixa_add(data_abertura,data_fechamento,abertura,total,lucro,dinheiro_caixa,cartao_caixa,pix_caixa,pedidos)),
        onDelete_all:() => dispatch(deletePedidos()),
        onAtualizar_is_pedidos_cardapio:()=>dispatch(fetchAtualizarCardapioIdPedidosLimpeza()),
        onAtualizar_user_Limpeza:()=>dispatch(fetchAtualizarUserLimpeza())
    };
  };
  
  export default connect(mapStateProps,mapDispatchProps)(Controle_caixa);