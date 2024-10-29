import React, { useEffect } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import Number from './Number';
import { pedido_props } from '../interface/inter';
import { connect } from 'react-redux';
import { set_Pedido_Itens } from '../store/action/pedidos';
import Flatlist_mini_lista from './Flatlist_mini_lista';

const Pedido = (props: pedido_props) => {

 const handlePress = () => {
    //clicar redireciona para os itens do pedido e passa as propriedades
    props.onPedido_itens({ 
      id:props.id,
      numero_mesa: props.numero_mesa, 
      image_on: props.image_on, 
      name_on:props.name_on,
      rua : props.rua,
      numero:props.numero,
      pegar_local:props.pegar_local,
      pix:props.pix,
      cartao:props.cartao,
      dinheiro:props.dinheiro,
      observacao:props.observacao,
      }),
      console.log('test1')
      props.navigation?.navigate('Pedido_itens')
      console.log('test2')

      
  };  

  // Usuário ou mesa como retorno da const 
  const userormesa = props.numero_mesa ?
    // Styles seria preto ou branco 
    props.styles ? 
    <Number number={props.numero_mesa} styles /> :
     <Number number={props.numero_mesa} /> 
    :
    <Avatar
      size={100}
      rounded
      // Tem imagem do usuário? Se não, usa o ícone de anônimo
      source={props.image_on ? { uri: props.image_on } : undefined}
      icon={!props.image_on ? { name: 'account-circle', type: 'material-icons', color: props.styles ? '#3C4043' : '#E8F0FE' } : undefined}
      containerStyle={{
        width: props.image_on ? 50 : 60,
        margin: props.image_on ? 7 : null,
        aspectRatio: 1,
      }}
    />;
  
  // Se tem o nome ou não
  const username = props.name_on ? <Text style={props.styles ? styles.textindex0 : styles.text}>{props.name_on}</Text> : null;
  
  // Styles diz se está em primeiro ou não na ordem de pedidos ou refere a cor, pois o primeiro item o fundo é branco e o restante é preto
  const icon_lanche = props.styles ? <Avatar size={60} source={require('../assets/image/lanche.png')} 
    containerStyle={{
      position: 'absolute',
      bottom: 5,
      right: 20,
    }} /> : null;
  // mini lista do itens do pedido
  const [itens, setItens] = React.useState(props.itens);
  useEffect(() => {
    console.log('pegar_local',props.rua,props.numero,props.pegar_local) 
    const itens_comidas = props.itens.filter((item) => item.categoria === 'comidas' && (item.categoria_2 === 'lanches' || item.categoria_2 === 'hotdogs' || item.categoria_2 === 'combos'));
    setItens(itens_comidas);
  }, [props.itens])
  return (
    <View style={styles.containerM}>
      <TouchableOpacity onPress={handlePress} style={styles.containerM}>
        <View style={props.styles ? styles.containerindex0 : styles.container}>
          <View style={styles.content}>
            {userormesa}
            {username}
          </View>
          {icon_lanche}
          
        </View>
        <View style={styles.container_lista_mini}>
          <FlatList
            data={itens}
            renderItem={({ item }) =>(
                <Flatlist_mini_lista item={item}/>

            )}
            keyExtractor={(item,index )=> index.toString()}
            style={{width:'100%',height:'100%'}}
            // ItemSeparatorComponent={() => <View style={{width:10}}/>}
          />

        </View>
        <View style={styles.container_lista_mini}>
          {props.numero_mesa?null:props.pegar_local?
            <Text style={{fontFamily:'Roboto-Regular',color:'#ffff',fontSize:17}}>
              Pegar local
            </Text>
          :
          <>
            {/* entrega */}
            <Text style={{fontFamily:'Roboto-Regular',color:'#5ddfff',fontSize:17}}>
              Entrega :
            </Text>
            <Text style={{fontFamily:'Roboto-Regular',color:'#fff',fontSize:17}}>
              Rua: {props.rua} Nº: {props.numero}
            </Text>
          </>}
        </View>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3C4043',
    borderRadius: 50,
    height: Dimensions.get('window').width * 1 / 7,
    width: Dimensions.get('window').width / 1.6,
  },
  containerindex0: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F7FC',
    borderRadius: 50,
    height: Dimensions.get('window').width * 1 / 5.5,
    width: Dimensions.get('window').width / 1.29,
    // marginRight: '10%',
    // marginLeft: '10%',
  },
  containerM: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',


    height: '100%',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'RobotoMono-Bold',
    color: '#E8F0FE',
  },
  textindex0: {
    fontFamily: 'RobotoMono-Bold',
    color: '#3C4043',
  },
  numbers: {
    width: '38%',
    aspectRatio: 1,
  },
  outros: {},
  container_lista_mini: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C4043',
    borderRadius: 10,
    margin:10,
    height:"100%",
    width: "90%"
  },
 
});
const mapDispatchProps = (dispatch: any) => {
  return {
    
    onPedido_itens: (pedidos_itens:any) => dispatch(set_Pedido_Itens(pedidos_itens)),
  
  };
};
export default connect(null,mapDispatchProps)(Pedido)
