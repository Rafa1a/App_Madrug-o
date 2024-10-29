import React, { useEffect, useRef } from 'react';
import {
    FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  ScrollView
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import Flatlist_lista_itens from '../components/Flatlist_lista_itens';
import { Item, pedido_inter, user_on } from '../interface/inter';
import { addItemToPedidos, setAdicionar_itens } from '../store/action/adicionar_pedido';


interface props_carrinho {
  navigation?:any
  user_info?:user_on
  adicionar_itens?:Item[]

  pedidos?:pedido_inter[]

  onAddItemToPedidos?: (item:pedido_inter) => void;

  onSetAdicionar_itens?: (item:Item[]) => void;

}

function Carrinho(props: props_carrinho) {
  const animation = useRef(null);
  const [pedido_online, setPedido_online] = React.useState([]);
  const [pedido_on_taxa, setPedido_on_taxa] = React.useState<pedido_inter>();
  const [pedido_mesa, setPedido_mesa] = React.useState([]);

  useEffect(() => {
      //online
      const pedido_online = props.pedidos?.find((item)=>item.id_user === props.user_info?.id && item.status === false)
      // console.log([pedido])
      setPedido_online(pedido_online?.itens || [])
      setPedido_on_taxa(pedido_online)
      //online
      //mesa
      if(props.user_info?.status_mesa === true){
        const pedido_mesa = props.pedidos?.filter((item)=>item.numero_mesa === props.user_info?.mesa && item.status === false)
        // console.log(pedido_mesa)
        setPedido_mesa(pedido_mesa?.map((item)=>item.itens).flat() || [])
      }
      //mesa
      console.log(props.user_info.status_mesa )
  }, [])
  // achar pedido em pedidos para listar ONLINE
  // console.log(props.user_info.status_mesa)
  
  // achar pedido em pedidos para listar ONLINE

  // funtion calcular total
  function calcular_total(){
    if(props.user_info?.status_mesa === true){
      const total = pedido_mesa?.map((item)=>item.valor_p*item.quantidade).reduce((a,b)=>a+b,0)
      return total
    }else{
      const total = pedido_online?.map((item)=>item.valor_p*item.quantidade).reduce((a,b)=>a+b,0)
      return total
    }
  }
  
  return (
    <SafeAreaView style={{flex:1,width:'100%',backgroundColor:'#f8fafd'}}>
      <>
        <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow: 1}}  >
        
        {/* Flatlist itens */}
          <FlatList
              scrollEnabled={false}
              data={props.user_info.status_mesa?pedido_mesa:pedido_online}
              renderItem={({ item,index }) => (
              <Flatlist_lista_itens item={item}/>
              )}
              keyExtractor={(item,i) => i.toString()}
              // contentContainerStyle={{flex:1,width:'100%',backgroundColor:'#f8fafd' }}
          />
          {/* Flatlist itens */}
         
          </ScrollView>
          {/* total  */}
          <View style={styles.container_total}  >
            <Text style={styles.text_Total}>Total</Text>

            <View style={{flexDirection:'column',alignItems:'flex-end'}}>

              {props.user_info.status_mesa || pedido_on_taxa?.pegar_local? null:
                <Text style={{color:'red',fontSize:14}}>Taxa de Entrega +5 </Text>}

              <View style={{flexDirection:'row',alignItems:'flex-end'}}>

                  <Text style={[styles.text_valor,{fontSize:25}]}>R$: </Text>

                  {props.user_info.status_mesa || pedido_on_taxa?.pegar_local?
                  <Text style={styles.text_valor}>{calcular_total()}</Text>:
                  <Text style={styles.text_valor}>{calcular_total()+5}</Text>
                  }
              </View>
            </View>

          </View>
          {/* total  */}

      </>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container_total: {
    height: 50,

    alignItems:'center',
    justifyContent:'space-around',
    backgroundColor:'#f4f7fc',

    flexDirection:'row',

  },
  text_Total:{
    fontFamily:'OpenSans-Regular',
    fontSize:25,
    color:'#3C4043'

  },
  text_valor:{
    fontFamily:'OpenSans-Bold',
    fontSize:30,
    color:'#3C4043'
  },
  input: {
    alignItems:'center',
    justifyContent:'center',
    elevation: 6,

    shadowColor: '#e80f00b5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    borderRadius: 10,

    backgroundColor:'#fff',
    

    margin: 15,
  },
  
});
const mapStateToProps = ({  adicionar_pedido,user,pedidos }: { adicionar_pedido:any,user:any,pedidos:any})=> {
    return {
      adicionar_itens: adicionar_pedido.adicionar_itens,
      user_info: user.user_info,

      pedidos: pedidos.pedidos,
        };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAddItemToPedidos: (item:any) => dispatch(addItemToPedidos(item)),
    onSetAdicionar_itens: (item:any) => dispatch(setAdicionar_itens(item)),
    
  };
};
export default connect(mapStateToProps, mapDispatchProps)(Carrinho)
