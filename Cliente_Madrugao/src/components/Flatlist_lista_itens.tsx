import React, { useEffect } from 'react';
import {
    FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import {  Divider, Image,  } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Modal_adicionar_itens from './Modal_adicionar_itens';
import { setAdicionar_itens } from '../store/action/adicionar_pedido';
import { Item } from '../interface/inter';
import { cardapio } from '../interface/inter_cardapio';
interface props_lista {
    navigation?:any
    adicionar_itens?:Item[]
    Set_add_itens?: (itens:Item[]) => void;
    item?:Item
    cardapio?:cardapio[]
    }
function Flatlist_Carrinho(props: props_lista) {

    //calcular o valor de adicionais 
    function adicionais_valor(item:Item){

        const cardapio_find = props.cardapio?.find((item_cardapio)=>item_cardapio.id === item.id)

        const valor_ = cardapio_find?.adicionais?.filter( (item_adicionais)=>item.adicionar_p?.includes(item_adicionais.name) ).map((item_adicionais)=>item_adicionais.valor)?.reduce((a,b)=>a+b,0)

        console.log(valor_)
        return valor_
    }
    // adicionais_valor(props.item) 
    //calcular o valor de adicionais
    const [cardapio_item, setCardapio_item] = React.useState<cardapio>()
    useEffect(() => {
        const cardapio_f = props.cardapio?.find((item_cardapio)=>item_cardapio.id === props.item.id)

        setCardapio_item(cardapio_f)

    }, [props.adicionar_itens])
  return (
    <>
        <View style={styles.container}>
                    <View style={[styles.view_image]}>
                        {cardapio_item?.image? 
                            <Image
                            style={styles.image}
                            source={{uri:cardapio_item?.image}}
                            resizeMode="contain"
                            PlaceholderContent={
                                    <ActivityIndicator size="large" color="#DE6F00" />
                            }
                            placeholderStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopRightRadius: 25,
                                borderTopLeftRadius: 25,
                                backgroundColor: '#f8fafd'
                            }}
                            />: 
                            <Image
                            style={styles.image}
                            source={require('../../assets/testes/imagens_treino.png')}
                            resizeMode="contain"
                            PlaceholderContent={
                                    <ActivityIndicator size="large" color="#DE6F00" />
                            }
                            placeholderStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopRightRadius: 25,
                                borderTopLeftRadius: 25,
                                backgroundColor: '#f8fafd'
                            }}
                            
                            />
                            }
                    </View>
                    <View style={styles.container_card_texts}>
                        {/* title */}
                        <Text style={{ fontSize: 16, fontFamily:'Roboto-Bold', }}>{props.item.name_p}</Text>
                        <Divider style={{width:'100%'}}/>
                        {/* title */}
                        {/* valores e quantidades */}
                        <View style={styles.view_quantidade}>
                            <View style={styles.view_text_quantidade}>
                                <Text style={[styles.text_valor,{fontSize:15}]}>R$: </Text>
                                <Text style={styles.text_valor}>{props.item.valor_p}</Text>
                            </View>
                            <View style={styles.view_text_quantidade}>
                                <Text style={[styles.text_valor,{fontSize:15}]}>Quantidade :</Text>
                                <Text style={styles.text_valor}>{props.item.quantidade}</Text>
                            </View>
                        </View>
                        {/* valores e quantidades */}

                        {/* adicionar e retirar caso tenho */}
                        {props.item.adicionar_p?.length > 0 || props.item.retirar_p?.length > 0?
                        <TouchableOpacity style={styles.view_adicionar_retirar} onPress={()=>{}}>
                        {props.item.adicionar_p && props.item.adicionar_p.length > 0? 
                        <>
                            <Text style={styles.text_adicionar_retirar}>Adicionar:  R$:{adicionais_valor(props.item)}</Text>
                            <Text style={styles.text_itens} >{props.item.adicionar_p.join(', ')}</Text> 
                        </>: null}
                        {props.item.retirar_p && props.item.retirar_p.length > 0?
                        <>
                            <Text style={styles.text_adicionar_retirar}>Retirar:</Text>
                            <Text style={styles.text_itens} >{props.item.retirar_p.join(', ')}</Text>
                        </>
                        :null}
                        </TouchableOpacity>:null}
                        {/* adicionar e retirar caso tenho */}
                        
                    </View>
        </View>
    </>
  );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        margin: 5,
    },
    container_card_texts: {
        alignItems: 'center', 
        justifyContent: 'space-between', 
        margin: 5, 
        width:'50%'
    },
  //////////////////////////////////////////////// Image
    view_image: {
        width: '40%',
        height: Dimensions.get('window').height / 4,

        borderRadius: 10,
        backgroundColor: '#f8fafd',
        elevation: 3,

    },
    image: {
        width: '100%',
        height: "100%",
    },
  //////////////////////////////////////////////// Image
  //quantidade
    view_quantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 5,
        width: '100%',
    },
    view_text_quantidade: {
        flexDirection: 'row', 
        alignItems: 'flex-end', 
        justifyContent: 'flex-start', 
        margin: 5, 
        flex: 1
    },
    view_icones_quantidade: {
        flexDirection: 'row',
        borderWidth:0.5,

        borderColor: '#E81000',
        borderRadius: 6,
    },
    text_valor: {
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
    text_quantidade: {
        fontSize: 18,
        fontWeight: 'bold',
    },
  //quantidade

  ///adicionar e retirar 
    view_adicionar_retirar: {
        justifyContent: 'space-between',
        padding: 5,
        width: '85%',
        backgroundColor: '#f4f7fc',

        borderWidth: 0.5,
        borderColor: '#E81000',
        //shadow
        elevation: 4,
        shadowColor: '#E81000',

        borderRadius: 10,
    },
    text_adicionar_retirar: {
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
        color: '#3C4043',
    },
    text_itens: {
        fontSize: 13,
        fontFamily: 'Roboto-Light',
        color: '#3C4043',
    },
});
const mapStateToProps = ({  cardapio,adicionar_pedido }: { cardapio:any,adicionar_pedido:any})=> {
    return {
        cardapio: cardapio.cardapio,
        adicionar_itens: adicionar_pedido.adicionar_itens,
    };
  };
  const mapDispatchToProps = (dispatch: any) => {
    return {
      Set_add_itens: (itens:Item[]) => dispatch(setAdicionar_itens(itens)),
    };
  }
export default connect(mapStateToProps, mapDispatchToProps)(Flatlist_Carrinho)
