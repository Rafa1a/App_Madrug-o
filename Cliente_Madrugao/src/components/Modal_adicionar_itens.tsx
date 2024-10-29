import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';
import { cardapio } from '../interface/inter_cardapio';
import { BottomSheet, Divider, Image, Input, ListItem,Button, CheckBox } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { createURL,useURL } from 'expo-linking';
import { ListItemAccordion } from '@rneui/base/dist/ListItem/ListItem.Accordion';
import Flatlist_adicionar from './Flatlist_adicionar';
import Flatlist_retirar from './Flatlist_retirar';
import { connect } from 'react-redux';
import { setAdicionar_itens } from '../store/action/adicionar_pedido';
import { Item } from '../interface/inter';
import analytics from '@react-native-firebase/analytics';
interface Props {
    visible: boolean;
    setModal: (boolean: boolean) => void;
    itens: cardapio;

    Set_add_itens: (itens: Item[]) => void;
 
    adicionar_itens: Item[];

    index?:number

    carrinho?:boolean

    cardapio?:cardapio[]

    paes?:{
        hamburguer:number,
        frances:number,
        id:string
    }
}

const Modal_adicionar_retirar = (props: Props) => {
    ///////////////////////////////////////////////checkbox adicionais e retirar 
    const [adicionar_adicionais, setAdicionar_adicionais] = React.useState([]);
    const [retirar_, setRetirar_] = React.useState([]);

    const [itens, setItens] = React.useState<Item>();
    //definir array de filhos
    const array_filhos = props.cardapio.filter((item:cardapio)=> item.versao === props.itens?.id);
    const [filho_selecionado, setFilho_selecionado] = React.useState<cardapio>(props.itens);
    const [index_selecionado, setIndex_selecionado] = React.useState<number>(0);
    // atualizar caso o item ja exista no carrinho, atualizar adicionar_adicionais e retirar_
    useEffect(()=>{
        // console.log(props.index)
        const item = props.index >= 0 ?props.adicionar_itens?.find((item:Item,index) => item.id === filho_selecionado?.id && index === props.index ):null
        if(item){
            // console.log(item)
            setAdicionar_adicionais(item.adicionar_p)
            setRetirar_(item.retirar_p)
        }
        // console.log(item)
    },[props.visible,filho_selecionado,index_selecionado])

   
    ///////////////////////////////definir filho selecionado
    useEffect(()=>{
        // console.log('filho_selecionado',props.adicionar_itens)
        // console.log('index_selecionado',props.itens)
        setFilho_selecionado(array_filhos[index_selecionado] || props.itens)
    },[index_selecionado,props.visible])
    
///////////////////////////////////////////////checkbox adicionais e retirar 
    function add_Itens(){
        // console.log(filho_selecionado.categoria_2 === 'lanches' || filho_selecionado.categoria_2 === 'hotdogs')
        if((filho_selecionado.categoria_2 === 'lanches' || filho_selecionado.categoria_2 === 'hotdogs') && (hamburguer===false && frances===false) && (props.paes.hamburguer > 0 || props.paes.frances > 0)){
            Alert.alert('Selecione um pão','Por favor selecione um pão para continuar')
            return;
        }
        if((filho_selecionado.categoria_2 === 'lanches' || filho_selecionado.categoria_2 === 'hotdogs') && (props.paes.hamburguer < 1 && props.paes.frances < 1)){
            Alert.alert('Pão Indisponível','Desculpe, não temos pão disponível no momento')
            return;
        }
        if(filho_selecionado.categoria==='bar' && filho_selecionado.categoria_2==='sucos' && adicionar_adicionais.length === 0 ){
            Alert.alert('Selecione','Por favor selecione um adicional para continuar')
            return;
        }
        if(filho_selecionado.categoria==='bar' && filho_selecionado.categoria_2==='sucos' && adicionar_adicionais.length > 2 ){
            Alert.alert('Adicional','Você só pode adicionar ATÉ 2 Adicionais')
            return;
        }
        props.Set_add_itens([...props.adicionar_itens||[],itens])
        props.setModal(false)
        setAdicionar_adicionais([])  
        setRetirar_([])
        analytics().logAddToCart({
            value: itens.valor_p,
            currency: 'BRL',
            items: [{
                item_brand: 'madrugao',
                item_id: itens.id,
                item_name: itens.name_p,
                item_category: itens.categoria,
                item_category2: itens.categoria_2,
                quantity: itens.quantidade,
            }]
          });
    }
    function adicionar_Itens(){
        const index = props.index >= 0 ?props.adicionar_itens?.findIndex((item,index) => item.id === itens.id && index === props.index ):null
        if (index === -1 || index === null) return;
        const newItems = props.adicionar_itens.map(item => ({...item}));

        // Atualize o item na cópia
        newItems[index] = itens; // Descomente esta linha

        // setItens(newItems[index])
        console.log('newItems',newItems)
        props.Set_add_itens(newItems);
        props.setModal(false)
    }
    ////////////////////////////////////paes hamburguer e frances////////////////////////////////////////
    const [hamburguer, setHamburguer] = React.useState(false);
    const [frances, setFrances] = React.useState(false);

    // definir os valores do item
    useEffect(() => {
        if (filho_selecionado) {
            let valor_p = filho_selecionado?.valor;

            if (filho_selecionado?.adicionais && adicionar_adicionais) {
                valor_p += filho_selecionado?.adicionais.reduce((total, item) => {
                    if (adicionar_adicionais?.includes(item.name)) {
                        return total + Number(item.valor.toFixed(2));
                    } else {
                        return total;
                    }
                }, 0);
            }

            const itens_add:any = {
                id: filho_selecionado?.id,
                name_p: filho_selecionado?.name,
                categoria: filho_selecionado?.categoria,
                categoria_2: filho_selecionado?.categoria_2,
                quantidade: 1,
                valor_p: valor_p,
            }

            if (retirar_?.length > 0) {
                itens_add.retirar_p = [...new Set(retirar_)];
            }

            if (adicionar_adicionais?.length > 0) {
                itens_add.adicionar_p = [...new Set(adicionar_adicionais)];
            }
            if(hamburguer){
                itens_add.hamburguer = true
            }
            if(frances){
                itens_add.frances = true
            }
            setItens(itens_add);
            console.log(itens_add)
        }
    }, [retirar_, adicionar_adicionais, filho_selecionado,hamburguer,frances]);

    ////////////////////////////////////paes hamburguer e frances////////////////////////////////////////

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.visible}
            >
                <View style={styles.constainer}>
                    <View style={styles.modal}>
                        {/* Fechar */}
                        <View  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Ionicons name="md-close-circle-sharp" size={24} color="black" onPress={()=>props.setModal(false)}/>
                        </View>
                        {/* Fechar */}
                        {/* IMAGE */}
                        <View style={[styles.view_image]}>
                        {props.itens.image? 
                            <Image
                            style={styles.image}
                            source={{uri:props.itens.image}}
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
                        {/* IMAGE */}

                        <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow: 1}}  showsVerticalScrollIndicator={false} >
                            {/* TEXT */}
                            <Text style={[styles.text,{fontFamily:'OpenSans-Bold'}]}>{props.itens?.name}</Text>
                            <Text style={styles.text_ingredientes}> {props.itens?.ingredientes?props.itens?.ingredientes.join(', '):''}</Text>
                            {/* TEXT */}
                            {/* versoes filhos */}
                            {array_filhos?.length > 0?
                            <View style={styles.tabaccordion}>
                                <Text style={styles.text2}>Versões : </Text>
                                <FlatList
                                    scrollEnabled={false}
                                    data={array_filhos}
                                    keyExtractor={(item, index) => `${index}`}
                                    renderItem={({ item, index }) => <Flatlist_adicionar  item={item} versoes  index={index} setIndex_selecionado={setIndex_selecionado} index_selecionado={index_selecionado } adicionar_adicionais={adicionar_adicionais}/>}
                                    //estilo
                                    contentContainerStyle={{justifyContent:'center',alignItems:'center'}}
                                    // divisor
                                    ItemSeparatorComponent={() => <View style={{paddingVertical:'2%'}}/>} 
                                />
                            </View>:null}
                            {/* versoes filhos */}
                            {/* paes hamburguer ou frances */}
                            {array_filhos?.length > 0?
                            props.itens.categoria_2 === 'lanches' || props.itens.categoria_2 === 'hotdogs'?
                            props.paes.hamburguer > 0 || props.paes.frances > 0?
                            <>
                                <Text style={styles.text2}>Pão : </Text>
                                {props.paes.hamburguer > 0 ?
                                <TouchableOpacity
                                    style={[styles.button, hamburguer ? { backgroundColor: '#4ada4a' } : null]}
                                    onPress={() => {
                                    setHamburguer(!hamburguer);
                                    setFrances(false);
                                    }}
                                >
                                    <Text style={[styles.text2,{color:'#fff'}]}>Hamburguer</Text>
                                </TouchableOpacity>
                                : null}
                                {props.paes.frances > 0 ?
                                <TouchableOpacity
                                    style={[styles.button, frances ? { backgroundColor: '#4ada4a' } : null]}
                                    onPress={() => {
                                    setFrances(!frances);
                                    setHamburguer(false);
                                    }}
                                >
                                    <Text style={[styles.text2,{color:'#fff'}]}>Francês</Text>
                                </TouchableOpacity>
                                :null}
                            </>
                            :null
                            :null
                            :null}
                            {/* paes hamburguer ou frances */}
                            {/* FLATLIST Adicionar 1*/}
                            {/* FLATLIST 1*/}
                            {filho_selecionado?.adicionais?.length > 0?
                                <>
                                    <Divider />
                                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,elevation:5}}>
                                        <Text style={styles.text}>Adicionar : </Text>
                                    </View>
                                    <FlatList
                                        scrollEnabled={false}
                                        // nestedScrollEnabled={true}
                                        data={filho_selecionado?.adicionais || []}
                                        renderItem={({item})=>(
                                            <Flatlist_adicionar item={item} setAdicionar_adicionais={setAdicionar_adicionais} adicionar_adicionais={adicionar_adicionais}/>
                                        )}
                                        keyExtractor={(item,index)=>index.toString()}
                                        //estilo
                                        contentContainerStyle={{justifyContent:'center',alignItems:'center'}}
                                        // divisor
                                        ItemSeparatorComponent={() => <View style={{paddingVertical:'2%'}}/>} 
                                    />
                                </>
                            :null}
                            {/* FLATLIST 1*/}
                            
                            {/* FLATLIST 2*/}

                            {filho_selecionado?.ingredientes?.length > 0?
                            <>
                                <Divider style={{paddingTop:5}}/>

                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,elevation:5}}>
                                    <Text style={styles.text}>Retirar : </Text>
                                </View>
                                {/* FLATLIST Retirar 2*/}
                                <FlatList
                                    scrollEnabled={false}
                                    // nestedScrollEnabled={true}
                                    data={filho_selecionado?.ingredientes || []}
                                    renderItem={({item})=>(
                                        <Flatlist_retirar item={item} setRetirar_={setRetirar_} retirar_={retirar_}/>
                                    )}
                                    keyExtractor={(item,index)=>index.toString()}
                                    //estilo
                                    contentContainerStyle={{justifyContent:'center',alignItems:'center'}}
                                    // divisor
                                    ItemSeparatorComponent={() => <View style={{paddingVertical:'2%'}}/>} 
                                />
                            </>:null}
                            {/* FLATLIST 2*/}

                            {/* BUTTON */}
                            <Divider />
                            {props.carrinho?
                            <TouchableOpacity style={styles.button} onPress={()=>{
                                adicionar_Itens()
                                }}>
                                <Text style={[styles.text,{color:'#fff'}]}>Atualizar</Text>
                            </TouchableOpacity>: 
                            <TouchableOpacity style={styles.button} onPress={()=>{add_Itens()}}>
                                <Text style={[styles.text,{color:'#fff'}]}>Adicionar ao carrinho</Text>
                            </TouchableOpacity>}
                        
                            {/* BUTTON */}
                        </ScrollView>

                    </View>
                </View>
            </Modal>

        </>
    );
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    modal: {
        backgroundColor: '#f8fafd',
        width: '90%',
        height: '95%', 
        borderRadius: 10, 
        padding: 10,
        elevation: 5,

        // shadowColor: '#DE6F00',
    },
    //////////////////////////////////////text
    text: {
        color: '#2D2F31',
        fontSize: 18,
        fontFamily:'OpenSans-Regular'
    },
    text_ingredientes: {
        color: '#2D2F31',
        fontSize: 15,
        fontFamily:'Roboto-Light',
        marginVertical: 10,
    },
    
    //////////////////////////////////////////////// Image
    view_image: {
        width: '100%',
        height: '40%',

        backgroundColor: '#f8fafd',

    },
    image: {
        width: '100%',
        height: '100%',
    },
    
      ////////////////////////////////////////////Buttons
    button: {
        backgroundColor: '#DE6F00',
        borderRadius: 10,
        padding: 10,
        marginTop: '2%',

        // borderWidth: 0.5,

        // borderColor: '#E81000',

    },
    tabaccordion:{
        backgroundColor:'#F4F7FC',
        borderBottomWidth:1, 
        borderRadius:25,
        margin:5
      },
      
      text2: {
        fontSize: 19,
        fontFamily:'Roboto-Regular',
        color:'#3C4043'
      },
});
const mapStateToProps = ({ adicionar_pedido,cardapio,paes }: { adicionar_pedido:any,cardapio:any,paes:any})=> {
    return {
      //
      adicionar_itens: adicionar_pedido.adicionar_itens,
      cardapio: cardapio.cardapio,
      paes: paes.paes,
    };
  };
const mapDispatchToProps = (dispatch: any) => {
    return {
      Set_add_itens: (itens:Item[]) => dispatch(setAdicionar_itens(itens)),
    };
  }
export default connect(mapStateToProps,mapDispatchToProps)(Modal_adicionar_retirar)