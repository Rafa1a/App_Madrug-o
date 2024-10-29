import React, { useEffect, useRef } from 'react';
import {
    FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import Flatlist_carrinho from '../components/Flatlist_carrinho';
import { Item, pedido_inter, user_on } from '../interface/inter';
import { addItemToPedidos, setAdicionar_itens, set_carrinho_aviso_tutorialeentrega } from '../store/action/adicionar_pedido';
import { Input, Switch } from '@rneui/themed';
import {  setUser_rua_numero_celular, setUser_ultimo_pedido } from '../store/action/user';

import LottieView from 'lottie-react-native';
import { fetchatualizar_cardapio_pedidos_quantidade } from '../store/action/cardapio';
import { cardapio } from '../interface/inter_cardapio';
import analytics from '@react-native-firebase/analytics';

//

interface props_carrinho {
  navigation?:any
  user_info?:user_on
  adicionar_itens?:Item[]

  pedidos?:pedido_inter[]
  cardapio:cardapio[]
  onAddItemToPedidos?: (item:pedido_inter) => void;

  onSetAdicionar_itens?: (item:Item[]) => void;

  onPedidos_quantidades: (id:string,number:number) => void;

  onSetUser_rua_numero_celular?: (rua:string,numero:string,celular:string,id:string) => void;

  onSetUser_ultimo_pedido?: (ultimo_pedido:{}, id_user:string,user_ultimos_pedidos:any) => void;
  route?:any

  onSet_carrinho_aviso?: (alerta:boolean) => void
}

function Carrinho(props: props_carrinho) {
    
    //////////////////////////////////////////////////////////////  
    // console.log('ultimo_pedido', ultimo_pedido);
    // console.log('props.adicionar_itens',props.adicionar_itens)
    const [status_chapeiro, setStatus_chapeiro] = React.useState(false);
    const [status_bar, setStatus_bar] = React.useState(false);
    const [status_porcoes, setStatus_porcoes] = React.useState(false);
    // rua numero
    const [input_rua, setInput_rua] = React.useState('');
    const [input_numero, setInput_numero] = React.useState('');
    //novos inputs
    const [celular, setCelular] = React.useState('');
    const [observacao, setObservacao] = React.useState('');
    //novos inputs
    //////////////////////////////////////////////////////////////
    const [open, setOpen] = React.useState(false);
    //
    //////////////////////////////Forma de Pagamento
    const [pix, setPix] = React.useState(false);
    //dinheiro bolean
    const [dinheiro_bolean, setDinheiro_bolean] = React.useState(false);
    const [dinheiro_input, setDinheiro_input] = React.useState('');
    //caratao objeto
    const [cartao, setCartao] = React.useState(false);
    //bandeiras
    const [elo, setElo] = React.useState(false);
    const [visa, setVisa] = React.useState(false);
    const [mastercard, setMastercard] = React.useState(false);
    //bandeiras
    const [cartao_objeto, setCartao_objeto] = React.useState({
      elo:false,
      visa:false,
      mastercard:false,
    });
    //loading do pedido
    const [loading, setLoading] = React.useState(false);
    //cartao atualizar objeto
    useEffect(() => {
      setCartao_objeto({
        elo:elo,
        visa:visa,
        mastercard:mastercard,
      })
      if(cartao === false){
        setElo(false)
        setVisa(false)
        setMastercard(false)
      }

      //dinheiro
      if(dinheiro_bolean === false){
        setDinheiro_input('')
      }

    }, [elo,visa,mastercard,dinheiro_bolean,cartao,pix])
    //cartao atualizar objeto // fim
    ////////////////////////////////////////////////////////////// atualzar status bar chapeiro porcoes
    useEffect(() => {
      // verificar se um lanche existe em no adicionar_itens se existir chapeiro = true
      // verificar se um lanche existe em no adicionar_itens se existir bar = true
      // verificar se um lanche existe em no adicionar_itens se existir porcoes = true
      const newArray_chapeiro = props.adicionar_itens?props.adicionar_itens.filter((item)=>item.categoria === 'comidas' && item.categoria_2 === 'lanches' || item.categoria_2 === 'hotdogs' ) : []
      const newArray_bar = props.adicionar_itens?props.adicionar_itens.filter((item)=>item.categoria === 'bar' && item.categoria_2 === 'drinks' || item.categoria_2 === 'sucos' ) : []
      const newArray_porcoes = props.adicionar_itens?props.adicionar_itens.filter((item)=>item.categoria === 'comidas' && item.categoria_2 === 'porcoes' ) : []
      // console.log('newArray',newArray_chapeiro)
      if(newArray_chapeiro.length > 0){
        setStatus_chapeiro(true)
      }
      if(newArray_bar.length > 0){
        setStatus_bar(true)
      }
      if(newArray_porcoes.length > 0){
        setStatus_porcoes(true)
      }
      // console.log('status_chapeiro',status_chapeiro)
      // console.log('status_bar',status_bar)
      // console.log('status_porcoes',status_porcoes)
    }, [props.adicionar_itens])
    //atualizar inputs rua e numero
    useEffect(() => {
      setInput_rua(props.user_info.rua_on?props.user_info.rua_on:input_rua)
      setInput_numero(props.user_info.numero_on?props.user_info.numero_on.toString():input_numero)
      setCelular(props.user_info.celular?props.user_info.celular:celular)
    }, [props.user_info.rua_on,props.user_info.numero_on,props.user_info.celular])

    //ordem mais alta 
    const [ordem_mais_alta, setOrdem_mais_alta] = React.useState(0);
    useEffect(() => {
      // console.log('props.pedidos',props.pedidos)
      // Verifica se há pedidos
      if (props.pedidos && props.pedidos.length > 0) {
        // Encontra o pedido com a maior "ordem"
        const ordem_ = Math.max(...props.pedidos.map(pedido => pedido.ordem));
        // console.log(ordem_)
        // Incrementa a maior "ordem" encontrada
        let ordem = ordem_ + 1;
        // console.log(ordem)

        // Atualiza o estado
        setOrdem_mais_alta(ordem);
      } else {
        // Se não há pedidos, define a "ordem" como 1
        setOrdem_mais_alta(1);
      }
    }, [props.pedidos]); 
    //ordem mais alta// fim

    async function add_pedido  () {
      ///////////////ANALYTICS
      const analytics_purchase = async() => {
        const items_corretos = props.adicionar_itens?.map((item) => {
          return {
            item_brand: 'madrugao',
            item_id: item.id,
            item_name: item.name_p,
            price: item.valor_p,
            quantity: item.quantidade,
            item_category: item.categoria,
            item_category2: item.categoria_2,
          };
        });
        analytics().logPurchase({
          value: Number(calcular_total()),
          currency: 'BRL',
          items: items_corretos,
          shipping: open?0:5,
        });
      }
      ///////////////ANALYTICS
      //valor da ordem mais alta
      // console.log(props.pedidos)
      // console.log('ordem_mais_alta',ordem_mais_alta )
      //caso o status mesa seja true
      // const para o processo de pedido
      const pedidos_quantidades =  () => {
        props.adicionar_itens.forEach((item:any) => {
          props.cardapio.forEach((item2:any) => {
            if(item.id === item2.id){
               if(item2.versao){
                props.cardapio.forEach(async(item3:any) => {
                  if(item3.id === item2.versao){
                    const pedidos_quantidade = Number(item3.pedidos_quantidade||0) + item.quantidade
                    await props.onPedidos_quantidades(item3.id,pedidos_quantidade)
                  }
                })
              }
            }
          })
        });
      }
      if(props.user_info.status_mesa){

        const localidade_mesa: pedido_inter = {

              itens:props.adicionar_itens || [],

              localidade:'MESA',

              numero_mesa:props.user_info.mesa,

              ordem : ordem_mais_alta ,

              status:false,

              status_bar:status_bar,

              status_chapeiro:status_chapeiro,

              status_porcoes:status_porcoes,
              
            }
        props.onSet_carrinho_aviso(true);
        setLoading(true);
        pedidos_quantidades()
        await props.onAddItemToPedidos(localidade_mesa)
        props.onSetAdicionar_itens([])
        props.navigation.goBack()
        setLoading(false);
        analytics_purchase();
      }else {
        //caso o status mesa seja false
        const localidade_online: pedido_inter = {

              itens:props.adicionar_itens || [],

              localidade:'ONLINE',

              id_user:props.user_info.id,

              pegar_local:open,

              rua:input_rua,

              numero: (input_numero).toString(),

              celular:celular,

              ordem : ordem_mais_alta,

              status:false,

              status_bar:status_bar,

              status_chapeiro:status_chapeiro,

              status_porcoes:status_porcoes,

              pix:pix,

              dinheiro:Number(dinheiro_input) || 0,

              cartao:cartao_objeto,

              date  : Date.now(),

              observacao:observacao
            }
       
        // const para o processo de pedido
        const processOrder = async () => {
          props.onSet_carrinho_aviso(true);
          setLoading(true);
          pedidos_quantidades()
          await props.onAddItemToPedidos(localidade_online);
          props.onSetUser_ultimo_pedido(localidade_online, props.user_info.id, props.user_info.ultimos_pedidos || []);
          props.onSetAdicionar_itens([]);
          props.navigation.goBack();
          setLoading(false);
          if((input_rua !== props.user_info.rua_on || input_numero !== props.user_info.numero_on || celular !== props.user_info.celular)){
            props.onSetUser_rua_numero_celular(input_rua,input_numero,celular,props.user_info.id)
          }
          analytics_purchase();

        };
        //verificar se input rua e numero estao vazios
        if(input_numero === '' || input_rua === '' ){
          //pegar local estiver on
          if(open){
            if(celular === '') {
              Alert.alert('Telefone','Porfavor preenchas os campos de TELEFONE para continuar')
            }else if(dinheiro_bolean){
              //se dinheiro estiver on
              //se dinheiro input estiver vazio
              if(dinheiro_input === ''){
                Alert.alert('Troco','Preencha o valor do troco para continuar')
              }else if(Number(dinheiro_input)< Number(calcular_total())){
                Alert.alert('Troco','Valor do troco menor que o valor total')

              }else{
                processOrder()
              }
            }else if(cartao){
              //se cartao estiver on
              //se alguma bandeira estiver on
              if(elo || visa || mastercard){
                processOrder()
              }else {
                Alert.alert('Cartão','Selecione a bandeira do cartão')
              }
            }else if(pix){
              //se pix estiver on
              processOrder()
            }else{
              Alert.alert('Forma de Pagamento','Selecione a forma de pagamento') 
            }

          }else {
            Alert.alert('Preencha os campos','Porfavor preenchas os campos de RUA e NUMERO para continuar')
          }
        }else if(celular === ''){
          Alert.alert('Telefone','Porfavor preenchas o campo de TELEFONE para continuar')
        }else {
          if(dinheiro_bolean){
            //se dinheiro input estiver vazio
            if(dinheiro_input === ''){
              Alert.alert('Troco','Preencha o valor do troco para continuar')
            }else if(Number(dinheiro_input)< Number(calcular_total())){
              Alert.alert('Troco','Valor do troco menor que o valor total')

            }else{
              processOrder()
            }
          }else if(cartao){
            //se cartao estiver on
            //se alguma bandeira estiver on
            if(elo || visa || mastercard){
              processOrder()
            }else {
              Alert.alert('Cartão','Selecione a bandeira do cartão')
            }
          }else if(pix){
            //se pix estiver on
            processOrder()
          }else{
            Alert.alert('Forma de Pagamento','Selecione a forma de pagamento') 
          }
        }
      }
    }
    //aniamacao
  const animation = useRef(null);
    //aniamacao
    // console.log(props.user_info.status_mesa)
    // funtion calcular total
  function calcular_total(){
    // console.log(props.adicionar_itens)
    const total = props.adicionar_itens?.map((item) => (typeof item.valor_p === 'string' ? parseFloat(item.valor_p) : item.valor_p) * item.quantidade).reduce((a,b)=>a+b,0);
    // console.log(total);
    return total ? total.toFixed(2) : '0.00';
  }

  //funcao para dar scroll no final da tela
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePress = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  useEffect(() => {
    if(props.user_info.status_mesa === false || props.user_info.status_mesa === undefined){
      handlePress();
    }
    console.log('scroll',props.user_info.status_mesa)
  }, [open,dinheiro_bolean,cartao,pix]);
  //ANALYTICS
  useEffect(() => {
    const items_corretos = props.adicionar_itens?.map((item) => {
      return {
        item_brand: 'madrugao',
        item_id: item.id,
        item_name: item.name_p,
        price: item.valor_p,
        quantity: item.quantidade,
        item_category: item.categoria,
        item_category2: item.categoria_2,
      };
    });
    if(items_corretos && items_corretos.length > 0){
      console.log('items_corretos')
      analytics().logViewCart({
        items: items_corretos,
        value: Number(calcular_total()),
        currency: 'BRL',
      });
    }
  }, [])
  //ANALYTICS
    
  //ANALYTICS
  return (
    <SafeAreaView style={{flex:1,width:'100%',backgroundColor:'#f8fafd'}}>
      {props.adicionar_itens === undefined || props.adicionar_itens?.length === 0?
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <View >
          <Text style={{fontFamily:'Roboto-Regular',fontSize:25,margin:25}}>Carrinho Vazio :(</Text>
        </View>
        <View style={{width:'100%',height:'50%'}}>

          <LottieView
            autoPlay
            ref={animation}
            source={require('../../assets/anim/fantasma.json')}
          />
          
        </View>

      </View>
      :
      <>
        <ScrollView style={{flex:1}} contentContainerStyle={{flexGrow: 1}} ref={scrollViewRef} >
        
        {/* Flatlist itens */}
          <FlatList
              scrollEnabled={false}
              data={props.adicionar_itens?props.adicionar_itens:[]}
              renderItem={({ item,index }) => (
              <Flatlist_carrinho item={item} index={index}/>
              )}
              keyExtractor={(item,i) => i.toString()}
              // contentContainerStyle={{flex:1,width:'100%',backgroundColor:'#f8fafd' }}
          />
          {/* Flatlist itens */}
          {/* total  */}
          <View style={styles.container_total}>
              <View style={{flexDirection:'column',alignItems:'flex-start'}}>

                <Text style={styles.text_Total}>Total</Text>
              </View>
              <View style={{flexDirection:'column',alignItems:'flex-end'}}>
                {open ||  props.user_info.status_mesa ? null:
                <Text style={{color:'red',fontSize:14}}>Taxa de Entrega +5 </Text>}

                <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                  <Text style={[styles.text_valor,{fontSize:25}]}>R$: </Text>
                  {open || props.user_info.status_mesa?
                  <Text style={styles.text_valor}>{calcular_total()}</Text>: 
                  <Text style={styles.text_valor}>{(Number(calcular_total())+5).toFixed(2)}</Text> }
                </View>

              </View>

          </View>
          {/* total  */}
          {/* inputs rua e numero caso seja online */}
          {
            props.user_info.status_mesa === false || props.user_info.status_mesa === undefined ?
            <View style={styles.input}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:18,margin:25}}>Pegar no Local ?</Text>
                <Switch value={open} onValueChange={setOpen} />
              </View>

              {open?null:
                <>
                  <Text style={{ fontFamily:'OpenSans-Bold', fontSize:16}}>Cidade : Tupã-sp</Text>
                  <Input 
                  placeholder={props.user_info.rua_on?props.user_info.rua_on:'Rua'}
                  onChangeText={(text) => setInput_rua(text)}
                  value={input_rua}
                  // autoFocus={input_rua?false:true}
                  />
                    <Input 
                  placeholder={props.user_info.numero_on?props.user_info.numero_on.toString():'Numero da casa'}
                  onChangeText={(text) => setInput_numero(text)}
                  value={input_numero}
                  />
                </>
              }
              {/* tel celular do cliente ! */}
              <Text style={{fontFamily:'Roboto-Regular',fontSize:18,margin:25}}>Telefone :</Text>
              <Input 
                placeholder={props.user_info.celular?props.user_info.celular:'Telefone'}
                keyboardType={'numeric'}
                onChangeText={(text) => setCelular(text)}
                value={celular}
              />
              {/* observação */}
              <Text style={{fontFamily:'Roboto-Regular',fontSize:18,margin:25}}>Observação :</Text>
              <Input 
                placeholder={'Observação Opcional'}
                onChangeText={(text) =>  setObservacao(text)}
                value={observacao}
              />
              {/* button dinheiro cartao e pix */}
              <Text style={{fontFamily:'Roboto-Regular',fontSize:18,margin:25}}>Forma de Pagamento</Text>
                <View style={{flexDirection:'row',justifyContent:'space-around',margin:25,width:'100%'}}>
                  {/* dinheiro */}
                  <TouchableOpacity onPress={()=>{
                    setDinheiro_bolean(true)
                    setCartao(false)
                    setPix(false)
                    
                    }} style={[styles.button_dinheiro_cartao_pix,dinheiro_bolean?{backgroundColor:"#DE6F00"}:null]}>

                    <Text style={[{fontFamily:'Roboto-Regular',fontSize:18,color:'#f8fafd'},dinheiro_bolean?{color:'#f8fafd'}:{color:'#3C4043'}]}>Dinheiro</Text>
                  </TouchableOpacity>
                  {/* dinheiro fim*/}
                  {/* cartao */}
                  <TouchableOpacity onPress={()=>{
                    setCartao(true)
                    setDinheiro_bolean(false)
                    setPix(false)
                    
                    }} style={[styles.button_dinheiro_cartao_pix,cartao?{backgroundColor:"#DE6F00"}:null]}>
                    <Text style={[{fontFamily:'Roboto-Regular',fontSize:18,color:'#f8fafd'},cartao?{color:'#f8fafd'}:{color:'#3C4043'}]}>Cartão</Text>
                  </TouchableOpacity>
                  {/* cartao fim*/}
                  {/* pix */}
                  <TouchableOpacity onPress={()=>{
                    setPix(true)
                    setCartao(false)
                    setDinheiro_bolean(false)
                    
                    }} style={[styles.button_dinheiro_cartao_pix,pix?{backgroundColor:"#DE6F00"}:null]}>
                    <Text style={[{fontFamily:'Roboto-Regular',fontSize:18,},pix?{color:'#f8fafd'}:{color:'#3C4043'}]}>Pix</Text>
                  </TouchableOpacity>
                  {/* pix fim*/}
                </View>
              {/* button dinheiro cartao e pix // fim*/}
              {/* adicinar troco, qual bandeira do cartao */}
                {dinheiro_bolean?
                    <Input 
                      placeholder={'Troco para quanto ?'}
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9.]/g, '');
                        setDinheiro_input(numericText);
                      }}
                      value={dinheiro_input}
                      keyboardType={'numeric'}
                    />
                :null}
                {cartao?

                  <View style={{flexDirection:'row',justifyContent:'space-around',margin:25,width:'100%'}}>
                    <TouchableOpacity onPress={()=>{
                      setElo(true)
                      setVisa(false)
                      setMastercard(false)
                      }} style={[styles.button_dinheiro_cartao_pix,elo?{backgroundColor:"#DE6F00"}:null]}>
                      <Text style={[{fontFamily:'Roboto-Regular',fontSize:14,},elo?{color:'#f8fafd'}:{color:'#3C4043'}]}>Elo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                      setVisa(true)
                      setElo(false)
                      setMastercard(false)

                      }} style={[styles.button_dinheiro_cartao_pix,visa?{backgroundColor:"#DE6F00"}:null]}>
                      <Text style={[{fontFamily:'Roboto-Regular',fontSize:14,},visa?{color:'#f8fafd'}:{color:'#3C4043'}]}>Visa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                      setMastercard(true)
                      setElo(false)
                      setVisa(false)
                      }} style={[styles.button_dinheiro_cartao_pix,mastercard?{backgroundColor:"#DE6F00"}:null]}>
                      <Text style={[{fontFamily:'Roboto-Regular',fontSize:14,},mastercard?{color:'#f8fafd'}:{color:'#3C4043'}]}>Mastercard</Text>
                    </TouchableOpacity>
                  </View>

                  :null}
              {/* adicinar troco, qual bandeira do cartao // fim*/}

            
            </View>
            :
            null
          }
          {/* inputs rua e numero caso seja online */}

          {/* button finalizar pedido */}
        </ScrollView>
        <TouchableOpacity style={styles.container_button}  onPress={()=>{add_pedido()}}>
              {loading?<ActivityIndicator size="large" color="#f8fafd" />
              :<Text style={{fontFamily:'Roboto-Bold',color:'#f8fafd',fontSize:25}}>Pedir</Text>}
              
        </TouchableOpacity> 
        {/* button finalizar pedido */}

      </>}
      
               
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container_button: {
    height: 50,

    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#DE6F00'

  },
  input: {
    alignItems:'center',
    justifyContent:'center',
    elevation: 6,

    shadowColor: '#e80f00b5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    borderRadius: 10,

    backgroundColor:'#fff',
    

    margin: 15,
  },
  //ESTILO button dinheiro cartão
  button_dinheiro_cartao_pix: {
    height: 50,
    width: '25%',
    borderRadius: 15,
    alignItems:'center',
    justifyContent:'center',
    elevation: 6,

    backgroundColor:'#f8fafd'

  },
  container_total: {
    height: 50,

    alignItems:'flex-end',
    justifyContent:'space-around',
    backgroundColor:'#f8fafd',
    flexDirection:'row',

  },
  text_Total:{
    fontFamily:'OpenSans-Regular',
    fontSize:25,
    color:'#3C4043'

  },
  text_valor:{
    fontFamily:'OpenSans-Bold',
    fontSize:30,
    color:'#3C4043'
  },
});

