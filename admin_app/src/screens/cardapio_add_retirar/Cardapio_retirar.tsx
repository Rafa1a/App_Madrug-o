/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { fetchretirar_cardapio, fetchretirar_cardapio_versao } from '../../store/action/cardapio';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Cardapio_retirar = (props: any) => {
    // Ordena o array cardapio em ordem alfabética
    const [cardapioOrdenado, setCardapioOrdenado] = React.useState([]);
     //////////////////////////////////////BARRA DE BUSCA////////////////////////////////////////
    const [search, setSearch] = useState('');
    useEffect(() => {
    const cardapioOrdenado = [...props.cardapio].filter(item => 
    (item.versao === undefined || item.versao === null) && 
    item.name.toLowerCase().replace(/\s/g, '').startsWith(search.toLowerCase().replace(/\s/g, ''))
    ).sort((a, b) => a.name.localeCompare(b.name));
    setCardapioOrdenado(cardapioOrdenado)
    }, [props.cardapio,search])
    return ( 
        <SafeAreaView style={styles.container}>
            <Text style={{color:'#fff', fontSize: 20, textAlign:'center', margin: 10}}>Cuidado! retirar é permanente</Text>
            {/* barra de busca */}
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:'100%'}}>
                <TextInput
                style={styles.input}
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar..."
                placeholderTextColor="#F4F7FC"
                />
                {/*apagar busca */}
                <MaterialCommunityIcons name="delete-circle" size={35} color="#ffffff" onPress={() => setSearch('')} />
                {/* <Button
                title="Apagar"
                onPress={() => setSearch('')}
                buttonStyle={{backgroundColor:'#3c4043',borderColor:'tomato'}}
                titleStyle={{fontFamily:'OpenSans-Bold',color:'#F4F7FC'}}
                containerStyle={{marginLeft:50,marginRight:50}}
                /> */}
            </View>
            <FlatList
                data={cardapioOrdenado}
                renderItem={({item}) => (
                    <View style={{flexDirection:'row', justifyContent:'space-evenly',backgroundColor:'#3C4043'}}> 
                        <Text style={{width:'50%',color:'#fff'}}>{item.name}</Text>
                        <TouchableOpacity style={{backgroundColor:'#E81000', width:'15%',padding:7}} onPress={async () => {
                            const versoes = props.cardapio.filter((item2: any) => item2.versao === item.id)
                            if(versoes.length > 0){
                                await props.onRetirar_item_versao(item.id)
                            }
                            await props.onRetirar_item(item.id)
                            }}>
                            <Text style={{textAlign:'center', color:'#fff'}}>Retirar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{backgroundColor:'#DE6F00', width:'15%',padding:7}} onPress={()=>props.navigation.navigate('Cardapio_add',{editar:true,id:item.id})}>
                            <Text style={{textAlign:'center', color:'#fff'}}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{backgroundColor:'#0E00E3', width:'16%',padding:7}} onPress={()=>props.navigation.navigate('Versao_add',{id:item.id})}>
                            <Text style={{textAlign:'center', color:'#fff'}}>Versão</Text>
                        </TouchableOpacity>

                    </View>
                )}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{height:1, backgroundColor:'#fff'}}></View>}
                />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor: '#202124',
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 10,
        color: '#F4F7FC',
        width: '80%',
      },
});
const mapStateToProps = ({cardapio }: {cardapio:any }) => {
  return {
    cardapio: cardapio.cardapio
  }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        onRetirar_item: (id: any) => dispatch(fetchretirar_cardapio(id)),
        onRetirar_item_versao: (id: any) => dispatch(fetchretirar_cardapio_versao(id)),
    }
    }
export default connect(mapStateToProps,mapDispatchToProps)(Cardapio_retirar)