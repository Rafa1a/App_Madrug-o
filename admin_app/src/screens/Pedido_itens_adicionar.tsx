import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert
} from 'react-native';
import Header_pedido from '../components/Header_Pedido';
import Lista from '../components/Lista_Pedido_adicionar';
import { connect } from 'react-redux';
import { fetchatualizar_pedido, fetchatualizar_pedido_mesa } from '../store/action/pedidos';
import { pedido_itens_comp,cartao } from '../interface/inter';
import { Switch } from '@rneui/themed';
import { addItemToPedidos, setAdicionar_pedido } from '../store/action/adicionar_pedido';
import { CheckBox } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchatualizar_cardapio_pedidos_quantidade } from '../store/action/cardapio';
import { fetchAtualizarUser_status_mesa } from '../store/action/user';

//////////////////////////////////////////////////
const Pedido_itens_adicionar = ({ route, total, adicionar_pedido,onAdicionarPedido,navigation,onAdicionar_pedido,onPedidos_quantidades,inicial_state_outros,pedidos,inicial_state_mesas,cardapio, }: pedido_itens_comp & { total: number }) => {
  
  const { numero_mesa, mesa } = route.params;
  
  // console.log(numero_mesa,mesa)
 

  
  // Ordens de pedidos
  useEffect(()=>{
    const ordemMaisAlta = () => {
      if (pedidos.length === 0) {
        return 0; // Retorna 0 se não houver pedidos
      }
  
      // Encontrar o pedido com a ordem mais alta
      const ordens = pedidos.map(item => item.ordem);
      const ordemMaxima = Math.max(...ordens);
      // console.log(ordemMaxima + 1)
      return ordemMaxima + 1;
    };
   if(mesa){
      inicial_state_mesas.numero_mesa = numero_mesa
      inicial_state_mesas.ordem = ordemMaisAlta()
   } else {
      inicial_state_outros.ordem = ordemMaisAlta() 
   }
  },[pedidos])
  
    //state de rua numero e local// uso apenas para OUTROS
    const [nome, setNome] = useState('');
    const [celular, setCelular] = useState('');
    const [textRua, setTextRua] = useState('');
    const [textNumero, setTextNumero] = useState('');
    const [pegarLocal, setPegarLocal] = useState(false);
    //dinhiero
    const [dinheiro, setDinheiro] = useState('');
    //cartao
    const [visa, setVisa] = useState(false);
    const [mastercard, setMastercard] = useState(false);
    const [elo, setElo] = useState(false);
    const [cartao, setCartao] = useState<cartao>({visa:visa,mastercard:mastercard,elo:elo});
    //pix
    const [pix, setPix] = useState(false);
    //checkbox:
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
  //definir :

  // Definir rua, número e pegar local em inicial_state_outros
    useEffect(() => {
      if(!mesa) {
        inicial_state_outros.name_outros = nome;
        inicial_state_outros.celular = celular;
        inicial_state_outros.rua = textRua;
        inicial_state_outros.numero= textNumero;
        inicial_state_outros.pegar_local = pegarLocal;
        inicial_state_outros.dinheiro = Number(dinheiro);
        inicial_state_outros.cartao = cartao;
        inicial_state_outros.pix = pix;

      }
    }, [textRua, textNumero, pegarLocal,pix,cartao,dinheiro]);
    //estado do cartao
    useEffect(()=>{
      setCartao({visa:visa,mastercard:mastercard,elo:elo})
    },[visa,mastercard,elo])

  // Função para definir os status com base nos itens
  const definirStatus = () => {
    let status_chapeiro = false;
    let status_porcoes = false;
    let status_bar = false;

    // Verificar cada item em inicial_state_outros.itens
    adicionar_pedido.forEach((item:any) => {
      if (item.categoria === 'comidas' && (item.categoria_2 === 'lanches' || item.categoria_2 === 'hotdogs' || item.categoria_2 === 'combos')) {
        status_chapeiro = true;
      } else if (item.categoria_2 === 'porcoes') {
        status_porcoes = true;
      } else if (item.categoria === 'bar') {
        status_bar = true;
      }
    });

    // Retornar os status
    return { status_chapeiro, status_porcoes, status_bar };
  };
  
  const { status_chapeiro, status_porcoes, status_bar } = definirStatus();
  //atualizar os status em tempo real quando for excluido
  useEffect(() => {
    // console.log('status_chapeiro:', status_chapeiro);
    // console.log('status_porcoes:', status_porcoes);
    // console.log('status_bar:', status_bar);  
    if(mesa) {
      inicial_state_mesas.status_chapeiro = status_chapeiro;
      inicial_state_mesas.status_porcoes = status_porcoes;
      inicial_state_mesas.status_bar = status_bar;
    }else {
      inicial_state_outros.status_chapeiro = status_chapeiro;
      inicial_state_outros.status_porcoes = status_porcoes;
      inicial_state_outros.status_bar = status_bar;
    }
  }, [status_chapeiro, status_porcoes, status_bar]);

  //atualizar estado ao excluir
  useEffect(() => {
    if(mesa){
      inicial_state_mesas.itens = adicionar_pedido;
      inicial_state_mesas.observacao = adicionar_pedido.map((item:any) => `${item.name_p} : ${item.observacao}`).join('\n');
    }else {
      inicial_state_outros.itens = adicionar_pedido;
      inicial_state_outros.observacao = adicionar_pedido.map((item:any) => `${item.name_p} : ${item.observacao}`).join('\n');
    }
    console.log(adicionar_pedido)
  }, [adicionar_pedido]);


 

  const [loading, setLoading] = useState(false);
  console.log(pegarLocal)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        {/* ... outros componentes ... */}
        <Header_pedido adicionar numero_mesa={numero_mesa} />

        <Lista  />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <View style={{flexDirection:'column',alignItems:'flex-end'}}> 
          {/* taxa de entrega */}
          {(pegarLocal === false || pegarLocal === undefined) && !numero_mesa?<Text style={{color:'red'}}>Taxa de entrega: + 5</Text>: null}
          {(pegarLocal === false || pegarLocal === undefined) && !numero_mesa?<Text style={styles.totalValue}>${total + 5}</Text>:<Text style={styles.totalValue}>${total }</Text>}
          </View>
        </View>
        <View style={styles.divider} />
        {/* condicao caso mesa seja verdadeiro */}
        {mesa?null:(
        <>
          <View style={styles.colunContainer}>
            <TextInput
              placeholder="Nome"
              style={[styles.input,{marginBottom:15}]}
              value={nome}
              onChangeText={(text) => setNome(text)}
            />
            <TextInput
              placeholder="Celular"
              style={[styles.input,{marginBottom:15}]}
              value={celular}
              onChangeText={(text) => setCelular(text)}
            />
            <View style={styles.inputContainer}>
              
              <View style={styles.rowContainer}>
                  <TextInput
                    placeholder="Rua"
                    style={styles.input}
                    value={textRua}
                    onChangeText={(text) => setTextRua(text)}
                  />
                  <TextInput
                    placeholder="Número"
                    style={styles.input}
                    value={textNumero}
                    onChangeText={(text) => setTextNumero(text)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.colunContainer_switch}>
                  <Text style={styles.switchLabel}>Pegar no local?</Text>
                  <Switch
                    onValueChange={() => setPegarLocal(!pegarLocal)}
                    value={pegarLocal}
                  />
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.totalText}>Forma de Pagamento: </Text>
              <View style={styles.checkboxGroup}>
                <CheckBox
                  center
                  title="Dinheiro"
                  checked={check1}
                  onPress={() => {
                    setCheck1(!check1)
                    setCheck2(false)
                    setPix(false)
                  }}
                  iconRight

                  containerStyle={check1?styles.colorLig_checkbox:styles.colorBlack_checkbox}
                  textStyle={check1?styles.color_text_checkbox_lig
                    :styles.color_text_checkbox_black}
                  iconType="material-icons"
                  checkedIcon="check-box"
                  uncheckedIcon='check-box-outline-blank'
                />
                {/* DINHEIRO input */}
                  {
                  check1?
                      <TextInput
                        style={styles.input_valor_troco}
                        value={dinheiro}
                        onChangeText={setDinheiro}
                        placeholder="Valor para o troco"
                        keyboardType="numeric"
                      />
                      :null
                      }
              </View>
              <View style={styles.checkboxGroup}>
 
                <CheckBox
                  center
                  title="Cartão"
                  checked={check2}
                  onPress={() => {
                    setCheck2(!check2)
                    setCheck1(false)
                    setPix(false)
                    //definir estado do cartao como falso 
                    setVisa(false)
                    setMastercard(false)
                    setElo(false)
                  }}
                  iconRight

                  containerStyle={check2?styles.colorLig_checkbox:styles.colorBlack_checkbox}
                  textStyle={check2?styles.color_text_checkbox_lig
                    :styles.color_text_checkbox_black}

                  iconType="material-icons"
                  checkedIcon="check-box"
                  uncheckedIcon='check-box-outline-blank'

                />
                {/* CARTAO itens */}
                  {
                    check2?
                    <View style={styles.cardContainer}>

                      <CheckBox
                        center
                        title="Visa"
                        checked={visa}
                        onPress={() => {
                          setVisa(!visa)
                          setMastercard(false)
                          setElo(false)
                        }}
                        containerStyle={visa?styles.colorLig_checkbox:styles.colorBlack_checkbox}
                        textStyle={visa?styles.color_text_checkbox_lig
                          :styles.color_text_checkbox_black}

                      />
                      <CheckBox
                        center
                        title="Mastercard"
                        checked={mastercard}
                        onPress={() => {
                          setMastercard(!mastercard)
                          setVisa(false)
                          setElo(false)
                        }}
                        containerStyle={mastercard?styles.colorLig_checkbox:styles.colorBlack_checkbox}
                        textStyle={mastercard?styles.color_text_checkbox_lig
                          :styles.color_text_checkbox_black}
                      />
                      <CheckBox
                        center
                        title="Elo"
                        checked={elo}
                        onPress={() => {
                          setElo(!pix)
                          setMastercard(false)
                          setVisa(false)
                        }}
                        containerStyle={elo?styles.colorLig_checkbox:styles.colorBlack_checkbox}
                        textStyle={elo?styles.color_text_checkbox_lig
                          :styles.color_text_checkbox_black}
                      />
                      
                    </View>
                    :null
                  }
              </View>
              <View style={styles.checkboxGroup}>

                <CheckBox
                  center
                  title="Pix"
                  checked={pix}
                  onPress={() => {
                    setPix(!pix)
                    setCheck2(false)
                    setCheck1(false)
                    setDinheiro('')
                    setVisa(false)
                    setMastercard(false)
                    setElo(false)
                  }
                  }
                  iconRight
                  size={20}

                  containerStyle={pix?styles.colorLig_checkbox:styles.colorBlack_checkbox}
                  textStyle={pix?styles.color_text_checkbox_lig
                    :styles.color_text_checkbox_black}

                  iconType="material-icons"
                  checkedIcon="check-box"
                  uncheckedIcon='check-box-outline-blank'
                />
              </View>

            </View>
          
        </>)}


          
          {/* button finalizar pedido */}
        <TouchableOpacity onPress={() => {
          //atualizar pedido
          const finalizar_pedido = async() => {
              setLoading(true)
              adicionar_pedido.forEach(async(item:any) => {
                cardapio.forEach(async(item2:any) => {
                  if(item.id === item2.id){
                    if(item2.versao){
                      cardapio.forEach(async(item3:any) => {
                        if(item3.id === item2.versao){
                          const pedidos_quantidade = Number(item3.pedidos_quantidade||0) + item.quantidade
                          await onPedidos_quantidades(item3.id,pedidos_quantidade)
                        }
                      })
                    }
                  }
                })
              })
              
              //enviar para o banco de dados
              await onAdicionarPedido(inicial_state_outros)
              setLoading(false)
              // //atualizar estado itens
              onAdicionar_pedido([])
              // //atualizar estado inicial
              navigation?.goBack();  // Voltar uma vez
              navigation?.goBack();  // Voltar mais uma vez
            }
            if(mesa){
              const finalizar_mesa = async() => {
                adicionar_pedido.forEach(async(item:any) => {
                  cardapio.forEach(async(item2:any) => {
                    if(item.id === item2.id){
                      if(item2.versao){
                        cardapio.forEach(async(item3:any) => {
                          if(item3.id === item2.versao){
                            const pedidos_quantidade = Number(item3.pedidos_quantidade||0) + item.quantidade
                            await onPedidos_quantidades(item3.id,pedidos_quantidade)
                          }
                        })
                      }
                    }
                  })
                })
                await onAdicionarPedido(inicial_state_mesas)
                setLoading(false)
                // //atualizar estado itens
                onAdicionar_pedido([])
                // //atualizar estado inicial
                navigation?.goBack();  // Voltar uma vez
                navigation?.goBack();  // Voltar mais uma vez
              }
              finalizar_mesa()
            }else {
              if(pegarLocal) {

                setTextNumero('')
                setTextRua('')
                if(check1 || check2 || pix){
                  if(check1){
                    if(dinheiro!==''){
                      
                      finalizar_pedido()

                    }else{
                      Alert.alert('Defina o valor para o troco')
                    }
                  }else if(check2){
                    if(visa || mastercard || elo){
                      
                      finalizar_pedido()

                    }else{
                      Alert.alert('Defina o cartão')
                    }
                  }else if (pix){
                      
                    finalizar_pedido()

                  }
                }else {
                  Alert.alert('Por favor escolher Forma de Pagamento')
                }

              }else if(textRua !== '' && textNumero !== ''){

                setPegarLocal(false)
                if(check1 || check2 || pix){
                  if(check1){
                    if(dinheiro!==''){
                      
                      finalizar_pedido()

                    }else{
                      Alert.alert('Defina o valor para o troco')
                    }
                  }else if(check2){
                    if(visa || mastercard || elo){
                      finalizar_pedido()

                    }else{
                      Alert.alert('Defina o cartão')
                    }
                  }else if (pix){
                      
                    finalizar_pedido()

                  }
                }else {
                  Alert.alert('Por favor escolher Forma de Pagamento')
                }
              }else{
                Alert.alert('Por favor preencher : \n Rua, Número ou Pegar no local')
              }
              // console.log(inicial_state_outros)
              // onAdicionarPedido(inicial_state_outros)
          }
         
          }} style={styles.button}>
            {loading?( <Text style={styles.buttonText}>Carregando...</Text>)
            :<Text style={styles.buttonText}>Finalizar</Text>}
          
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#202124",
    width: '100%',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  button: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'tomato',
    padding: 10,
    height: 160,
    width: 160,
    borderRadius: 100,
    margin: 5,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#DE6F00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC',
    fontSize: 30,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: '#F4F7FC',
    borderBottomWidth: 0.5,
    width: '100%',
    marginBottom: 10
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end',
    width: '90%',
    marginBottom: 10,
  },
  totalText: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 30,
  },
  totalValue: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,  // Adicione um espaçamento horizontal
    width: '80%',  // Use 100% da largura disponível
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 15,
    backgroundColor:'#F4F7FC',
  },
  input_valor_troco: {
    flex: 1,
    margin: 30,
    backgroundColor:'#F4F7FC',
    borderRadius:50
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  colunContainer_switch: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC',
    fontSize: 13,
    marginRight: 10,
  },
