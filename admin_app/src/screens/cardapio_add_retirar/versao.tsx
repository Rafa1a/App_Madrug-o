
//inputs para adicionar um novo item ao cardápio
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input,Image,Divider  } from '@rneui/themed';
import { connect } from 'react-redux';
import { fetchadicionar_cardapio, fetchatualizar_cardapio, fetchatualizar_cardapio_imagem } from '../../store/action/cardapio';

 const Versao = (props: any) => {
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('0');
    const [categoria, setCategoria] = React.useState('');
    const [adicionais, setAdicionais] = React.useState([]); //adicionais do item [{name, valor}...]
    const [valor_adicionais, setValor_adicionais] = React.useState(''); //valor total dos adicionais
    const [name_adicionais, setName_adicionais] = React.useState(''); //nome do adicional

    //loading
    const [loading, setLoading] = React.useState(false)

    const [edit, setEdit] = React.useState(false)
    const [id, setId] = React.useState('')
    const [item_edit, setItem_edit] = React.useState({} as any)
    React.useEffect (() => {
        const [id,editar] = props.route.params? [props.route.params.id,props.route.params.editar]:[null,null]
        setEdit(editar)
        setId(id)
        // console.log(id,editar)
        if(id){
            const item = [...props.cardapio.filter((item:any) => item.id === id)]
            let itemCopy = {...item[0]}; // Cria uma cópia do item
            setItem_edit(itemCopy)
            console.log(itemCopy)
            setName(itemCopy.name)
            setPrice(itemCopy.valor)
            setCategoria(itemCopy.categoria)
            setAdicionais(itemCopy.adicionais || [])
        }
    }, [])
    const [editingIndex, setEditingIndex] = React.useState(null);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{width:'100%'}}>
            {/* nome */}
            <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>Nome do item</Text>
            <Input
                onChangeText={text => setName(text)}
                value={name}
                inputContainerStyle={{backgroundColor: 'white'}}
            />
            {/* preco */}
            <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>Preço</Text>
            <Input
                keyboardType='numeric'
                onChangeText={text => {
                    // Verifica se a entrada é um número ou um ponto
                    setPrice(text)
                    
                }}
                value={price.toString()}
                inputContainerStyle={{backgroundColor: 'white'}}
                errorMessage={price? 'Para Valores DECIMAIS usar . (ponto) não , (virgula) exemplo : 21.5' : 'Digite um valor valido'}
            />
            
            {categoria==='comidas' || categoria==='bar'?
            <>
                {/* adicionais */}
                <View>
                    <Divider style={{width:'100%',margin:10}}/>

                    <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>Adicionais</Text>
                    <View style={{justifyContent:'space-between',marginBottom:10,width:'100%'}}>
                        <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:15}}>Nome</Text>
                        <Input
                            onChangeText={text => setName_adicionais(text)}
                            value={name_adicionais}
                            inputContainerStyle={{backgroundColor: '#ffff'}}
                        />
                    </View>
                    <View style={{justifyContent:'space-between',marginBottom:10,width:'100%'}}>
                        <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:15}}>Valor</Text>
                        <Input
                            keyboardType='numeric'
                            onChangeText={text => {
                                // Verifica se a entrada é um número ou um ponto
                                setValor_adicionais(text)
                            }}
                            value={valor_adicionais}
                            inputContainerStyle={{backgroundColor: '#fff'}}
                            errorMessage={valor_adicionais? 'Para Valores DECIMAIS usar . (ponto) não , (virgula) exemplo : 21.5' : 'Digite um valor valido'}
                        />
                    </View>

                    {adicionais.map((item:any, index:any) => {
                        return (
                            <View key={index} style={styles.itemContainer}>
                                {editingIndex === index ? (
                                    <TextInput
                                        style={styles.itemText}
                                        value={name_adicionais}
                                        onChangeText={setName_adicionais}
                                    />
                                ) : (
                                    <Text style={styles.itemText}>{item.name}</Text>
                                )}
                                {editingIndex === index ? (
                                    <TextInput
                                        style={styles.itemText}
                                        value={valor_adicionais}
                                        onChangeText={setValor_adicionais}
                                        keyboardType="numeric"
                                    />
                                ) : (
                                    <Text style={styles.itemText}>R$: {item.valor}</Text>
                                )}
                                <View style={styles.itemButton}>
                                    <Button title="Remover" onPress={() => {
                                        let array = [...adicionais]
                                        array.splice(index, 1)
                                        setAdicionais([...array])
                                    }}/>
                                </View>
                                <View style={styles.itemButton}>
                                    <Button title="Editar" onPress={() => {
                                        setName_adicionais(item.name)
                                        setValor_adicionais(String(item.valor))
                                        setEditingIndex(index)
                                    }}/>
                                </View>
                                {editingIndex === index && (
                                    <View style={styles.itemButton}>
                                        <Button title="Salvar" onPress={() => {
                                            let array = [...adicionais]
                                            array[index] = {name: name_adicionais, valor: parseFloat(valor_adicionais)}
                                            setAdicionais(array)
                                            setEditingIndex(null)
                                        }}/>
                                    </View>
                                )}
                            </View>
                        )
                    })}
                    <Button title="Adicionar Adicional" onPress={() => {
                        if(name_adicionais == '' || valor_adicionais == '') return alert('Preencha todos os campos')
                        setAdicionais([...adicionais, {name: name_adicionais, valor: parseFloat(valor_adicionais)}])
                        setName_adicionais('')
                        setValor_adicionais('')
                    }}/>
                </View>
            </>
            :null}
           
            </ScrollView>
            {/* salvar e enviar item */}
            <Button
                title={loading?'Carregando...':'Salvar'}
                onPress={async() => {
                    setLoading(true)
                    if(edit) {
                        if(categoria==='bebidas'){
                            const item_cardapio = {
                                name: name,
                                valor: parseFloat(price),
                                // ingredientes: ingredients_array,
                                categoria: categoria,
                                categoria_2: item_edit.categoria_2,
                                image: item_edit.image,
                                onorof:item_edit.onorof,
                                // adicionais:adicionais,
                                estoque:item_edit.estoque,
                                curtidas:item_edit.curtidas,
                                comments:item_edit.comments,
                               
                            }
                            console.log(item_cardapio)
                            await props.onAtualizar_cardapio(id,item_cardapio)
                            setLoading(false)
                            props.navigation.goBack();
                        }else{
                            const item_cardapio = {
                                name: name,
                                valor: parseFloat(price),
                                ingredientes: item_edit.ingredientes,
                                categoria: categoria,
                                categoria_2: item_edit.categoria_2,
                                image: item_edit.image,
                                onorof:item_edit.onorof,
                                adicionais:adicionais,
                                curtidas:item_edit.curtidas,
                                comments:item_edit.comments
                            
                            }
                            console.log(item_cardapio)
                            await props.onAtualizar_cardapio(id,item_cardapio)
                            setLoading(false)
                            props.navigation.goBack();
    
                        }
                    }else {
                        if(categoria==='bebidas'){
                            const item_cardapio = {
                                name: name,
                                valor: parseFloat(price),
                                // ingredientes: ingredients_array,
                                categoria: categoria,
                                categoria_2: item_edit.categoria_2,
                                image: item_edit.image,
                                onorof:false,
                                // adicionais:adicionais,
                                estoque:0,
                                curtidas:0,
                                comments:[],
                                versao:item_edit.id
                            }
                            console.log(item_cardapio)
                            await props.onAdicionar_cardapio(item_cardapio)
                            setLoading(false)
                            props.navigation.goBack();
                        }else{
                            const item_cardapio = {
                                name: name,
                                valor: parseFloat(price),
                                ingredientes: item_edit.ingredientes,
                                categoria: categoria,
                                categoria_2: item_edit.categoria_2,
                                image: item_edit.image,
                                onorof:false,
                                adicionais:adicionais,
                                curtidas:0,
                                comments:[],
                                versao:item_edit.id
                            }
                            console.log(item_cardapio)
                            await props.onAdicionar_cardapio(item_cardapio)
                            setLoading(false)
                            props.navigation.goBack();
    
                        }
                    }
                }}
                containerStyle={{width:'100%'}}
                color={'#DE6F00'}
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
      itemContainer: {flexDirection:'row', justifyContent:'space-between', marginBottom:10},
        itemText: {flex: 1.3, fontFamily:'OpenSans-Bold', color:'#fff', fontSize:19},
        itemButton: {flex: 1},
});
const mapStateProps = ({ cardapio }: { cardapio: any }) => {
    return {
      url: cardapio.url,
      cardapio: cardapio.cardapio
    };
  };
const mapDispatchProps = (dispatch: any) => {
    return {
      onAdicionar_cardapio:(item:any)=>dispatch(fetchadicionar_cardapio(item)),
      onAtualizar_cardapio:(id:any,item:any)=>dispatch(fetchatualizar_cardapio(id,item)),
    };
  };
export default connect(mapStateProps,mapDispatchProps)(Versao)