const mapStateToProps = ({  adicionar_pedido,user,pedidos,cardapio }: { adicionar_pedido:any,user:any,pedidos:any,cardapio:any})=> {
    return {
      adicionar_itens: adicionar_pedido.adicionar_itens,
      user_info: user.user_info,

      pedidos: pedidos.pedidos,

      cardapio:cardapio.cardapio,

      


        };
  };
const mapDispatchProps = (dispatch: any) => {
  return {
    onAddItemToPedidos: (item:any) => dispatch(addItemToPedidos(item)),
    onSetAdicionar_itens: (item:any) => dispatch(setAdicionar_itens(item)),
    onSetUser_rua_numero_celular: (rua:string,numero:string,celula:string,id:string) => dispatch(setUser_rua_numero_celular(rua,numero,celula,id)),
    onSetUser_ultimo_pedido: (ultimo_pedido:{}, id_user:string,user_ultimos_pedidos) => dispatch(setUser_ultimo_pedido(ultimo_pedido,id_user,user_ultimos_pedidos)),
    onPedidos_quantidades: (id:string,number:number) => dispatch(fetchatualizar_cardapio_pedidos_quantidade(id,number)),
    onSet_carrinho_aviso: (alerta:boolean) => dispatch(set_carrinho_aviso_tutorialeentrega(alerta))
  };
};
export default connect(mapStateToProps, mapDispatchProps)(Carrinho)
