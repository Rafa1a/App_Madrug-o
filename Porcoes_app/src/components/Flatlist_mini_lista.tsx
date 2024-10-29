import { Switch } from '@rneui/themed';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';



const mini_lista = (props: any) => {
    //switch bebidas
    console.log(props.item.adicionar_p)
    return (
        <View style={styles.container_lista_miniindex0}>

            <Text 
                style={{fontFamily:'Roboto-Regular',color:'#fff',fontSize:17}} 
                numberOfLines={1} 
                ellipsizeMode='tail'
            >
                {props.item.name_p}
            </Text>
        
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor: '#5e6163',borderRadius:20,width:'50%'}}
            >
                <Text style={{fontFamily:'Roboto-Regular',color:'#fff',fontSize:15}}>x{props.item.quantidade}</Text>
                
            </View>
            
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

export default mini_lista