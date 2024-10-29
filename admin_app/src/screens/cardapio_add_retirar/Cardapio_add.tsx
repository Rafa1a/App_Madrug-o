
//inputs para adicionar um novo item ao cardápio
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Button, Input,Image,Divider  } from '@rneui/themed';
import { connect } from 'react-redux';
import { fetchadicionar_cardapio, fetchatualizar_cardapio, fetchatualizar_cardapio_imagem } from '../../store/action/cardapio';

 const Cardapio_add = (props: any) => {
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('0');
    const [ingredients, setIngredients] = React.useState('');
    const [ingredients_array, setIngredients_array] = React.useState([]); //ingredientes do item [string,striung....]
    const [categoria, setCategoria] = React.useState('');
    const [categoria_2, setCategoria_2] = React.useState('');
    const [adicionais, setAdicionais] = React.useState([]); //adicionais do item [{name, valor}...]
    const [valor_adicionais, setValor_adicionais] = React.useState(''); //valor total dos adicionais
    const [name_adicionais, setName_adicionais] = React.useState(''); //nome do adicional

    const [image, setImage] = React.useState('') //imagem do item
    const [url, setUrl] = React.useState('') //url do item
    //loading
    const [loading, setLoading] = React.useState(false)

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
        //   console.log(result);
          setImage(result.assets[0].uri);
        } else {
          alert('Você não selecionou uma imagem	');
        }
      };


    React.useEffect(() => {
        // console.log('image',image)
        const url_fetch = async () => {
            await props.onSalvar_image(image)
        }
        if(image){
            url_fetch()
        }
        
    }, [image])

    React.useEffect(() => {
        // console.log('url',props.url)
        setUrl(props.url)
        // props.onAdicionar_pedido(item_cardapio)
    }, [props.url])
    const [edit, setEdit] = React.useState(false)
    const [id, setId] = React.useState('')
    const [item_edit, setItem_edit] = React.useState({} as any)
    
    React.useEffect (() => {
        const [id,editar] = props.route.params? [props.route.params.id,props.route.params.editar]:[null,null]
        setEdit(editar)
        setId(id)
        // console.log(id,editar)
        if(editar && id){
            const item = [...props.cardapio.filter((item:any) => item.id === id)]

            let itemCopy = {...item[0]}; // Cria uma cópia do item
            setItem_edit(itemCopy)
            console.log('item',itemCopy)
            setName(itemCopy.name)
            setPrice(itemCopy.valor)
            setIngredients_array(itemCopy.ingredientes || [])
            setCategoria(itemCopy.categoria)
            setCategoria_2(itemCopy.categoria_2)
            setUrl(itemCopy.image)
            setAdicionais(itemCopy.adicionais || [])
        }
    }, [edit,id])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{width:'100%'}}>
            {/* image */}
            <View style={{width: '100%',justifyContent:'center',alignItems:'center'}}>

                {url?<Image source={{ uri: url }} containerStyle={{ width: 200, height: 200, marginBottom:10 }} PlaceholderContent={<ActivityIndicator />}/>:null}

                <Button title="image"  onPress={pickImageAsync} containerStyle={{width:150}}/>

            </View>
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
            <Divider style={{width:'100%',margin:10}}/>
            {/* categoria */}
            <View>
                <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>Categoria</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',margin:10}}>
                    <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria==='comidas'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria('comidas')}>
                        <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>comidas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria==='bebidas'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria('bebidas')}>
                        <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>bebidas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria==='bar'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria('bar')}>
                        <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>bar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* categoria_2 */}
            <View>
                {categoria?<Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>Categoria 2</Text>:null}
                <View style={{flexDirection:'column',justifyContent:'space-between',margin:10}}>
                    {categoria==='comidas'?
                    <>
                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='lanches'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('lanches')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>lanches</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='hotdogs'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('hotdogs')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>hotdogs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='porcoes'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('porcoes')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>porções</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='combos'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('combos')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>Combos</Text>
                        </TouchableOpacity>

                    </>
                    :null}
                    {categoria==='bebidas'?
                    <>
                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='no-alcool'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('no-alcool')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>no-alcool</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='alcool'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('alcool')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>alcool</Text>
                        </TouchableOpacity>
                    </>
                    :null}
                    
                    {categoria === 'bar'?
                    <>
                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='drinks'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('drinks')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>drinks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='sucos'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('sucos')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>sucos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[{backgroundColor:'#fff',padding:10,marginBottom:10,borderRadius:5},categoria_2==='outros'?{borderColor:'#E81000',borderWidth:3,}:null]} onPress={() => setCategoria_2('outros')}>
                            <Text style={{fontFamily:'OpenSans-Bold',color:'#000',fontSize:19}}>Outros</Text>
                        </TouchableOpacity>
                    </>
                    :null}
                </View>
            </View>
            <Divider style={{width:'100%',margin:10}}/>
            {categoria==='comidas' || categoria==='bar'?
            <>
                {/* ingredientes */}
                <View>
                    <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>Ingredientes</Text>
                    <Input
                        onChangeText={text => setIngredients(text)}
                        value={ingredients}
                        inputContainerStyle={{backgroundColor: 'white'}}
                    />
                    {/* lista de ingredientes */}
                    {ingredients_array.map((item:any, index:any) => {
                        return (
                            <View key={index} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                                <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>{item}</Text>
                                <Button title="Remover" onPress={() => {
                                    let array = [...ingredients_array]
                                    array.splice(index, 1)
                                    setIngredients_array([...array])
                                }}/>
                            </View>
                        )
                    })}
                    <Button title="Adicionar Ingrediente" onPress={() => {
                        setIngredients('')
                        setIngredients_array([...ingredients_array, ingredients])
                    }}/>
                </View>
            </>
            :null}
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
                            <View key={index} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                                <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>{item.name}</Text>
                                <Text style={{fontFamily:'OpenSans-Bold',color:'#fff',fontSize:19}}>R$: {item.valor}</Text>
                                <Button title="Remover" onPress={() => {
                                    let array = [...adicionais]
                                    array.splice(index, 1)
                                    setAdicionais([...array])
                                }}/>
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
                                categoria_2: categoria_2,
                                image: url,
                                onorof:item_edit.onorof,
                                // adicionais:adicionais,
                                estoque:item_edit.estoque,
                                curtidas:item_edit.curtidas,
                                comments:item_edit.comments
                            }
                            // console.log(item_cardapio)
                            const versao_cardapio = props.cardapio.filter((item:any) => item.versao === id)
                            if(versao_cardapio.length > 0){
                                const item_versao1 = {
                                    image: url,
                                    categoria: categoria,
                                    categoria_2: categoria_2,
                                }
                                versao_cardapio.map(async (item:any) => {
                                    await props.onAtualizar_cardapio(item.id,item_versao1)
                                })
                            }
                            await props.onAtualizar_cardapio(id,item_cardapio)
                            setLoading(false)
                            props.navigation.goBack();
                        }else{
                            const item_cardapio = {
                                name: name,
                                valor: parseFloat(price),
                                ingredientes: ingredients_array,
                                categoria: categoria,
                                categoria_2: categoria_2,
                                image: url,
                                onorof:item_edit.onorof,
                                adicionais:adicionais,
                                curtidas:item_edit.curtidas,
                                comments:item_edit.comments
                            
                            }
                            const versao_cardapio = props.cardapio.filter((item:any) => item.versao === id)
                            if(versao_cardapio.length > 0){
                                const item_versao2 = {
                                    ingredientes: ingredients_array,
                                    image: url,
                                    categoria: categoria,
                                    categoria_2: categoria_2,
                                }
                                versao_cardapio.map(async (item:any) => {
                                    await props.onAtualizar_cardapio(item.id,item_versao2)
                                })
                            }
                            // console.log(item_cardapio)
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
                                categoria_2: categoria_2,
                                image: url,
                                onorof:false,
                                // adicionais:adicionais,
                                estoque:1,
                                curtidas:0,
                                comments:[]
                            }
                            // console.log(item_cardapio)
                            await props.onAdicionar_cardapio(item_cardapio)
                            setLoading(false)
                            props.navigation.goBack();
                        }else{
                            const item_cardapio = {
                                name: name,
                                valor: parseFloat(price),
                                ingredientes: ingredients_array,
                                categoria: categoria,
                                categoria_2: categoria_2,
                                image: url,
                                onorof:false,
                                adicionais:adicionais,
                                curtidas:0,
                                comments:[]
                            }
                            // console.log(item_cardapio)
                            await props.onAdicionar_cardapio(item_cardapio)
                            setLoading(false)
                            props.navigation.goBack();
    
                        }
                    }
                    
                    
                    // props.onAdicionar_pedido(item_cardapio)
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
});
const mapStateProps = ({ cardapio }: { cardapio: any }) => {
    return {
      url: cardapio.url,
      cardapio: cardapio.cardapio
    };
  };
const mapDispatchProps = (dispatch: any) => {
    return {
      onSalvar_image: (image: any) => dispatch(fetchatualizar_cardapio_imagem(image)),
      onAdicionar_cardapio:(item:any)=>dispatch(fetchadicionar_cardapio(item)),
      onAtualizar_cardapio:(id:any,item:any)=>dispatch(fetchatualizar_cardapio(id,item)),
    };
  };
export default connect(mapStateProps,mapDispatchProps)(Cardapio_add)