////////////////////////////////// chebox

  colunContainer:{
    flexDirection: 'column',
  },
  checkboxGroup: {
    marginBottom: 20,
    
  },
  
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
//////////////////////////////////colors chebox
  colorBlack_checkbox:{
    borderRadius:50,
    backgroundColor:'#3c4043'
  }
  ,colorLig_checkbox:{
    borderRadius:50,
    backgroundColor:'#F4F7FC'
  },
  color_text_checkbox_black:{
    color:"#f8fafd",
    fontFamily: 'OpenSans-Regular',
    fontSize:15,
  },
  color_text_checkbox_lig:{
    color:"#3c4043",
    fontFamily: 'OpenSans-Regular',
    fontSize:15,
  },

});

const mapStateProps = ({ pedidos,state,cardapio,user }: { pedidos: any,state:any,cardapio:any,user:any }) => {
  return {
    pedidos: pedidos.pedidos,
    total: pedidos.total,
    adicionar_pedido:pedidos.adicionar_pedido,
    inicial_state_outros:state.state_outros,
    inicial_state_mesas:state.state_mesas,

    cardapio:cardapio.cardapio,

    users_on:user.users,


  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAdicionarPedido: (item:any) => dispatch(addItemToPedidos(item)),
    onAdicionar_pedido: (pedido:[]) => dispatch(setAdicionar_pedido(pedido)),
    onPedidos_quantidades: (id:string,number:number) => dispatch(fetchatualizar_cardapio_pedidos_quantidade(id,number)),
   
  };
};
export default connect(mapStateProps, mapDispatchProps)(Pedido_itens_adicionar);
