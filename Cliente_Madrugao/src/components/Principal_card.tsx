import React, { useEffect, useState } from 'react';
import {
  
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  FlatList,
  Modal,
  Linking

} from 'react-native';
import { BottomSheet, Button, Image, Input, ListItem } from '@rneui/themed';

import { MaterialCommunityIcons,AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { useStyles } from '../styles/styles_dark_ligth';
import { Principal_card, commentss2 } from '../interface/Novas_componentes';
import { update_On_curtidas, update_On_curtidas_user } from '../store/action/user';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Avatar } from '@rneui/base';
import { addComment, setModal_comments } from '../store/action/cardapio';
import { comments } from '../interface/inter_cardapio';
import { setAdicionar_itens,  } from '../store/action/adicionar_pedido';
import { Item } from '../interface/inter';
import Modal_adicionar_itens from './Modal_adicionar_itens';
import { Ionicons } from '@expo/vector-icons';
import { setModal_Fechado_aberto } from '../store/action/message';
import analytics from '@react-native-firebase/analytics';


 function Card(props : Principal_card) {
  // console.log(props.index)
  const styles_dark0rligth = useStyles(props.user_info);  

  const itens = props.item;
  // console.log(itens.ingredientes?itens.ingredientes.join(', '):'')
  //deifinir curtidas 
  const [curtidas, setCurtidas] = React.useState(false);
  const [displayCurtidas, setDisplayCurtidas] = useState(itens.curtidas);
  useEffect(() => {
    setDisplayCurtidas(itens.curtidas);
  }, [itens.curtidas])

  useEffect(() => {
    const curtidas = props.user_info.curtidas || [];
    const id = itens.id;
    // console.log(curtidas)
    // console.log(id)
    const find = curtidas?.includes(id)
    if(find){
      setCurtidas(true)
    }else{
      setCurtidas(false)
    }
  }, [props.user_info.curtidas,itens.id])
  /////////////////////////////////////////////// BottomSheet
  const [isVisible, setIsVisible] = useState(false);
  /////////////////////////////////////////////// BottomSheet
  // console.log(itens.comments.length)
  
  //////////////////////////////////////////////////////////////
  //animacao
  const [icon, setIcon] = useState(false);

  const [input, setInput] = useState('');
  const[loading_comment,setLoading_comment] = useState(false);

  const randomWidth = useSharedValue(50);

  const config = {
    duration: 300,
    easing: Easing.bezier(0.59, -0.01, 0.19, 1.41),
  };
  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(`${randomWidth.value}%`, config),
      // borderWidth: withSpring(randomWidth.value/12, config_2),
    };
  });
  //funcao para procurar user em users
  const find_user = (uid:string) => {
    const user = props.users.find((item:any) => item.uid === uid);
    // console.log(user)
    return user;
  }
  //////////////////////////////////////////////////////////////
  // console.log(itens.comments[0].date.toDate().toLocaleDateString())
  //////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////
  //MODAL
  const [modal, setModal] = useState(false);
  //FUNCAO PARA ADICIONAR ITENS
  const add_itens = () => {
    setModal(true)

    if(itens.categoria === 'comidas'){
      setModal(true)
    }else{
      //caso ja exista nao adicionar
      const find = props.adicionar_itens?.find((item:Item) => item.id === itens.id)
      if(find){
        return
      }
      const itens_add = {
        id: itens.id,
        name_p: itens.name,
        categoria: itens.categoria,
        categoria_2: itens.categoria_2,
        // retirar_p?: string[];
        // adicionar_p?: string[];
        quantidade: 1,
        valor_p : itens.valor,
      }
      // console.log(itens_add)
      const itens_add_array = [...props.adicionar_itens||[]];
  
      itens_add_array.push(itens_add)
  
      props.Set_add_itens(itens_add_array)
  
      console.log(props.adicionar_itens)
    }
  }
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////Modal imagem
  const [modalVisible, setModalVisible] = useState(false);
  //////////////////////////////////////////////////////Modal imagem
  /////////////////////////////////////////////////////Modal para quando tem pedido, nao pode adicionar mais itens
  const [modal_pedido, setModal_pedido] = useState(false);
  /////////////////////////////////////////////////////Modal para quando tem pedido, nao pode adicionar mais itens
  /// abrir telefone :

  const redirecionarParaLigacao = (numero) => {
    const numeroFormatado = `tel:${numero}`;
    // console.log(numeroFormatado)
    Linking.openURL(numeroFormatado)
      .catch((err) => console.error('Erro ao tentar abrir a ligação', err));
  };
  //////////////////////////////////////////////////////
  return (

  <View style={[styles.container,props.selectedItem === props.index && { transform: [{ scale: 1.2 }] },]}>

    {/* CARD */}
    <View style={[styles.view_principal,styles_dark0rligth.mode_theme_card]}>
      {/* IMAGE */}
      <View style={[styles.view_image,styles_dark0rligth.mode_theme_card_image]}>
        {itens.image? 
        <Image
          style={styles.image}
          source={{uri:itens.image}}
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
          onPress={() => {
            setModalVisible(true)

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
          onPress={() => {
            setModalVisible(true)

          }}
        />
        }
       
      </View>
      {/* TEXT */}
      <View style={styles.textContainer}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.title,styles_dark0rligth.mode_theme_card_text]}>{itens.name}</Text>
          {/* <Text style={[styles.title,styles_dark0rligth.mode_theme_card_text,{fontSize:22,width: '30%',}]}>R$ {itens.valor}</Text> */}
        </View>
        <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.description,styles_dark0rligth.mode_theme_card_text,{ flexShrink: 1 }]}>
          {itens.ingredientes?itens.ingredientes.join(', '):''}
        </Text>
      </View>
      {/* ICON */}
      <View style={styles.iconContainer}>
        {/* BUTTON COMENTARIO */}
        <View style={{marginLeft:10,marginTop:10,alignItems:'center',justifyContent:'center'}} >
          <TouchableOpacity onPress={()=>setIsVisible(true)}>

              {props.user_info.theme_mode ? 
              <FontAwesome name="commenting-o" size={25} color="#f8fafd" /> 
              : 
              <FontAwesome name="commenting-o" size={25} color="#252A32" />
              }
              <Text style={[{color:'#252A32',fontSize:10,fontFamily:'Roboto-Regular',textAlign:'center'},styles_dark0rligth.mode_theme_card_text]}>{itens.comments.length}</Text>
          </TouchableOpacity>
        </View>
        {/* BUTTON CARD */}

        <TouchableOpacity
        onPress={() => {
          // console.log(props.pedido_online)
          props.pedido_online?.length > 0 && (props.user_info?.status_mesa === false || props.user_info?.status_mesa === undefined) ?setModal_pedido(true):props.fechado_aberto === 'fechado' || props.fechado_aberto === 'fechadodata'? props.SetModal_fechado_aberto(true) : setModal(true)

          // setModal(true)
          // props.Set_add_itens()
        }}
        style={{ width: '45%', height: '45%', alignItems: 'center', justifyContent: 'center',}}
        >
          <View style={styles.Button}>
            <FontAwesome name="cart-plus" size={35} color="#252A32" /> 
          </View>
        </TouchableOpacity> 

        {/* button curtidas */}
        <View style={{marginRight:10,marginTop:10,alignItems:'center',justifyContent:'center'}} >
          <TouchableOpacity onPress={async()=>{
              if(curtidas){
                setDisplayCurtidas(displayCurtidas);

                await setCurtidas(false)
                await props.Update_curtidas_user(props.user_info.id,itens.id,props.user_info.curtidas)
                return
              }else{
                setDisplayCurtidas(displayCurtidas + 1);

                await setCurtidas(true)
                await props.Update_curtidas(itens.id,itens.curtidas+1)
                await props.Update_curtidas_user(props.user_info.id,itens.id,props.user_info.curtidas||[])
                analytics().logAddToWishlist({
                  value: itens.valor,
                  currency: 'BRL',
                  items: [{
                      item_brand: 'madrugao',
                      item_id: itens.id,
                      item_name: itens.name,
                      item_category: itens.categoria,
                      item_category2: itens.categoria_2,
                  }]
                });
                // console.log('rafa')
              }
            }}>  

            {curtidas?
                <Image
                style={{width:25,height:25}}
                source={require('../../assets/icones/coracao.png')}
                resizeMode="contain"
                PlaceholderContent={
                      <ActivityIndicator size="large" color="#E81000" />
                }
                placeholderStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f8fafd'
                }}
              />
              :<Image
              style={{width:25,height:25}}
              source={require('../../assets/icones/coracao_out.png')}
              resizeMode="contain"
              PlaceholderContent={
                    <ActivityIndicator size="large" color="#E81000" />
              }
              placeholderStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8fafd'
              }}
              />}

          </TouchableOpacity>
          
           <Text style={{color:'#E81000',fontSize:10,fontFamily:'Roboto-Regular',textAlign:'center'}}>{displayCurtidas}</Text>
         
        </View>
        
      </View>

    </View>
    {/* CARD */}
    
    {/* COMENTARIOS */}
    <BottomSheet modalProps={{}} isVisible={isVisible}>

      <View style={[{flex:1,justifyContent:'center',alignItems:'flex-end'}]}>
        {/* botao fechar */}
        <TouchableOpacity style={{margin:10,backgroundColor:'#f4f7fc',padding:10,borderRadius:50,elevation:5}} onPress={()=>{
            setIsVisible(false),
            randomWidth.value=50,
            setIcon(false)
            props.Setmodal(false)
          }}>

          <AntDesign name="closecircle" size={24} color="#3C4043" />
        </TouchableOpacity>
        {/*input  */}


        <Animated.View style={[style,{backgroundColor: '#f4f7fc', elevation: 5, borderRadius: 10, margin: 10 }]} >
          <Input
          placeholder="Comment"
          rightIcon={
            icon?loading_comment?<ActivityIndicator size="small" color="#3C4043" />:
              <MaterialCommunityIcons name="comment-plus" size={30} color="#3C4043" onPress={async()=>{
                props.Setmodal(true)
                setLoading_comment(true)
                await props.AddComment(itens.id,{
                  uid:props.user_info.uid,
                  comment:input,
                  date: new Date(),
                })
                setLoading_comment(false)
              } 
              }/>:
              <MaterialCommunityIcons name="comment-processing" size={30} color="#3C4043" />
          }
          onChangeText={value => setInput(value)}
          // containerStyle={{ width: '90%'}}
          onFocus={() => {randomWidth.value = 80, setIcon(true)}}
          />
        </Animated.View>
      </View>
        {/* //////////////////////////////////////////////// */}

      {/* flatlista de comentarios */}
      <FlatList
        scrollEnabled={false}
        data={itens.comments.slice().reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ListItem key={index}>
            <Avatar
              size={40}
              rounded
              source={{
                uri: find_user(item.uid)?.image_on? find_user(item.uid).image_on :  null,
              }}
              />
            <ListItem.Content>
            
              <ListItem.Title style={{backgroundColor:'#f4f7fc',padding:10,borderRadius:10,color:'#202124',fontFamily:'OpenSans-Regular'}}>
                
                <Text style={{fontFamily:'OpenSans-Bold'}}>
                  {find_user(item.uid)?.name_on?find_user(item.uid).name_on : 'Anônimo'}
                </Text>
                {"\n"}
                {"  "}
                {item.comment}
              </ListItem.Title>
              
              <ListItem.Subtitle style={{ fontSize: 11, lineHeight: 14,fontFamily:'Roboto-Regular' }}>
                {item.date.toDate().toLocaleDateString()} {item.date.toDate().toLocaleTimeString()}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </BottomSheet>
    {/* COMENTARIOS */}

    {/* MODAL itens personalizados */}
    <Modal_adicionar_itens visible={modal} setModal={setModal} itens={itens}/>
    {/* MODAL itens personalizados*/}

    {/* MODAL imagem*/}
 
    <Modal 
        animationType="fade"
        transparent={true}
        visible={modalVisible}
            >
        <View style={{flex:1,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center'}}>
           {/* Fechar */}
           
            {/* Fechar */}
          <View style={{backgroundColor:'#fff',width:'100%',height:'100%',justifyContent:'center'}}>
            <View  style={{width:'100%',flexDirection: 'row', justifyContent: 'flex-end', alignItems:'flex-start'}}>
              <Ionicons name="md-close-circle-sharp" size={45} color="#3C4043" onPress={()=>setModalVisible(false)}/>
            </View>
            <View style={[styles.view_image,styles_dark0rligth.mode_theme_card_image]}>
            {itens.image? 
              <Image
                style={styles.image}
                source={{uri:itens.image}}
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
                onPress={() => {
                  setModalVisible(true)

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
                onPress={() => {
                  setModalVisible(true)

                }}
              />
            }
            </View>
          </View>
        </View>
    </Modal>
    {/* MODAL imagem*/}
    
    {/* MODAL pedido em andamento */}
    <Modal
    animationType="fade"
    transparent={true}
    visible={modal_pedido}
    >
      <View style={{flex:1,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center'}}>
        <View style={{backgroundColor:'#fff',width:'80%',justifyContent:'space-between',alignItems:'center',borderRadius:20}}>
          <View style={{width:'100%',flexDirection: 'row', justifyContent: 'flex-end', alignItems:'flex-start'}}>
            <Ionicons name="md-close-circle-sharp" size={45} color="#3C4043" onPress={()=>setModal_pedido(false)}/>
          </View>
          
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{justifyContent:'center',alignItems:'center'}}>
              <Image
                    style={{width:100,height:100}}
                    source={require('../../assets/logos/logo_madrugao.png')}
                    resizeMode="contain"
                    PlaceholderContent={
                          <ActivityIndicator size="large" color="#DE6F00" />
                  }
                  placeholderStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f8fafd'
                  }}
                  />
            </View>
            <Text style={{fontFamily:'Roboto-Bold',fontSize:20}}>Você já tem um pedido em andamento</Text>
            <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>Para adicionar, excluir ou alterar itens, é necessário entrar em contato com o Madrugão Lanches :</Text>
            <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#fff',padding:15,margin:20,borderRadius:10,borderWidth:1,borderColor:'#E81000',shadowColor:'#E81000',elevation:5}}>
              <TouchableOpacity onPress={()=>redirecionarParaLigacao(34911272)}>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>14 3491-1272</Text>
              </TouchableOpacity>
            </View>
            <Text style={{fontFamily:'Roboto-Regular',fontSize:15,margin:20}}>Informe seu user :</Text>
            <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#f4f7fc',padding:15}}>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>{props.user_info.name_on}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
    {/* MODAL pedido  em andamento*/}
              
  </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#003ffd',
    justifyContent: 'center',
    alignItems: 'center',
    //
    marginBottom: `15%`,
    // backgroundColor:'#de6f0024',

  },
  view_principal: {
    height: '90%',
    width: Dimensions.get('window').width/1.7,

    backgroundColor: '#3C4043',
    margin: 20,
    borderRadius: 25,

    justifyContent: 'space-between',
    alignItems: 'center',
    
  },

  //////////////////////////////////////////////// Image
  view_image: {
    width: '100%',
    height: '50%',

    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,

    backgroundColor: '#f8fafd',

  },
  image: {
    width: '100%',
    height: '100%',
  },
  //////////////////////////////////////////////// Text
  textContainer: {
    width: '100%',
    // backgroundColor: '#f4f7fc',
    // elevation: 5,
  },
  title: {
    fontSize: 20,
    // color: '#f8fafd',
    // marginLeft: 10,
    width: '65%',
    
    fontFamily: 'Roboto-Bold',

    // flexWrap: 'wrap',
  },
  description: {
    fontSize: 11,
    // color: '#f8fafd',

    fontFamily: 'Roboto-Regular',
    
  },
  //////////////////////////////////////////////// Icon
  iconContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    //
    // backgroundColor: '#f4f7fc',

    // elevation: 5,
  },
  ///////////////////////////////////////////////////// Button
  Button: {
    width: '80%',
    height: '200%',
    backgroundColor: '#f8fafd',
    borderRadius: 200,

    position: 'absolute',
    top: '20%',

    justifyContent: 'center',
    alignItems: 'center',

    borderColor: '#DE6F00',
    borderWidth: 0.7,
  }
});

const mapStateToProps = ({  user,cardapio,adicionar_pedido,message }: { user: any,cardapio:any,adicionar_pedido:any, message:any})=> {
  return {
    user_info: user.user_info,
    users: user.users,
    isModalOpen: cardapio.modal,
    //
    adicionar_itens: adicionar_pedido.adicionar_itens,
    //
    fechado_aberto: message.fechado_aberto,

      };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    Update_curtidas: (id:string,curtidas: number) => dispatch(update_On_curtidas(id,curtidas)),
    Update_curtidas_user: (id:string,curtidas: string,curtidas_array:string[]) => dispatch(update_On_curtidas_user(id,curtidas,curtidas_array)),
    AddComment: (id:string,comments: commentss2) => dispatch(addComment(id,comments)),
    Setmodal: (boolean:boolean) => dispatch(setModal_comments(boolean)),
    
    SetModal_fechado_aberto: (modal:boolean) => dispatch(setModal_Fechado_aberto(modal)),

    Set_add_itens: (itens:Item[]) => dispatch(setAdicionar_itens(itens)),
  };
}
export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Card));