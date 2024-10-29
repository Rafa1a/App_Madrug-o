import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header_pedido from '../components/Header_Pedido';
import Lista from '../components/Lista_Pedido'
import { connect } from 'react-redux';
import {fetchadicionar_list_ids, fetchatualizar_pedido, fetchatualizar_pedido_mesa, fetchatualizar_pedido_mesa_pix_dinheiro_cartao} from '../store/action/pedidos' 
import { pedido_itens_comp } from '../interface/inter';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAtualizarUser_status_mesa } from '../store/action/user';


 const Pedido_itens = (props:pedido_itens_comp) =>{


    const [loading, setLoading] = React.useState(false);
   
    const { numero_mesa, image_on, name_on, id, ids, rua, numero, pegar_local,dinheiro,pix,cartao,list_ids_boolean,celular,status ,observacao} = props.route.params;
    const atualizar_pedido = async() => {
      await props.onAtualizarPedido(id)
      // props.navigation?.navigate('Pedidos')
    }
    const atualizar_pedido_mesa =async () =>{
      await props.onAtualizarPedido_Mesa(ids)
    }
    const atualizar_escolha_status_mesa = numero_mesa?atualizar_pedido_mesa:atualizar_pedido
    // list_ids mesa status === true
    const adicionar_list_ids = async() => {
      const numero_mesa__pedidos_mesa = props.pedidos_mesa.find((pedido) => pedido.numero_mesa === numero_mesa);
      // console.log(numero_mesa__pedidos_mesa.ids)
      numero_mesa__pedidos_mesa.ids.forEach(async(id) => {
          await props.onAdicionar_list_ids(numero_mesa__pedidos_mesa.ids, id);
        });
    }
    ///////////////////////////////////////////////////
    // novalogica MESA
    const [modal, setModal] = React.useState(false);
    const [dinheiro_mesa, setDinheiro_mesa] = React.useState(false);
    const [pix_mesa, setPix_mesa] = React.useState(false);
    const [cartao_mesa, setCartao_mesa] = React.useState(false);

    const atualizar_status_mesa_users = async() => {
      // console.log('props.users_on',props.users_on)
        //retirar todos os usuarios logados nessa mesa numero_mesa
      props.users_on?.forEach(async(item:any) => {
        if(item.status_mesa){
          if(item.mesa === numero_mesa){
            await props.onUsers_status_mesa(item.id)
          }
        }
      })
    }
    // console.log(celular)
    ///////////////////////////////////////////////////
    return(
    <SafeAreaView style={styles.container}>
     <ScrollView style={styles.scroll}>
      {/* header q recebe o numero se tiver image se tiver e name do user se tiver */}
      <Header_pedido 
      id={id}
      ids={ids}
      numero_mesa={numero_mesa} 
      image_on={image_on} 
      name_on={name_on} 
      rua={rua}
      numero={numero}
      pegar_local={pegar_local}
      dinheiro={dinheiro}
      pix={pix}
      cartao={cartao}
      celular={celular}
      observacao={observacao}
      />
      {/*recebe o id depois faz um find em pedidos qual id === id_pedidos*/}
      <Lista id={id} numero_mesa={numero_mesa} ids={ids}
      list_ids_boolean={list_ids_boolean}/> 
      {/* botao para atualizar o status_$ do PEDIDO */}
      
      <View style={styles.totalContainer}> 
        <Text style={styles.totalText}>Total</Text>

        <View style={{flexDirection:'column',alignItems:'flex-end'}}> 
          {(pegar_local === false || pegar_local === undefined) && !numero_mesa?<Text style={{color:'red'}}>Taxa de entrega: + 5</Text>: null}
            {(pegar_local === false || pegar_local === undefined) && !numero_mesa?<Text style={styles.totalValue}>${props.total + 5}</Text>:<Text style={styles.totalValue}>${props.total }</Text>}
        </View>
      </View>
      <View style={styles.divider} />
      {list_ids_boolean || status ?null:
      <TouchableOpacity onPress={async() => {
        if(numero_mesa) {
          setModal(true)
        }else {
          setLoading(true)
          await atualizar_escolha_status_mesa()
          setLoading(false)
          props.navigation?.goBack()
        } 

        
      }}  style={styles.button}>
            {loading ? <Text style={styles.buttonText}>Carregando...</Text> : <Text style={styles.buttonText}>Fechar</Text>}
      </TouchableOpacity>}
      
      
      </ScrollView>
      {/* Modal nova logica, com a confirmacao : dinheiro cartao ou pix antes de fechar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false)
        }}
      >
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
          <View style={{backgroundColor:'#252A32', padding:20, borderRadius:10, width:'80%', alignItems:'center'}}>
            <Text style={{color:'#F4F7FC', fontSize:20, textAlign:'center', marginBottom:20}}>Escolha a forma de pagamento</Text>
            <TouchableOpacity onPress={() => {
              setDinheiro_mesa(true)
              setCartao_mesa(false)
              setPix_mesa(false)
            }} style={{marginBottom:10, backgroundColor: dinheiro_mesa ? '#007BFF' : '#F4F7FC', padding:10, width:'100%', borderRadius:5}}>
              <Text style={{color:'#252A32', fontSize:20, textAlign:'center'}}>Dinheiro</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setCartao_mesa(true)
              setDinheiro_mesa(false)
              setPix_mesa(false)
            }} style={{marginBottom:10, backgroundColor: cartao_mesa ? '#007BFF' : '#F4F7FC', padding:10, width:'100%', borderRadius:5}}>
              <Text style={{color:'#252A32', fontSize:20, textAlign:'center'}}>Cartão</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setPix_mesa(true)
              setDinheiro_mesa(false)
              setCartao_mesa(false)
            }} style={{marginBottom:10, backgroundColor: pix_mesa ? '#007BFF' : '#F4F7FC', padding:10, width:'100%', borderRadius:5}}>
              <Text style={{color:'#252A32', fontSize:20, textAlign:'center'}}>Pix</Text>
            </TouchableOpacity>
           {/* salvar e cancelar */}
            <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
              <TouchableOpacity onPress={() => {
                setModal(false)
              }} style={{backgroundColor:'#F4F7FC', padding:10, width:'45%', borderRadius:5}}>
                <Text style={{color:'#252A32', fontSize:20, textAlign:'center'}}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async() => {
                if(dinheiro_mesa || cartao_mesa|| pix_mesa){
                  setModal(false)
                  setLoading(true)
                  await atualizar_escolha_status_mesa()
                  await adicionar_list_ids()
                  for(let x of ids){
                    await props.onfitch_pedido_mesa_pix_dinheiro_cartao(x, pix_mesa,dinheiro_mesa,cartao_mesa);
                  }
                  await atualizar_status_mesa_users()
                  setLoading(false)
                  props.navigation?.goBack()
                }else {
                  alert('Escolha uma forma de pagamento')
                }
                
              }} style={{backgroundColor:'#F4F7FC', padding:10, width:'45%', borderRadius:5}}>
                <Text style={{color:'#252A32', fontSize:20, textAlign:'center'}}>Salvar</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#252A32",
    width: '100%',
  },
  scroll: {
    flex:1,
    width: '100%',
  },
  button: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'tomato',
    padding: 10,
    height:160,
    width:160,
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
    marginBottom:10
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
});
const mapStateProps = ({ pedidos,user }: { pedidos: any,user:any}) => {
  return {
    total: pedidos.total,
    pedidos: pedidos.pedidos,
    pedidos_mesa:pedidos.pedidos_mesa,

    users_on:user.users,

  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAtualizarPedido: (id:any) => dispatch(fetchatualizar_pedido(id)),
    onAtualizarPedido_Mesa: (ids:any) => dispatch(fetchatualizar_pedido_mesa(ids)),
    onAdicionar_list_ids: (ids:string[],id:string) => dispatch(fetchadicionar_list_ids(ids,id)),
    onUsers_status_mesa: (id:string) => dispatch(fetchAtualizarUser_status_mesa(id)),

    onfitch_pedido_mesa_pix_dinheiro_cartao : (id:string,pix:boolean,dinheiro:boolean,cartao:boolean) => dispatch(fetchatualizar_pedido_mesa_pix_dinheiro_cartao(id,pix,dinheiro,cartao))
  };
};

export default connect(mapStateProps,mapDispatchProps)(Pedido_itens)