import React from 'react';

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default (props: any) => {
    // para lanches ou hotdogs
    // if(props.categoria === "bar" || props.categoria === "bebidas" || props.categoria_2 === "porcoes" ) { return }
    //para bar
    // if(props.categoria === "comidas" || props.categoria === "bebidas") { 
    //     return 
    // } 
    //porcoes
    if(props.categoria === "bar" || props.categoria === "bebidas" || props.categoria_2 === "lanches" || props.categoria_2 === "hotdogs" ) { 
        return 
    }  
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
        // retorna o nome do item a ser feito e se tiver adicionais e retiradas
    return (
    <View style={styles.container}> 
        <View style={styles.container_2}>
       
            <View style={props.mesa?styles.container_3_mesa:styles.container_3||props.deleteitem?styles.container_3_mesa:styles.container_3}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{props.name_p}</Text>
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
});