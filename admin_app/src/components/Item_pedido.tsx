import React from 'react';

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { ItemProps } from '../interface/inter';
import { connect } from 'react-redux';
import { setTotal_Valor } from '../store/action/pedidos';
import { Icon } from '@rneui/themed';
import { fetchatualizar_cardapio_estoque } from '../store/action/cardapio';



const Item_pedido = (props: ItemProps) => {
    // funcao que retorna caso nao seja lanches ou hotdogs
    // if(props.categoria === "bar" || props.categoria === "bebidas"  || props.categoria_2 === "porcoes" ) {
    //     return
    // }
    //adicionais []
    const adicional_array = props.adicionar_p ? (
        props.adicionar_p.map((a: any, index: number) => `${a}, `)
    ) : null;
    
    //retirar []   
    const retirar_array = props.retirar_p ? (
        props.retirar_p.map((a: any, index: number) => `${a}, `)
    ) : null;
    // se comprir a condicao adiciona um item adicionar ou retirar se nao cumprir retorna null
    const possui_adicionar =   adicional_array ? 
             <View style={styles.section}>
                <Text style={styles.text1}>Adicionar: </Text>
                <Text style={styles.text1}>{adicional_array}</Text>
            </View>: null;
    const possui_retirar = retirar_array?
   
        <View style={styles.section}>
            <Text style={styles.text1}>Retirar: </Text>
            <Text style={styles.text1}>{retirar_array}</Text>
        </View>
   :null
        // retorna o nome do item a ser feito e se tiver adicionais e retiradas /para pedidos da mesa
        const item = {
            id:props.id,
            categoria: props.categoria,
            categoria_2: props.categoria_2,
            adicionar_p: props.adicionar_p,
            retirar_p: props.retirar_p,
            name_p: props.name_p,
            quantidade:props.quantidade,
            valor_p:props.valor_p,
         }

         //funcao para excluir 1 item quando vc esta adicionando um pedido na lista de adicionar adicionando item 
         const Delete_item = () =>{
            const findIndex = props.adicionar_pedido.findIndex(
                (item:any) =>
                  item.id === props.id &&  
                  item.retirar_p === props.retirar_p &&
                  item.adicionar_p === props.adicionar_p   
                );
               
                //atualizar quantidade
                if (findIndex !== -1) {
                                
                    // Criar uma cópia do array atual
                    const newArray = [...props.adicionar_pedido];

                    // Remova o item do array usando o índice
                    newArray.splice(findIndex, 1);

                    // Atualize o estado com o novo array
                    props.onAdicionar_pedido(newArray); 
                }  
         }



    const mesa_On = props.mesa?
    props.list_ids_boolean?null:
    <Icon
        raised
        size={35}
        name='delete'
        type='MaterialIcons'
        color='#E81000'
        onPress={async()=>
            {
            props.objeto_lista_ids?props.objeto_lista_ids(item):null
            //atualizar estoque adicionando oq retirou
            const item_cardapio = props.cardapio.find(cardapio => cardapio.id === item.id)

            if(item_cardapio.categoria === 'bebidas'){
                if(item_cardapio.estoque < 0){
                    const newestoque = item.quantidade 
                    // console.log(newestoque)
                    await props.onAtualizar_estoque(item.id, newestoque)
                }else {
                    const newestoque = item_cardapio.estoque + item.quantidade 
                    // console.log(newestoque)
                    await props.onAtualizar_estoque(item.id, newestoque)
                }
            }
            
            }} 
        />:null


    const Pedido_adicionando = props.deleteitem?
    <Icon
        raised
        size={35}
        name='delete'
        type='MaterialIcons'
        color='#E81000'
        onPress={()=>Delete_item()} 
        />:null

        console.log()
    return (
        <View style={styles.container}> 
            <View style={styles.container_2}>
           
                <View style={props.mesa?styles.container_3_mesa:styles.container_3||props.deleteitem?styles.container_3_mesa:styles.container_3}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{props.name_p}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        {mesa_On}
                        {Pedido_adicionando}
                    </View>
                </View>
              
                
                <View style={styles.divider}/>
                <View style={styles.container_4}>
                    <View style={styles.content}>
                        {possui_adicionar}
                        {possui_retirar}
                    </View>
                    <View style={styles.container_5}>
                        <Text style={styles.text2}>x{props.quantidade}</Text>
                    </View>
                    <View style={styles.container_5}>
                        <Text style={styles.text2}>R$:{props.valor_p}</Text>
                    </View>
                </View>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection:'row',
        marginTop: StatusBar.currentHeight || 0,
        width: '100%',
       
    },
    container_2: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center', 
        marginTop: StatusBar.currentHeight || 0,
        width: '80%',
        backgroundColor:'#fff',
        borderRadius:25
    },
    container_3: {
        flexDirection: 'column', // Alterado para 'column'
        alignItems: 'center',
        width: '100%',
    },
    container_3_mesa: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        flexDirection: 'column', // Novo
        alignItems: 'center',
        width: '70%',
    },
    iconContainer: {
        flexDirection: 'row', // Novo
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '30%',
    },
    container_4: {
        justifyContent: 'flex-start',
        flexDirection: "row",
        width: '100%',
    },
    container_5: {
        flex:1,
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems:'flex-end',
        marginBottom:15
    },
    content: {
       
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#E8F0FE",
        width:'60%',
        borderRadius:30,
        elevation:20,
        shadowColor:'#202124'
    },
    section: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        width:"50%",
        margin:10,
    
        
    },
    text: {
        fontFamily: 'Roboto-Regular',
        color: '#202124',
        fontSize: 30,
        margin:10, 
    },
    text1:{
        fontFamily: 'OpenSans-Regular',
        color: '#2D2F31',
        fontSize: 14,
    },
    text2:{
        fontFamily: 'OpenSans-Regular',
        color: '#3C4043',
        fontSize: 18,  
    },
    divider: {
        borderBottomColor: '#2D2F31',
        borderBottomWidth: 0.5,
        width: '100%',
        marginBottom:10
    },
    divider1: {
        borderBottomColor: '#F4F7FC',
        borderBottomWidth: 1,
        width: '100%',
    },
   
});

const mapStateProps = ({ cardapio }: { cardapio: any}) => {
    return {
        cardapio: cardapio.cardapio,
    };
  };
const mapDispatchToProps = (dispatch: any) => {
    return {
      
      onAtualizar_estoque:(id:string,estoque:number)=>dispatch(fetchatualizar_cardapio_estoque(id,estoque)),
      
    };
  };
  
export default connect(mapStateProps, mapDispatchToProps)(Item_pedido);
  