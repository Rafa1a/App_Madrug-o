import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert
} from 'react-native';
import Header_pedido from '../components/headers/Header_Pedido';
import Lista from '../components/adicionar_retirar/Lista_Pedido_adicionar';
import { connect } from 'react-redux';
import { pedido_itens_comp,cartao } from '../interface/inter';
import { Switch } from '@rneui/themed';
import { addItemToPedidos, setAdicionar_pedido } from '../store/action/adicionar_pedido';
import { CheckBox } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchadicionar_list_ids, fetchpedidos_ordem } from '../store/action/pedidos';
import { fetchatualizar_cardapio_pedidos_quantidade } from '../store/action/cardapio';

//////////////////////////////////////////////////
const Pedido_itens = ({ route, total, adicionar_pedido,onAdicionarPedido,navigation,onAdicionar_pedido,onPedidos_ordem,pedidos,inicial_state_mesas,maior_ordem,cardapio,onPedidos_quantidades }: pedido_itens_comp & { total: number }) => {
  
  const { numero_mesa, mesa } = route.params;
  
  // console.log(numero_mesa,mesa)
  
  
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    const fetch = async () => {
    setLoading(true)
    await onPedidos_ordem()
    setLoading(false)
    }
    fetch()
    // console.log(maior_ordem)
    const ordemMaisAlta = () => {
      // if (pedidos.length === 0) {
      //   return 0; // Retorna 0 se não houver pedidos
      // }
  
      // Encontrar o pedido com a ordem mais alta
      // const ordens = pedidos.map(item => item.ordem);
      // const ordemMaxima = Math.max(...ordens);
      // console.log(ordemMaxima + 1)
      return maior_ordem + 1;
      };
    if(mesa){
        inicial_state_mesas.numero_mesa = numero_mesa
        inicial_state_mesas.ordem = ordemMaisAlta()
    } 
  },[pedidos,maior_ordem])
  

  // Função para definir os status com base nos itens
  const definirStatus = () => {
    let status_chapeiro = false;
    let status_porcoes = false;
    let status_bar = false;

    adicionar_pedido.forEach((item:any) => {
      if (item.categoria === 'comidas' && (item.categoria_2 === 'lanches' || item.categoria_2 === 'hotdogs' || item.categoria_2 === 'combos')) {
        status_chapeiro = true;
      } else if (item.categoria_2 === 'porcoes') {
        status_porcoes = true;
      } else if (item.categoria === 'bar') {
        status_bar = true;
      }
    });

    // Retornar os status
    return { status_chapeiro, status_porcoes, status_bar };
  };
  
  const { status_chapeiro, status_porcoes, status_bar } = definirStatus();
  //atualizar os status em tempo real quando for excluido
  useEffect(() => {
    // console.log('status_chapeiro:', status_chapeiro);
    // console.log('status_porcoes:', status_porcoes);
    // console.log('status_bar:', status_bar);  
    if(mesa) {
      inicial_state_mesas.status_chapeiro = status_chapeiro;
      inicial_state_mesas.status_porcoes = status_porcoes;
      inicial_state_mesas.status_bar = status_bar;
    }
  }, [status_chapeiro, status_porcoes, status_bar]);

  //atualizar estado ao excluir
  useEffect(() => {
    if(mesa){
      inicial_state_mesas.itens = adicionar_pedido;
      inicial_state_mesas.observacao = adicionar_pedido.map((item:any) => `${item.name_p} : ${item.observacao}`).join('\n');
    }
  }, [adicionar_pedido]);


 


  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        {/* ... outros componentes ... */}
        <Header_pedido adicionar numero_mesa={numero_mesa} />

        <Lista  />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
        <View style={styles.divider} />
        {/* condicao caso mesa seja verdadeiro */}
          
          {/* button finalizar pedido */}
        <TouchableOpacity onPress={async() => {
          const pedidos_quantidades = async () => {
            adicionar_pedido.forEach(async(item:any) => {
              cardapio.forEach(async(item2:any) => {
                if(item.id === item2.id){
                  if(item2.versao){
                    cardapio.forEach(async(item3:any) => {
                      if(item3.id === item2.versao){
                        const pedidos_quantidade = Number(item3.pedidos_quantidade||0) + item.quantidade
                        await onPedidos_quantidades(item3.id,pedidos_quantidade)
                      }
                    })
                  }
                }
              })
            })
          }
          
          if(mesa){
            setLoading(true)
            pedidos_quantidades()
            await onAdicionarPedido(inicial_state_mesas)
            onAdicionar_pedido([])
            setLoading(false)
            // //atualizar estado inicial
            navigation?.goBack();  // Voltar uma vez
            navigation?.goBack();  // Voltar mais uma vez
          }

          }} style={styles.button}>
          {loading? <Text style={styles.buttonText}>Carregando...</Text>:<Text style={styles.buttonText}>Finalizar Pedido</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#202124",
    width: '100%',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  button: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'tomato',
    padding: 10,
    height: 160,
    width: 160,
    borderRadius: 100,
    margin: 5,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#DE6F00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC',
    fontSize: 30,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: '#F4F7FC',
    borderBottomWidth: 0.5,
    width: '100%',
    marginBottom: 10
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end',
    width: '90%',
    marginBottom: 10,
  },
  totalText: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 30,
  },
  totalValue: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,  // Adicione um espaçamento horizontal
    width: '80%',  // Use 100% da largura disponível
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 15,
    backgroundColor:'#F4F7FC',
  },
  input_valor_troco: {
    flex: 1,
    margin: 30,
    backgroundColor:'#F4F7FC',
    borderRadius:50
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  colunContainer_switch: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC',
    fontSize: 13,
    marginRight: 10,
  },
////////////////////////////////// chebox

  colunContainer:{
    flexDirection: 'column',
  },
  checkboxGroup: {
    marginBottom: 20,
    
  },
  
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
//////////////////////////////////colors chebox
  colorBlack_checkbox:{
    borderRadius:50,
    backgroundColor:'#3c4043'
  }
  ,colorLig_checkbox:{
    borderRadius:50,
    backgroundColor:'#F4F7FC'
  },
  color_text_checkbox_black:{
    color:"#f8fafd",
    fontFamily: 'OpenSans-Regular',
    fontSize:15,
  },
  color_text_checkbox_lig:{
    color:"#3c4043",
    fontFamily: 'OpenSans-Regular',
    fontSize:15,
  },

});

const mapStateProps = ({ pedidos,state,cardapio }: { pedidos: any,state:any,cardapio:any }) => {
  return {
    pedidos: pedidos.pedidos,
    total: pedidos.total,
    adicionar_pedido:pedidos.adicionar_pedido,
    inicial_state_mesas:state.state_mesas,
    maior_ordem:pedidos.ordem,


    cardapio:cardapio.cardapio,
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAdicionarPedido: (item:any) => dispatch(addItemToPedidos(item)),
    onAdicionar_pedido: (pedido:[]) => dispatch(setAdicionar_pedido(pedido)),
    onPedidos_ordem: () => dispatch(fetchpedidos_ordem()),
    onPedidos_quantidades: (id:string,number:number) => dispatch(fetchatualizar_cardapio_pedidos_quantidade(id,number)),
  };
};
export default connect(mapStateProps, mapDispatchProps)(Pedido_itens);
