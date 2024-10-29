import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header_pedido from '../components/Header_Pedido';
import Lista from '../components/Lista_Pedido'
import { connect } from 'react-redux';
import {fetchatualizar_pedido} from '../store/action/pedidos' 
import { SafeAreaView } from 'react-native-safe-area-context';

 class Pedido_itens extends React.Component<any>{
   
   
  render() {
       const { numero_mesa, image_on, name_on, id, ids, rua, numero, pegar_local,dinheiro,pix,cartao,observacao } = this.props.route.params;

       const atualizar_pedido = () => {
        this.props.onAtualizarPedido(id)
        // this.props.navigation?.navigate('Pedidos')
        this.props.navigation?.goBack()
      }
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
      observacao={observacao}
      />
      {/*recebe o id depois faz um find em pedidos qual id === id_pedidos*/}
      <Lista id={id} /> 
      {/* botao para atualizar o status_$ do PEDIDO */}
      
      <TouchableOpacity onPress={atualizar_pedido} style={styles.button}>
            <Text style={styles.buttonText}>Finalizado</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );}
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
    backgroundColor: '#DE6F00',
    padding: 10,
    height:160,
    width:160,
    borderRadius: 100,
    margin: 30,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#DE6F00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
        color: '#F4F7FC',
        fontSize: 30,
    textAlign: 'center',
  }
});
const mapDispatchProps = (dispatch: any) => {
  return {
    onAtualizarPedido: (id:any) => dispatch(fetchatualizar_pedido(id)),
  };
};

export default connect(null,mapDispatchProps)(Pedido_itens)