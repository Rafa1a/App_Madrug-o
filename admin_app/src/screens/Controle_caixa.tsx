import { Button, Divider } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
    Alert,
    Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Loja_up, controle_caixa_add, set_Abertura_valor } from '../store/action/message_fechado_aberto';
import { connect } from 'react-redux';
import { pedido_inter } from '../interface/inter';
import { AntDesign } from '@expo/vector-icons';
import { deletePedidos } from '../store/action/pedidos';
import { fetchAtualizarCardapioIdPedidosLimpeza } from '../store/action/cardapio';
import { fetchAtualizarUserLimpeza } from '../store/action/user';
import { NavigationProp } from '@react-navigation/native';
import { fetchUpdatePaes, setPaes } from '../store/action/paes';

interface Controle_caixa_props {
    fechado_aberto: {
        id:string,
        fechado_aberto:string,
        data_fechado_aberto:Date
        abertura:number,
    },
    onFechar_abrir: (id:string,fechado_aberto:any,data_fechado_aberto:any,abertura:number) => void
    pedidos: pedido_inter[],

    abertura_valor: number,
    setAbertura_valor: (valor:any) => void

    onControle_caixa_add : (
        data_abertura:number,
        data_fechamento:number,
        abertura:number,
        total:number,
        lucro:number,
        dinheiro_caixa:number,
        cartao_caixa:number,
        pix_caixa:number,
        pedidos:any ) => void
    onDelete_all:() => void	
    onAtualizar_is_pedidos_cardapio:() => void
    onAtualizar_user_Limpeza:() => void
    navigation: NavigationProp<any>
    paes: {
        hamburguer:number,
        frances:number,
        sirio:number,
        id:string
    }
    UpdatePaes : (hamburguer:any,frances:any,sirio:any,id:string) => void
}
const Controle_caixa = (props: Controle_caixa_props) =>{
    ///////////////////////Aberturar e fechamento do caixa////////////////////////
    const [modalVisible, setModalVisible] = useState(false);
    //atualizar para aberto automaticamente caso esteja fechadodata 
    /////////////////////////Modal////////////////////////
    const data_fechado_aberto = new Date(props.fechado_aberto.data_fechado_aberto)

    //fechadodata
    const data_hoje = new Date();
    const [data, setData] = useState(new Date());
    const [datavisible, setDatavisible] = useState(false);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [hour, setHour] = useState('');
    const [minutes, setMinutes] = useState('');
    useEffect(() => {
        const data_naw = new Date(`${data_hoje.getFullYear()}-${month}-${day}T${hour}:${minutes}:00.000Z` )
        setData(data_naw)
        //  console.log(data_hoje.getDate(), data.getDate())
        // console.log('rafa',day,month,hour,minutes)
        
    }, [day,month,hour,minutes]); 
    
    //atualiando o fechado_aberto para aberto caso a data seja menor que a atual
    useEffect(() => { 
        // console.log('fechado_aberto',props.fechado_aberto,data_hoje.getTime(),data.getTime())
        if (props.fechado_aberto.fechado_aberto === 'fechadodata'){
            if(data_hoje.getTime() > data_fechado_aberto.getTime() ){   
                props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime() || 0, new Date().getTime())
                // console.log('fechado_abert2o',props.fechado_aberto) 
            } 
        //props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime())
        } 
    },[data_hoje.getTime()]);
    /////////////////////////Modal////////////////////////

    ///////////////////Dados do caixa////////////////////////////////////

    const [abertura, setAbertura] = useState(200)
    const [total, setTotal] = useState(0)
    //abertura valor
    useEffect(() => {
        setAbertura(props.abertura_valor)
        // console.log('abertura',props.abertura_valor)
    },[props.abertura_valor])
    //total
    useEffect(() => {
        // console.log('pedidos',props.pedidos)
        let total = 0
        props.pedidos.map((pedido:pedido_inter) => {
            if(pedido.status === false) return
            if(pedido.localidade === 'MESA'){
                total += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
            }else {
                if(pedido.pegar_local === false || pedido.pegar_local === undefined){
                    total += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                    total += 5
                }else {
                    total += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                }
            }
        })
        setTotal(total)
    },[props.pedidos])

    const [dinheiro, setDinheiro] = useState(0)
    const [cartao, setCartao] = useState(0)
    const [pix, setPix] = useState(0)

    useEffect(() => {
        let dinheiro = 0
        let cartao = 0
        let pix = 0
        props.pedidos.map((pedido:pedido_inter) => {
            if(pedido.status === true) {
                if(pedido.localidade === 'MESA'){
                    if(pedido.dinheiro_mesa) dinheiro += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                    if(pedido.cartao_mesa)  cartao += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                    if(pedido.pix_mesa)  pix += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                }else {
                    if(pedido.pegar_local === false || pedido.pegar_local === undefined){
                        if(pedido.dinheiro) {
                            dinheiro += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                            dinheiro += 5
                        } 
                        if(pedido.cartao.visa || pedido.cartao.mastercard || pedido.cartao.elo)  {
                            cartao += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                            cartao += 5
                        }
                        if(pedido.pix)  {
                            
                            pix += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1 )  || 0, 0)
                            pix += 5
                        }
                    } else {
                        if(pedido.dinheiro) dinheiro += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                        if(pedido.cartao.visa || pedido.cartao.mastercard || pedido.cartao.elo)  cartao += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                        if(pedido.pix)  pix += pedido.itens.reduce((acc, item) => acc + (item.valor_p * item.quantidade||1) || 0, 0)
                    }
                }
            }
        })
        setDinheiro(dinheiro)
        setCartao(cartao)
        setPix(pix)
    },[props.pedidos])

    //quando abrir a primeira vez definir data de abertura
    const [data_abertura, setData_abertura] = useState(new Date())

    useEffect(() => {
        if(props.fechado_aberto.fechado_aberto === 'aberto'){
            setData_abertura(new Date(props.fechado_aberto.abertura)) 
        }
    },[props.fechado_aberto])

    ///////////////////Dados do caixa////////////////////////////////////
    ///////////////////PAES HAMBURGUER OU FRANCES////////////////////////////////////
    const [hamburguer, setHamburguer] = useState(0)
    const [hamburguer_valor, setHamburguer_valor] = useState(props.paes.hamburguer)
    const [frances, setFrances] = useState(0)
    const [frances_valor, setFrances_valor] = useState(props.paes.frances)
    const [sirio, setSirio] = useState(0)
    const [sirio_valor, setSirio_valor] = useState(props.paes.sirio)
    const [click_hamburguer, setClick_hamburguer] = useState(false)
    const [click_frances, setClick_frances] = useState(false)
    const [click_sirio, setClick_sirio] = useState(false)

   useEffect(() => {
    console.log('paes >>>',props.paes) 
    console.log('hamburguer',hamburguer_valor) 
    if(props.paes){
        setHamburguer_valor(props.paes.hamburguer)
        setFrances_valor(props.paes.frances)
        setSirio_valor(props.paes.sirio)
    }
    },[props.paes])

    useEffect(() => {
        const funupdate_paes = async() => {
            if (props.paes.hamburguer !== hamburguer_valor || props.paes.frances !== frances_valor || props.paes.sirio !== sirio_valor) {
                await props.UpdatePaes(hamburguer_valor,frances_valor,sirio_valor,props.paes.id)
            }
        }
        funupdate_paes()
    },[hamburguer_valor,frances_valor,sirio_valor])
    ///////////////////PAES HAMBURGUER OU FRANCES////////////////////////////////////
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={{width:'100%',flex:1}}>
            <View style={styles.container}>
                {/* aberto fechado */}
                <TouchableOpacity
                style={{
                    backgroundColor: props.fechado_aberto.fechado_aberto === 'fechado'? 'red' : props.fechado_aberto.fechado_aberto === 'fechadodata'?'#c26a05':'green',
                    padding: 20,
                    width: '80%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    margin: 10,
                    // Adicione outros estilos conforme necessário
                }}
                onPress={() => {
                    setModalVisible(true)
                    // Adicione a ação do botão aqui
                }}
                >
                {props.fechado_aberto.fechado_aberto === 'fechado' ? 
                <Text style={{color:'white'}}>Fechado</Text> 
                : props.fechado_aberto.fechado_aberto === 'fechadodata' ? 
                <Text style={{color:'white'}}>
                    fechado abre :{'\n'} {data_fechado_aberto.getDate()}/{data_fechado_aberto.getMonth()+1} ás {data_fechado_aberto.getHours().toString().padStart(2, '0')}:{data_fechado_aberto.getMinutes().toString().padStart(2, '0')}
                </Text> 
                : <Text style={{color:'white'}}>Aberto</Text>}
                </TouchableOpacity>
                {/* aberto fechado */}
                
                {/* data abertura */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 10,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    // Adicione outros estilos conforme necessário
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:18}}>Data de Abertura : </Text>
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:17}}>{props.fechado_aberto.fechado_aberto === 'fechado' || props.fechado_aberto.fechado_aberto ===  'fechadodata'?'Fechado':data_abertura.toLocaleString()}</Text>
                </View>
                {/* data abertura */}

                <Divider style={{width:'100%',margin:2}}/>

                {/* Valor de abertura */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 20,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    margin: 10,
                    // Adicione outros estilos conforme necessário
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Abertura : </Text>
                    <TextInput
                        style={{backgroundColor:'#fff',padding:10,borderRadius:5,width:100}}
                        onChangeText={(text) => props.setAbertura_valor(Number(text))}
                        value={props.abertura_valor.toString()}
                        keyboardType="numeric"
                    />
                </View>
                {/* Valor de abertura */}

                <Divider style={{width:'100%',margin:2}}/>

                {/* Total */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 10,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    // Adicione outros estilos conforme necessário
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Total : </Text>
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{abertura+total}</Text>
                </View>
                {/* Total */}

                <Divider style={{width:'100%',margin:2}}/>

                {/* Lucro */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 10,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    // Adicione outros estilos conforme necessário
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Lucro : </Text>
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{total}</Text>
                </View>
                {/* Lucro */}

                <Divider style={{width:'100%',margin:2}}/>

                {/* dinheiro vendas */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 5,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    // Adicione outros estilos conforme necessário
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:19}}>Dinheiro : </Text>
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{dinheiro}</Text>
                </View>
                {/* dinheiro vendas */}

                {/* cartao vendas */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 5,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    // Adicione outros estilos conforme necessário
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:19}}>Cartão : </Text>
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{cartao}</Text>
                </View>
                {/* cartao vendas */}
                
                {/* pix vendas */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 5,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    // Adicione outros estilos conforme necessário
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:19}}>Pix : </Text>
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{pix}</Text>
                </View>
                {/* pix vendas */}
                <Divider style={{width:'100%',margin:2}}/>
                {/* paes hamburgue ou frances iniciou : */}
                <View
                style={{
                    flexDirection: 'row',
                    padding: 20,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    margin: 10,
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Hamburguer : </Text>
                    <TouchableOpacity style={{}} onPress={()=>setClick_hamburguer(true)}>
                        <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{hamburguer_valor}</Text>
                    </TouchableOpacity>
                    {click_hamburguer?
                    <>
                    <TextInput
                        style={{backgroundColor:'#fff',padding:10,borderRadius:5,width:100}}
                        onChangeText={(text) => setHamburguer(Number(text))}
                        value={hamburguer.toString()}
                        keyboardType="numeric"
                    />
                    <AntDesign name="check" size={24} color="#0fe421" onPress={() => {
                        setHamburguer_valor(hamburguer)
                        setClick_hamburguer(false)}}/>
                    </>:null
                    }
                </View>
                {/* paes hamburgue ou frances */}
                <Divider style={{width:'100%',margin:2}}/>
                <View
                style={{
                    flexDirection: 'row',
                    padding: 20,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    margin: 10,
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Frances : </Text>
                    <TouchableOpacity style={{}} onPress={()=>setClick_frances(true)}>
                        <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{frances_valor}</Text>
                    </TouchableOpacity>
                    {click_frances?
                    <>
                    <TextInput
                        style={{backgroundColor:'#fff',padding:10,borderRadius:5,width:100,margin:10}}
                        onChangeText={(text) => setFrances(Number(text))}
                        value={frances.toString()}
                        keyboardType="numeric"
                    />
                    <AntDesign name="check" size={24} color="#0fe421" onPress={() => {
                        setFrances_valor(frances)
                        setClick_frances(false)}}/>
                    </>:null
                    }
                    
                </View>
                <Divider style={{width:'100%',margin:2}}/>
                <View
                style={{
                    flexDirection: 'row',
                    padding: 20,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 5,
                    margin: 10,
                }}
                >
                    <Text style={{color:'white',margin:10,fontFamily:'Roboto-Regular',fontSize:20}}>Sirio : </Text>
                    <TouchableOpacity style={{}} onPress={()=>setClick_sirio(true)}>
                        <Text style={{color:'white',margin:10,fontFamily:'Roboto-Light',fontSize:20}}>{sirio_valor}</Text>
                    </TouchableOpacity>
                    {click_sirio?
                    <>
                    <TextInput
                        style={{backgroundColor:'#fff',padding:10,borderRadius:5,width:100,margin:10}}
                        onChangeText={(text) => setSirio(Number(text))}
                        value={sirio.toString()}
                        keyboardType="numeric"
                    />
                    <AntDesign name="check" size={24} color="#0fe421" onPress={() => {
                        setSirio_valor(sirio)
                        setClick_sirio(false)}}/>
                    </>:null
                    }
                </View>
                {/* paes hamburgue ou frances */}
                
                {/* button para navegar ate caixas anteriores */}
                <TouchableOpacity 
                    onPress={() => props.navigation.navigate('Caixas_anteriores')}
                    style={{
                        backgroundColor: '#4c6baf', // Define a cor de fundo do botão
                        borderColor: '#FFFFFF', // Define a cor da borda do botão
                        borderWidth: 1, // Define a largura da borda do botão
                        borderRadius: 5, // Define o raio da borda do botão
                        padding: 10, // Define o preenchimento interno do botão
                        justifyContent: 'center', // Centraliza o texto do botão
                        alignItems: 'center', // Centraliza o texto do botão
                        width: '100%', // Faz o botão ocupar toda a largura da tela
                    }}
                >
                    <Text style={{color: '#FFFFFF',fontSize:20}}>Caixas anteriores</Text>
                </TouchableOpacity>
                {/* button para navegar ate caixas anteriores */}
                {/* button para ir até a lista de garcons */}
                <TouchableOpacity 
                    onPress={() => props.navigation.navigate('garcons')}
                    style={{
                        backgroundColor: '#7f4caf', // Define a cor de fundo do botão
                        borderColor: '#FFFFFF', // Define a cor da borda do botão
                        borderWidth: 1, // Define a largura da borda do botão
                        borderRadius: 5, // Define o raio da borda do botão
                        padding: 10, // Define o preenchimento interno do botão
                        justifyContent: 'center', // Centraliza o texto do botão
                        alignItems: 'center', // Centraliza o texto do botão
                        width: '100%', // Faz o botão ocupar toda a largura da tela
                        margin: 10
                    }}
                >
                    <Text style={{color: '#FFFFFF',fontSize:20}}>Garçons</Text>
                </TouchableOpacity>
                {/* button para ir até a lista de garcons */}

                {/* Modal status fechado e aberto */}
                <Modal visible={modalVisible} animationType="fade" transparent={true} >
                    <View style={{flex:1,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center',}}>
                    <View style={{width:'80%', backgroundColor:'#fff', alignItems: 'center', justifyContent: 'center', borderRadius: 5, padding: 20}}>
                            <AntDesign name="closecircle" size={50} color="black" onPress={() => setModalVisible(false)}/>
                        <Text style={{marginBottom: 10}}>Selecione o status:</Text>
                        <TouchableOpacity
                            style={{backgroundColor:'red', padding:10, borderRadius: 5, marginBottom: 10}}
                            onPress={async() => {
                                const hasOpenOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status === false);
                                const hasBarOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status_bar === true);
                                const hasChapeiroOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status_chapeiro === true);
                                const hasPorcoesOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status_porcoes === true);

                                if (hasOpenOrders) {
                                    alert('Existem pedidos abertos');
                                    return;
                                }

                                if (hasBarOrders) {
                                    alert('Existem pedidos em andamento em BAR');
                                    return;
                                }

                                if (hasChapeiroOrders) {
                                    alert('Existem pedidos em andamento em CHAPEIRO');
                                    return;
                                }

                                if (hasPorcoesOrders) {
                                    alert('Existem pedidos em andamento em PORÇÕES');
                                    return;
                                }

                                setModalVisible(false);
                                setDatavisible(false);
                                await props.onFechar_abrir(props.fechado_aberto.id,'fechado',data.getTime() || 0,0);
                                await props.onControle_caixa_add(data_abertura.getTime(),new Date().getTime(),abertura,total+abertura,total,dinheiro,cartao,pix,props.pedidos)
                                await props.onDelete_all();
                                await props.onAtualizar_is_pedidos_cardapio();
                                await props.onAtualizar_user_Limpeza();
                            }}
                        >
                            <Text style={{color:'white'}}>Fechado</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{backgroundColor:'#c26a05', padding:10, borderRadius: 5, marginBottom: 10}}
                            onPress={() => {
                                setDatavisible(true)
                            }}
                        >
                            <Text style={{color:'white'}}>Fechado com data</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{backgroundColor:'green', padding:10, borderRadius: 5, marginBottom: 10}}
                            onPress={() => {
                                if(props.fechado_aberto.fechado_aberto === 'aberto')    return alert('Caixa já está aberto')
                                setModalVisible(false);
                                setDatavisible(false)
                                props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime() || 0, new Date().getTime())
                            }}
                        >
                            <Text style={{color:'white'}}>Aberto</Text>
                        </TouchableOpacity>
                        {/*fechado data escolher data hora*/ }
                        {datavisible ? 
                        <>
                            <Text style={{color:'black', marginBottom: 10}}>Data:</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <TextInput
                                    placeholder="Dia"
                                    style={{ borderWidth: 1, borderColor: 'black', padding: 5, marginRight: 10 }}
                                    onChangeText={(text) => setDay(text)}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Mês"
                                    style={{ borderWidth: 1, borderColor: 'black', padding: 5, marginRight: 10 }}
                                    onChangeText={(text) => setMonth(text)}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Hora"
                                    style={{ borderWidth: 1, borderColor: 'black', padding: 5, marginRight: 10 }}
                                    onChangeText={(text) => setHour(text)}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    placeholder="Minutos"
                                    style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
                                    onChangeText={(text) => setMinutes(text)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <Button onPress={async() => {
                                const hasOpenOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status === false);
                                const hasBarOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status_bar === true);
                                const hasChapeiroOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status_chapeiro === true);
                                const hasPorcoesOrders = props.pedidos.some((pedido: pedido_inter) => pedido.status_porcoes === true);

                                if (hasOpenOrders) {
                                    alert('Existem pedidos abertos');
                                    return;
                                }

                                if (hasBarOrders) {
                                    alert('Existem pedidos em andamento em BAR');
                                    return;
                                }

                                if (hasChapeiroOrders) {
                                    alert('Existem pedidos em andamento em CHAPEIRO');
                                    return;
                                }

                                if (hasPorcoesOrders) {
                                    alert('Existem pedidos em andamento em PORÇÕES');
                                    return;
                                }
                                if(day === '' || month === '' || hour === '' || minutes === '') return alert('Preencha todos os campos')

                                if (data_hoje.getTime() > data.getTime()) return alert('Data ou Hora menor que a atual')
                                setModalVisible(false);
                                setDatavisible(false);
                                await props.onFechar_abrir(props.fechado_aberto.id,'fechadodata',data.getTime(),0)
                                await props.onControle_caixa_add(data_abertura.getTime(),new Date().getTime(),abertura,total+abertura,total,dinheiro,cartao,pix,props.pedidos)
                                await props.onDelete_all();
                                await props.onAtualizar_is_pedidos_cardapio();
                                await props.onAtualizar_user_Limpeza();
                                }}>Salvar</Button>
                        </>
                        :null}
                    </View>
                    </View> 
                </Modal>
                {/* Modal status fechado e aberto */}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#202124',
      },
});

