import React, { useEffect, useState } from 'react';
import {  StyleSheet, Text, View, FlatList, Dimensions, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Mesas, pedido_inter, user_fun } from '../interface/inter';
import Header from '../components/headers/Header_pedidos';
import { NavigationProp } from '@react-navigation/native';
import Entrega from '../components/call_entrega/Entrega';
import { Feather } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { fetch_user_bar, fetch_user_bebidas, fetch_user_call, fetch_user_chapeiro, fetch_user_entregando, fetch_user_porcoes } from '../store/action/user';
import { fetch_mesa_status_call } from '../store/action/mesas';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  status_chapeiro?:boolean;
  users:user_fun[];
  mesas:Mesas[]
  navigation: NavigationProp<any,any>;
  user_login:user_fun;
  //
  onUpUser_entregando:(id:string, array:string[]) =>void
  onUpUser_chapeiro:(id:string, ids_pedidos:string[]) =>void
  onUpUser_bar:(id:string, ids_pedidos:string[]) =>void
  onUpUser_porcoes:(id:string, ids_pedidos:string[]) =>void
  onUpUser_bebidas:(id:string, ids_pedidos:string[]) =>void
  pedidos_mesa:any
  pedidos: pedido_inter[];
}
const Pedidos = ({ mesas, users,navigation,pedidos,user_login,onUpUser_entregando,onUpUser_chapeiro,onUpUser_bar,onUpUser_bebidas,onUpUser_porcoes, }:Props) => {


  const [state_chapeiro,setState_chapeiro] = useState<pedido_inter[]>()
  const [state_bar,setState_bar] = useState<pedido_inter[]>()
  const [state_porcoes,setState_porcoes] = useState<pedido_inter[]>()
  const [state_bebidas,setState_bebidas] = useState<pedido_inter[]>()
  const [state_click,setState_click] = useState<string[]>([])
  //variavel :
  const [user_logado, setUser_logado] = useState<any>(null) 
  const [array_state_chapeiro,setArray_state_chapeiro] = useState<any>({})
  const [array_state_bar,setArray_state_bar] = useState<any>({})
  const [array_state_porcoes,setArray_state_porcoes] = useState<any>({})
  const [array_state_bebidas,setArray_state_bebidas] = useState<any>({})

  useEffect(()=>{
    //////////// Atualizar o estado do user globalmente //////////////////////
    const user_logado_ = users.find(user => user.uid === user_login.uid)
    setUser_logado(user_logado_)
    
  },[])


  /////////filtragem para selecionar itens q correspondem as condicoes para entregue////// 

  useEffect(() => {
    ///////////// Filtro dos pedidos chapeiro/////////////////////
    const pedidosChapeiro_filter_1 = pedidos.filter((pedido) => {
      return (
        pedido.status_chapeiro === false &&
        pedido.itens.some(
          (item) =>
            item.categoria === 'comidas' && (item.categoria_2 === 'lanches' ||
            item.categoria_2 === 'hotdogs'|| item.categoria_2 === 'combos')
        )
      );
    });
    //filtrando corretament 
    const pedidosChapeiro = pedidosChapeiro_filter_1.map((pedido) => {
      const itensChapeiro = pedido.itens.filter((item) => item.categoria === 'comidas' && (item.categoria_2 === 'lanches' ||
      item.categoria_2 === 'hotdogs' || item.categoria_2 === 'combos'));
      return { ...pedido, itens: itensChapeiro };
    });
    ///////////// Filtro dos pedidos drinks/////////////////////
    const pedidosBar_filtrer_1 = pedidos.filter((pedido) => {
      return (
        pedido.status_bar === false &&
        pedido.itens.some(
          (item) =>
            item.categoria === 'bar'
        )
      );
    }); 
    // console.log('pedidosBar_filtrer_1 : //',pedidosBar_filtrer_1)
    const pedidosBar = pedidosBar_filtrer_1.map((pedido) => {
      const itensBar = pedido.itens.filter((item) => item.categoria === 'bar');
      return { ...pedido, itens: itensBar };
    });
    ///////////// Filtro dos pedidos bebidas/////////////////////
    const pedidosBebidas_filtrer_1 = pedidos.filter((pedido) => {
      return (
        pedido.array_bebidas?.length > 0
      );
    }); 
    // console.log(pedidosBebidas_filtrer_1)
    const pedidosBebidas = pedidosBebidas_filtrer_1.map((pedido) => {
      const itensBebidas = pedido.itens.filter((item) =>  pedido.array_bebidas?.includes(item.id));
      return { ...pedido, itens: itensBebidas };
    });
     ///////////// Filtro dos pedidos porcoes/////////////////////
     const pedidosPorcoes_filter_1 = pedidos.filter((pedido) => {
      return (
        pedido.status_porcoes === false &&
        pedido.itens.some(
          (item) =>
            item.categoria === 'comidas' && item.categoria_2 ==='porcoes'
        )
      );
    }); 
    const pedidosPorcoes = pedidosPorcoes_filter_1.map((pedido) => {
      const itensPorcoes = pedido.itens.filter((item) => item.categoria === 'comidas' && item.categoria_2 ==='porcoes');
      return { ...pedido, itens: itensPorcoes };
    });
    ///////////////// Filtro dos usuários chapeiro/////////////////////
    const Chapeiro_entregue = pedidosChapeiro.filter((item) => {
      return !users.some((user) => user.chapeiro?.includes(item.id));
    });
    ///////////////// Filtro dos usuários bar/////////////////////
    const Bar_entregue = pedidosBar.filter((item) => {
      return !users.some((user) => user.bar?.includes(item.id));
    });
    ///////////////// Filtro dos usuários bebidas/////////////////////
    const Bebidas_entregue = pedidosBebidas.filter((item) => {
      return !users.some((user) => user.bebidas?.includes(item.id));
    });
    ///////////////// Filtro dos usuários porcoes/////////////////////
    const Porcoes_entregue = pedidosPorcoes.filter((item) => {
      return !users.some((user) => user.porcoes?.includes(item.id));
    });
    ///chapeiro
    Chapeiro_entregue.sort((a,b) => a.ordem - b.ordem)
    setState_chapeiro(Chapeiro_entregue)
    ///bar
    setState_bar(Bar_entregue)
    ///bebidas
    setState_bebidas(Bebidas_entregue)
    ///porcoes
    Porcoes_entregue.sort((a,b) => a.ordem - b.ordem)
    setState_porcoes(Porcoes_entregue)
    // console.log('Chapeiros Entregues:', Chapeiro_entregue);  
    // console.log('bar Entregues:', Bar_entregue[0]);  
    // console.log('porcoes Entregues:', Porcoes_entregue);  
  }, [pedidos, users]);

  
  ////////////////////////ARRAY STATE Atualizar o estado do user globalmente //////////////////////
  useEffect(()=>{
    ////////////// Verfica se o id é igual ao array state  chapeiro ////////////////////
    const array_state_chapeiro_ = state_chapeiro?.filter(item => {
      return state_click?.some(i=> `chapeiro_${item.id}` === i)
    })
    setArray_state_chapeiro(array_state_chapeiro_)
    ////////////// Verfica se o id é igual ao array state bar ////////////////////
    const array_state_bar = state_bar?.filter(item => {
      return state_click?.some(i=> `bar_${item.id}` === i)
    })
    setArray_state_bar(array_state_bar)
    ////////////// Verfica se o id é igual ao array state bebidas ////////////////////
    const array_state_bebidas = state_bebidas?.filter(item => {
      return state_click?.some(i=> `bar_${item.id}` === i)
    })
    setArray_state_bebidas(array_state_bebidas)
    ////////////// Verfica se o id é igual ao array state porcoes ////////////////////
    const array_state_porcoes = state_porcoes?.filter(item => {
      return state_click?.some(i=> `porcao_${item.id}` === i)
    })
    setArray_state_porcoes(array_state_porcoes)
    // console.log("user",user_logado)    
    // atualizar entregando.

    const atualizar_entregando = async() => {
      await onUpUser_entregando(user_logado.id,state_click);
    }
    // console.log(user_logado)
    user_logado? atualizar_entregando() : null
    
  },[state_click,user_logado])

  // console.log(state_chapeiro)
  // console.log(state_click)

  // console.log("lanches",array_state_chapeiro)
  // console.log("bar",array_state_bar)
  // console.log("porcoes",array_state_porcoes)
  /////////////////////////// Consolidar array para enviar para a tela de pedidos ///////////////////////////
  const [consolidatedArray, setConsolidatedArray] = useState<any>([])
  const [Array_bar_bebidas, setArray_bar_bebidas] = useState<any>([])
  useEffect(()=>{
    const consolidatedArray = [
      array_state_chapeiro,
      array_state_bar,
      array_state_bebidas,
      array_state_porcoes,
    ].flat().filter(Boolean);

    setConsolidatedArray(consolidatedArray)

  },[array_state_chapeiro,array_state_bar,array_state_bebidas,array_state_porcoes])
  //////////////////////////////// Consolidar array para enviar para a tela de pedidos ///////////////////////////
  //atualizar o array bar e bebidas
  useEffect(()=>{
    const Array_bar_bebidas = [
      state_bar,
      state_bebidas,
    ].flat().filter(Boolean);
    Array_bar_bebidas.sort((a,b) => a.ordem - b.ordem)
    setArray_bar_bebidas(Array_bar_bebidas)
    // console.log('Array_bar_bebidas',Array_bar_bebidas)
  },[state_bar,state_bebidas])

    // console.log('Array_bar_bebidas',state_bebidas)
  // console.log(consolidatedArray[1])
  // navegar para a listagem dos pedidos 
  const func_pedido_list = () =>{   
      // console.log('consolidatedArray',consolidatedArray)
      // todos os numeros de mesa sem repetir
      const numeros_mesas = consolidatedArray
      .map(item => item.numero_mesa)
      .filter((value, index, self) => self.indexOf(value) === index);
      // console.log(numeros_mesas)

      navigation.navigate('Pedido_itens_entrega',{ 
        numeros_mesas: numeros_mesas, 
        chapeiro_bar_porcoes_itens : consolidatedArray,
        chapeiro_bar_porcoes:true,
        })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header entrega navigation={navigation} />
      <ScrollView style={{flex:1,width:"100%"}}>
        {/* /////////////////////////////////////////////////////////////////////////////////////////////////// */}
        {state_chapeiro?.length > 0?
        <>
          <View  style={styles.separator_txt}>
            <Text style={styles.text}>Chapeiro :</Text>
          </View>
          <FlatList
            scrollEnabled={false}
            data={state_chapeiro}
            keyExtractor={item => `chapeiro_${item.id}`}
            renderItem={({ item,index }) => {
                if(users.find(user => user.entregando?.includes(`chapeiro_${item.id}`))){
                  return <Entrega   users={users} state_all_array={consolidatedArray} id={`chapeiro_${item.id}`} key={`chapeiro_${item.id}`} numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click}
                  state_click={state_click}/>;
                }else {
                  return <Entrega  chapeiro users={users} state_all_array={consolidatedArray} id={`chapeiro_${item.id}`} key={`chapeiro_${item.id}`} styles numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click} state_click={state_click}/>;
                }
                    
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>:null}
        {/* /////////////////////////////////////////////////////////////////////////////////////////////////// */}
        {Array_bar_bebidas?.length > 0?
        <>
          <View  style={styles.separator_txt}>
            <Text style={styles.text}>Bar :</Text>
          </View>
          <FlatList
            scrollEnabled={false}
            data={Array_bar_bebidas}
            keyExtractor={(item,index) => `bar_${index}`}
            renderItem={({ item,index }) => {
                if(users.find(user => user.entregando?.includes(`bar_${item.id}`))){
                  return <Entrega   users={users} state_all_array={consolidatedArray} id={`bar_${item.id}`} key={`bar_${item.id}`} numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click}
                  state_click={state_click}/>;
                }else {
                  return <Entrega  drinks users={users} state_all_array={consolidatedArray} id={`bar_${item.id}`} key={`bar_${item.id}`} styles numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click} state_click={state_click}/>;
                }
                    
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>:null}
        {/* /////////////////////////////////////////////////////////////////////////////////////////////////// */}
        {state_porcoes?.length > 0?
        <>
          <View  style={styles.separator_txt}>
              <Text style={styles.text}>Porções :</Text>
          </View>
          <FlatList
            scrollEnabled={false}
            data={state_porcoes}
            //item ja retorna apenas os status_chapeiro de acordo com o back0end query
            keyExtractor={item => `porcao_${item.id}`}
            renderItem={({ item,index }) => {
                // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos

                // atualizacao em tempo real de qual user atende qual pedido (mesa)
                if(users.find(user => user.entregando?.includes(`porcao_${item.id}`))){
                  return <Entrega   users={users} state_all_array={consolidatedArray} id={`porcao_${item.id}`} key={`porcao_${item.id}`} numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click}
                  state_click={state_click}/>;
                }else {
                  return <Entrega  porcoes users={users} state_all_array={consolidatedArray} id={`porcao_${item.id}`} key={`porcao_${item.id}`} styles numero_mesa={item.numero_mesa} navigation={navigation} setState_click={setState_click} state_click={state_click}/>;
                }
                    
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>:null}
      </ScrollView>
    {state_click.length > 0?
      <View style={styles.container_Buttons}>
        <MaterialCommunityIcons name="playlist-edit" size={35} color="tomato" onPress={func_pedido_list}/>
        <Feather name="x-octagon" size={30} color="tomato"  onPress={async()=> {
          const ids_chapeiro = array_state_chapeiro.map(item => item.id);
          const ids_bar = array_state_bar.map(item => item.id);
          const ids_bebidas = array_state_bebidas.map(item => item.id);
          const ids_porcoes = array_state_porcoes.map(item => item.id);
          // console.log(ids_chapeiro)
          // console.log(ids_bar)
          // console.log(ids_bebidas)
          // console.log(ids_porcoes)
          ids_chapeiro.length > 0 ? await onUpUser_chapeiro(user_logado.id, ids_chapeiro) : null;
          ids_bar.length > 0 ? await onUpUser_bar(user_logado.id, ids_bar) : null;
          ids_bebidas.length > 0 ? await onUpUser_bebidas(user_logado.id, ids_bebidas) : null;
          ids_porcoes.length > 0 ? await onUpUser_porcoes(user_logado.id, ids_porcoes) : null;
          setState_click([]);
        }}/>
      </View>:null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#202124',
    width:"100%",
  },
  separator: {
    height: "2%",
    width: '100%',
    backgroundColor: 'transparent',
    alignItems:'center',
  },
  separator_txt: {
    height: 40,
    width: '100%',
    alignItems:'center',
    borderColor:"#fff",
    borderTopWidth:1,
    paddingBottom:10,
  },
  text: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC',
    fontSize: 20,
  },
  container_Buttons: {
    height: '10%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity:0.8
  },
  
  
});

const mapStateProps = ({ pedidos, user }: {  pedidos: any, user: any}) => {
  return {
    pedidos: pedidos.pedidos,
    mesas:pedidos.mesas,
    users:user.users,
    user_login:user.user,
    pedidos_mesa:pedidos.pedidos_mesa
  };
};


const mapDispatchProps = (dispatch: any) => {
  return {
    
    onUpUser_entregando: (id:string,array:string[]) => dispatch(fetch_user_entregando(id,array)),
    onUpUser_chapeiro: (id:string,ids_pedidos:string[]) => dispatch(fetch_user_chapeiro(id,ids_pedidos)),
    onUpUser_bar: (id:string,ids_pedidos:string[]) => dispatch(fetch_user_bar(id,ids_pedidos)),
    onUpUser_porcoes: (id:string,ids_pedidos:string[]) => dispatch(fetch_user_porcoes(id,ids_pedidos)),
    onUpUser_bebidas: (id:string,ids_pedidos:string[]) => dispatch(fetch_user_bebidas(id,ids_pedidos)),
  };
};
export default connect(mapStateProps, mapDispatchProps)(Pedidos);