const mapStateProps = ({pedidos,message ,fechado_abertura,paes}: {pedidos:any,message:any,fechado_abertura:any,paes:any }) => {
    return {
      fechado_aberto: message.fechado_aberto,
      pedidos: pedidos.pedidos,
      abertura_valor: fechado_abertura.abertura_valor,
      paes: paes.paes
    };
  };
  const mapDispatchProps = (dispatch: any) => {
    return {
      onFechar_abrir: (id:string,fechado_aberto:any,data_fechado_aberto:any,abertura:number) => dispatch(Loja_up(id,fechado_aberto,data_fechado_aberto,abertura)),
      setAbertura_valor: (valor:any) => dispatch(set_Abertura_valor(valor)),
      onControle_caixa_add : (
        data_abertura:number,
        data_fechamento:number,
        abertura:number,
        total:number,
        lucro:number,
        dinheiro_caixa:number,
        cartao_caixa:number,
        pix_caixa:number,
        pedidos:any ) => dispatch(controle_caixa_add(data_abertura,data_fechamento,abertura,total,lucro,dinheiro_caixa,cartao_caixa,pix_caixa,pedidos)),
        onDelete_all:() => dispatch(deletePedidos()),
        onAtualizar_is_pedidos_cardapio:()=>dispatch(fetchAtualizarCardapioIdPedidosLimpeza()),
        onAtualizar_user_Limpeza:()=>dispatch(fetchAtualizarUserLimpeza()),
        UpdatePaes : (hamburguer:any,frances:any,sirio:any,id:string) => dispatch(fetchUpdatePaes(hamburguer,frances,sirio,id))
    };
  };
  
  export default connect(mapStateProps,mapDispatchProps)(Controle_caixa);