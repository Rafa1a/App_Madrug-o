import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  ScrollView

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import {Principal} from '../interface/Novas_componentes'
//
import { useStyles } from '../styles/styles_dark_ligth';
import { resetState, setLogout, setUser_localidade,  setUser_rua_numero_celular,  setUser_token, setUser_tutorial, setUser_tutorial_inicial, setUser_tutorial_status, update_On_theme } from '../store/action/user';
//components
import Subcategoria_comida_new from '../components/Subcategoria_Comida_new';
import Subcategoria_bar_new from '../components/Subcategoria_Bar_new';

import Flatlist_principal from '../components/Flatlist_principal';
import Flatlist_principal_ultimos_pedidos from '../components/Flatlist_principal_ultimos_pedidos';
//icons
import { FontAwesome5 } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
//
//lotie
import LottieView from 'lottie-react-native';
//
  
  import { Button, Dialog, Divider, Image, Input,} from '@rneui/themed';
//qrcode
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch_mesa_status_user_call } from '../store/action/mesas';
import { Mesas } from '../interface/inter';
//tutorial
import ControlledTooltip_perfil from '../components/Tooptip/ControlledTooltip_perfil';
import ControlledTooltip_carrinho from '../components/Tooptip/ControlledTooltip_carrinho';
import ControlledTooltip_favoritos from '../components/Tooptip/ControlledTooltip_favoritos';
import ControlledTooltip_categorias from '../components/Tooptip/ControlledTooltip_categorias';
import ControlledTooltip_ordem from '../components/Tooptip/ControlledTooltip_ordem';
import ControlledTooltip_lista_itens from '../components/Tooptip/ControlledTooltip_lista_itens';
import ControlledTooltip_qrcode from '../components/Tooptip/ControlledTooltip_qrcode';
import ControlledTooltip_ultimos_pedidos from '../components/Tooptip/ControlledTooltip_ultimos_pedidos';
import ControlledTooltip_relogio from '../components/Tooptip/ControlledTooltip_relogio';
import { Linking } from 'react-native';
import { set_carrinho_aviso_tutorialeentrega } from '../store/action/adicionar_pedido';
import { setModal_Fechado_aberto } from '../store/action/message';

function Principal_comp(props: Principal) {


  const styles_dark0rligth = useStyles(props.user_info);  
  ////////////////////////
  const state_theme_mode = props.user_info.theme_mode || false;
  ////////////////////////////////////Filtro Cardapio
  const [filteredCardapio, setFilteredCardapio] = useState(props.cardapio);
  //
  const [filters, setFilters] = useState([]);
  const [mais_curtidas, setMais_curtidas] = useState(true);
  const [mais_pedidos, setMais_pedidos] = useState(false);
  //atualizacoes 
  const [onorof, setOnorof] = useState('');
  const firstonorof = useRef(true);

  const [comments, setComments] = useState('');
  const firstcomments = useRef(true);

  /////////////////////////////loadding
  const [loading_mais_curtidas, setLoading_mais_curtidas] = useState(false);
  const [loading_mais_pedidos, setLoading_mais_pedidos] = useState(false);

  const [loading_categoria, setLoading_categoria] = useState(false);
  //favoritos e ultimo pedido
  const [loading_favoritos, setLoading_favoritos] = useState(false);
  ///buton voltar
  const [voltar_favoritos, setVoltar_favoritos] = useState(false);
  
  //////////////////////////////////////////////////////
  //animacao lottie
  const [lottie, setLottie] = useState(false);
  const animation = useRef(null);
  //////////////////////////////////////////////////////
  //carregar o flat list antes de mudar o estado
  //possivel solucao nao funcional:
  // const [isFlatListReady, setFlatListReady] = useState(false);
  // console.log(isFlatListReady)
  
  // function handleLayout  (bollean) {
  //   console.log('handleLayout called');
  //   setFlatListReady(bollean);
  // };
  // const flatListStyle = isFlatListReady ? {opacity: 1} : {opacity: 0};

  ////////////////// search e loading lottie do card final
  const animation_search = useRef(null);
  
  let intervalId = null;

  useEffect(() => {
    // Inicia a animação do quadro 110 ao quadro 156
    animation_search.current.play(109, 156);
    // console.log(animation_search.current.play)

    // Quando a animação terminar, reinicia e começa do quadro 110 novamente
    intervalId = setInterval(() => {
      animation_search.current.play(109, 156);
    }, 5000); 

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };


  }, []);
 
  ////////////////// search e loading lottie do card final
  //////////////////////////////////////onofor e comentarios atualizacao GATILHO de mudanças
  const firstRender = useRef(true);

  useEffect(() => {
    const onorofValues = props.cardapio.map(item => item.onorof).join();
    const onorofstring = props.onorof
    // console.log(onorofstring)
    // console.log(onorofValues)
    if(firstonorof.current === true && onorofstring !== onorofValues){
      firstonorof.current = false;
      setOnorof(onorofValues);
      return;
    }else if(firstonorof.current === false){
        setOnorof(onorofValues);
    }
    //////////////////////////////////////////////////////////////
    if (props.isModalOpen) {
      const comentariosValues = props.cardapio.map(item => item.comments).join();
      const commentsstring = props.comments

      if (firstcomments.current === true && commentsstring !== comentariosValues ) {
        firstcomments.current = false;
        setComments(comentariosValues);
        return;
      }else if (firstcomments.current === false) {
        setComments(comentariosValues);
      }
    }
  },[props.cardapio]);
  
  //////////////////////////////////////////////////////
  useEffect(() => {
    console.log('Filtros 32:', filters);
    if (firstRender.current) {
      firstRender.current = false;
    } else if(props.isModalOpen === false && firstRender.current === false){
      setLottie(true);
    }
    let filteredArray = [];
    let item_zerado = false;
    ////////////////////////////////////Drinks e bebidas
    if(filters.includes('refri')){
      const newArray = props.cardapio.filter((item) => item.categoria === 'bebidas' && item.categoria_2 === 'no-alcool');
      // console.log(newArray)
      newArray.length > 0 ? item_zerado = false : item_zerado = true;
      filteredArray = [...filteredArray, ...newArray];
    }

    if(filters.includes('sucos')){
      const newArray = props.cardapio.filter((item) => item.categoria === 'bar' && item.categoria_2 === 'sucos');
      newArray.length > 0 ? item_zerado = false : item_zerado = true;
      filteredArray = [...filteredArray, ...newArray];
    }

    if(filters.includes('cerveja')){
      const newArray = props.cardapio.filter((item) => item.categoria === 'bebidas' && item.categoria_2 === 'alcool');
      newArray.length > 0 ? item_zerado = false : item_zerado = true;
      // console.log(newArray)

      filteredArray = [...filteredArray, ...newArray];
    }

    if(filters.includes('drinks')){
      const newArray = props.cardapio.filter((item) => item.categoria === 'bar' && item.categoria_2 === 'drinks');
      newArray.length > 0 ? item_zerado = false : item_zerado = true;
      filteredArray = [...filteredArray, ...newArray];
    }
    ///////////////////////////////////// Comidas

    if(filters.includes('hamburguer')){
      const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_2 === 'lanches');
      newArray.length > 0 ? item_zerado = false : item_zerado = true;
      filteredArray = [...filteredArray, ...newArray];

    }
    if(filters.includes('hotdog')){
      const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_2 === 'hotdogs');
      newArray.length > 0 ? item_zerado = false : item_zerado = true;
      filteredArray = [...filteredArray, ...newArray];
    }
    if(filters.includes('porcao')){
      const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_2 === 'porcoes');
      newArray.length > 0 ? item_zerado = false : item_zerado = true;
      filteredArray = [...filteredArray, ...newArray];
    }
    ///////////////////sub categorias comidas
    // if(filters.includes('boi') && filters.length === 1){
    //   const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_3 === 'boi');
    //   filteredArray = [...filteredArray, ...newArray];
    // }
    // if(filters.includes('porco' && filters.length === 1)){
    //   const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_3 === 'porco');
    //   filteredArray = [...filteredArray, ...newArray];
    // }
    // if(filters.includes('frango') && filters.length === 1){
    //   const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_3 === 'frango');
    //   filteredArray = [...filteredArray, ...newArray];
    // }
    // if(filters.includes('peixe') && filters.length === 1){
    //   const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_3 === 'peixe');
    //   filteredArray = [...filteredArray, ...newArray];
    // }
    // if(filters.includes('vegano') && filters.length === 1){
    //   const newArray = props.cardapio.filter((item) => item.categoria === 'comidas' && item.categoria_3 === 'vegetariano');
    //   filteredArray = [...filteredArray, ...newArray];
    // }
    //Filtros

    /////////////////////////////Ordem de filtro
    if(filteredArray.length === 0 && item_zerado === false){
      // console.log('Mais:', mais_curtidas, mais_pedidos);
      //mais curtidas
      if(mais_curtidas){
        setLoading_mais_curtidas(true);
        new Promise(resolve => {
          setTimeout(() => {
            const newArray = [...props.cardapio];
            newArray.sort(function (a, b) {
              let aValue = a.curtidas || 0;
              let bValue = b.curtidas || 0;

              if (aValue > bValue) {
                return -1;
              }
              if (aValue < bValue) {
                return 1;
              }
              return 0;
            });
            resolve(newArray);
          }, 0);
        }).then((newArray: any) => {
          setLoading_mais_curtidas(false);
          setFilteredCardapio(newArray);
          setTimeout(() => {
            setLottie(false);
            }, 400);
        });
      }
      //mais pedidos
      else if(mais_pedidos){ 
        setLoading_mais_pedidos(true);
        new Promise(resolve => {
          setTimeout(() => {
            const newArray = [...props.cardapio];
            newArray.sort(function (a, b) {
              let aValue = a.pedidos_quantidade || 0;
              let bValue = b.pedidos_quantidade || 0;

              if (aValue > bValue) {
                return -1;
              }
              if (aValue < bValue) {
                return 1;
              }
              return 0;
            });
            resolve(newArray);
          }, 0);
        }).then((newArray: any) => {
          setLoading_mais_pedidos(false);
          setFilteredCardapio(newArray);
          setTimeout(() => {
            setLottie(false);
            }, 400);

        });
      }
    } else if (item_zerado) {
      if(mais_curtidas){
        setLoading_mais_curtidas(true);
        new Promise(resolve => {
          setTimeout(() => {
            const newArray = [...filteredArray];
            newArray.sort(function (a, b) { 
              let aValue = a.curtidas || 0;
              let bValue = b.curtidas || 0;
      
              if (aValue > bValue) {
                return -1;
              }
              if (aValue < bValue) {
                return 1;
              }
              return 0;
            });
            resolve(newArray);
          }, 0);
        }).then((newArray: any) => {
          setLoading_mais_curtidas(false);
          setFilteredCardapio(newArray);
          setTimeout(() => {
            setLottie(false);
            }, 400);

        });
      }
      //mais pedidos
      else if(mais_pedidos){ 
        setLoading_mais_pedidos(true);
        new Promise(resolve => {
          setTimeout(() => {
            const newArray = [...filteredArray];
            newArray.sort(function (a, b) {
              let aValue = a.pedidos_quantidade || 0;
              let bValue = b.pedidos_quantidade || 0;

              if (aValue > bValue) {
                return -1;
              }
              if (aValue < bValue) {
                return 1;
              }
              return 0;
            });
            resolve(newArray);
          }, 0);
        }).then((newArray: any) => {
          setLoading_mais_pedidos(false);
          setFilteredCardapio(newArray);
          setTimeout(() => {
          setLottie(false);
          }, 400);
        });
      }
    } else {
       /////////////////////////////Ordem de filtro
      // console.log('Mais:', mais_curtidas, mais_pedidos);
      //mais curtidas
      if(mais_curtidas){
        setLoading_mais_curtidas(true);
        new Promise(resolve => {
          setTimeout(() => {
            const newArray = [...filteredArray];
            newArray.sort(function (a, b) { 
              let aValue = a.curtidas || 0;
              let bValue = b.curtidas || 0;
      
              if (aValue > bValue) {
                return -1;
              }
              if (aValue < bValue) {
                return 1;
              }
              return 0;
            });
            resolve(newArray);
          }, 0);
        }).then((newArray: any) => {
          setLoading_mais_curtidas(false);
          setFilteredCardapio(newArray);
          setTimeout(() => {
            setLottie(false);
            }, 400);

        });
      }
      //mais pedidos
      else if(mais_pedidos){ 
        setLoading_mais_pedidos(true);
        new Promise(resolve => {
          setTimeout(() => {
            const newArray = [...filteredArray];
            newArray.sort(function (a, b) {
              let aValue = a.pedidos_quantidade || 0;
              let bValue = b.pedidos_quantidade || 0;

              if (aValue > bValue) {
                return -1;
              }
              if (aValue < bValue) {
                return 1;
              }
              return 0;
            });
            resolve(newArray);
          }, 0);
        }).then((newArray: any) => {
          setLoading_mais_pedidos(false);
          setFilteredCardapio(newArray);
          setTimeout(() => {
          setLottie(false);
          }, 400);
        });
      }
    }
   
    // console.log('Filtros ativos:', filteredArray);

  }, [filters,mais_curtidas,mais_pedidos,onorof,comments]);

  //////////////////////////////////////////////////////

  //funcao click filtro
  function toggleFilter(filter) {
    setLoading_categoria(true);
    new Promise(resolve => {
      setTimeout(() => {
        setFilters(prevFilters => {
          let newFilters;
          if (prevFilters.includes(filter)) {
            // Se o filtro já está ativo, remova-o da lista de filtros ativos
            newFilters = prevFilters.filter(f => f !== filter);
          } else {
            // Se o filtro não está ativo, adicione-o
            newFilters = [...prevFilters, filter];
          }
          resolve(newFilters);
          return newFilters; // Adicione esta linha
        }); 
      }, 0);
    }).then((newFilters: any) => {
      setLoading_categoria(false);
      setFilters(newFilters);
    });
     
  }
  // funcao clique em favoritos definir itens cardapio
  function toggleFavoritos() {
    setLoading_favoritos(true);
    new Promise(resolve => {
      setTimeout(() => {
        const array_curtidas = props.user_info.curtidas || [];
        const newArray = [...props.cardapio];
        const newArray_filtrado = newArray.filter((item) => array_curtidas?.includes(item.id));
        newArray_filtrado.sort(function (a, b) {
          let aValue = a.curtidas || 0;
          let bValue = b.curtidas || 0;

          if (aValue > bValue) {
            return -1;
          }
          if (aValue < bValue) {
            return 1;
          }
          return 0;
        });
        resolve(newArray_filtrado);
      }, 0);
    }).then((newFilters: any) => {
      setFilteredCardapio(newFilters);
      // console.log(newFilters)
      setLoading_favoritos(false);
      setVoltar_favoritos(true);
      
    });
  }
  

  //////////////////////////////////////////////////////
  // console.log(filteredCardapio[0])
  // console.log(props.cardapio[0])
  const Cardapio = useMemo(() => {
      return filteredCardapio.filter(item => !('versao' in item));
  }, [filteredCardapio, props.cardapio]);
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////animacao do button card
  const randomWidth = useSharedValue(1);
  const progress = useSharedValue(0);
  const config = {
    duration: 300,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const config_2 = {
    mass: 1,
    stiffness: 200,
    damping: 7,

  };

  const style = useAnimatedStyle(() => {
    return {
      transform: [{scale: randomWidth.value}],
      backgroundColor:interpolateColor(
        progress.value,
        [0, 1],
        ['#f8fafd', '#E81000']
      ),
    };
  });
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  //funcao 
  function toggleButton() {
    // console.log(props.adicionar_itens)
    if(props.adicionar_itens && props.adicionar_itens.length > 0){
      // console.log('entrou')
      randomWidth.value = withSpring(1.2, config_2);
      progress.value = withTiming(1, { duration: 1000 });
    }
    else { 
      // console.log('saiu') 
      randomWidth.value =   withSpring(1, config_2);
      progress.value = withTiming(0, { duration: 1000 });
    }
  }
  //
  useEffect(() => {
    toggleButton();
  }, [props.adicionar_itens]);
  // 
  //////////////////////////////////////////////////////animacao do button card
  //////////////////////////////////////////////////////ver se tem itens pedido
  const [pedido_online, setPedido_online] = useState([]);
  const [pedido_mesa, setPedido_mesa] = useState([]);

  useEffect(() => {
    const pedido_online = props.pedidos?.filter((item)=>item.id_user === props.user_info?.id && item.status === false) || []
    const pedido_mesa = props.pedidos?.filter((item)=>item.numero_mesa === props.user_info?.mesa && item.status === false) || []
    setPedido_online(pedido_online)
    setPedido_mesa(pedido_mesa)
  }, [props.pedidos]);
  
  // console.log(pedido_mesa.length > 0)
  //////////////////////////////////////////////////////ver se tem itens pedido
  //////////////////////////////////////////////////////modal pedido
  const [modal_perfil, setModal_perfil] = useState(false);
  const [modal_pedido, setModal_pedido] = useState(false);
  //////////////////////////////////////////////////////modal pedido
  ////////////////////////////rua e numero
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [celular, setCelular] = useState('');
  useEffect(() => {
    // console.log(props.user_info)
    setRua(props.user_info.rua_on || '') 
    setNumero(props.user_info.numero_on || '')
    setCelular(props.user_info.celular || '')
  }, [props.user_info]);
  //////////////////////////////////////////////////////
  //logout
  //reset app
  async function resetApp() {
    try {
      

      // Reseta o estado do Redux
      props.onLogout(true);
      // Agora que o usuário foi deslogado e o estado foi resetado, limpa o AsyncStorage
      await AsyncStorage.clear();
      // Desloga o usuário e espera a operação ser concluída
      // await signOut(auth);

      // props.Resetstate();

      // Navega para a tela de login
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Login' },
          ],
        })
      );

      console.log("Aplicativo resetado com sucesso");
    } catch (error) {
      console.error("Erro ao resetar o aplicativo", error);
    }
  }
  //logout
  ////////////////////////////////////////////////////// Relogio controle se ele aparece ou nao opacity

  const [condicaoRelogio, setCondicaoRelogio] = useState(false);

  useEffect(() => {
    const condicao = (props.user_info.status_mesa && props.pedidos.some(item => item.status === false &&  item.numero_mesa === props.user_info.mesa  && item.itens.some(itens => itens.categoria !== 'bebidas'))) 
    || props.pedidos.some(item => item.status === false && item.id_user === props.user_info.id && item.itens.some(itens => itens.categoria !== 'bebidas') );
    
    setCondicaoRelogio(condicao);
  }, [props.user_info, props.pedidos]); 

  ////////////////////////////////////////////////////// Relogio controle se ele aparece ou nao opacity//fim
  ////////////////////////////////////////////////////// funcao q clique em ultimo pedido definir itens cardapio
  const [loading_ultimo_pedido, setLoading_ultimo_pedido] = useState(false);
  const [voltar_ultimo_pedido, setVoltar_ultimo_pedido] = useState(false);
  const [ultimo_pedido, setUltimo_pedido] = useState([]);
  useEffect(() => {
    const ultimo_pedido = props.user_info?.ultimos_pedidos || []
    setUltimo_pedido(ultimo_pedido)
  }, [props.user_info]);
  function toggleUltimo_pedido() {
    setLoading_ultimo_pedido(false);
    setVoltar_ultimo_pedido(true);
  }
  ////////////////////////////////////////////////////// funcao q clique em ultimo pedido definir itens cardapio //fim
  ///////////////////////////////mesas estado animacao lottie
  const[mesa, setMesa] = useState<Mesas>({} as Mesas);
  const[loadding_mesa, setLoadding_mesa] = useState(false);

  useEffect(() => {
    if(props.user_info.status_mesa){
      const mesa_:any=props.mesas.find(item=>item.numero_mesa === props.user_info.mesa)
      setMesa(mesa_)
    }
  },[props.mesas]);
  //componente 
  const renderAnimation = () => {
    if (props.user_info?.status_mesa && (props.adicionar_itens?.length === 0 || props.adicionar_itens === undefined)) {
      
      if (mesa.status_call) {
        if(loadding_mesa){
          return (
            <ActivityIndicator size="small" color="#E81000" />
          );
        }else{
        return (
          <LottieView
            autoPlay
            ref={animation}
            source={require('../../assets/anim/aguardando.json')}
          />
        );
        }
      } else {
        if(loadding_mesa){
          return (
            <ActivityIndicator size="small" color="#E81000" />
          );
        }else{
        return (
          <LottieView
            autoPlay
            ref={animation}
            source={require('../../assets/anim/acenando_maos.json')}
            speed={0.2}
          />
        );
        }
      }
    } else if (props.adicionar_itens && props.adicionar_itens?.length > 0) {
      return (
        <>
          <Text style={{color:'#f8fafd',fontSize:12,fontFamily:'Roboto-Bold'}}>{props.adicionar_itens.length}</Text>
          <AntDesign name="shoppingcart" size={30} color="#f8fafd" />
        </>
      );
    } else {
      return (
        <AntDesign name="shoppingcart" size={30} color="#3C4043" />
      );
    }
  }
  ///////////////////////////////mesas estado
  /////////////////////////////TUTORIAL/////////////////////////////
  /////////////////////////////////////////////DIALOG
  const [visible1, setVisible1] = useState(false);
  const [clickback, setClickback] = useState(false);
  const [loading_tutorial, setLoading_tutorial] = useState(false);
  //////////////////////////////////////////////////////////TOOLTIP TUTORIAL
  const [tooltip_perfil, setTooltip_perfil] = useState(false);
  const [tooltip_carrinho, setTooltip_carrinho] = useState(false);
  const [tooltip_favoritos, setTooltip_favoritos] = useState(false);
  const [tooltip_categoria, setTooltip_categoria] = useState(false);
  const [tooltip_ordem, setTooltip_ordem] = useState(false);
  const [tooltip_qrcode, setTooltip_qrcode] = useState(false);
  const [tooltip_lista_itens, setTooltip_lista_itens] = useState(false);
  const [tooltip_ultimos_pedidos, setTooltip_ultimos_pedidos] = useState(false);
  const [tooltip_relogio, setTooltip_relogio] = useState(false);
  //////////////////////////////////////// Primeira renderizacao, Bug do ios, aparecer modal após a renderizacao delay de 1700
  const [primeira_renderizacao, setPrimeira_renderizacao] = useState(false);
  
  const action_timeout = (set) => {
    if(primeira_renderizacao === false){
      // console.log('primeira renderizacao');
      if(props.alerta === true){
        setTimeout(() => {
          set(true);
          setPrimeira_renderizacao(true);
          props.onSet_carrinho_aviso(false);
        }, 6000);
      }else {
        setTimeout(() => {
          set(true);
          setPrimeira_renderizacao(true);
        }, 1700);
      }
    } else {
      // console.log('segunda renderizacao');
      if(props.alerta === true){
        setTimeout(() => {
          set(true);
          props.onSet_carrinho_aviso(false);
        }, 6000);
      }else {
          set(true);
      }
    }
  }
  const func_tutorial = () =>{
    const tutorials = props.user_info.tutorial || [];
      // console.log(tutorials);

      if(props.user_info?.status_tutorial === true){
        if(tutorials.length === 0){
          props.onTutorial_inicial(props.user_info.id);
        }
        tutorials.some((item) => {
          if (item.value === 'perfil' && item.status === false) {
            setVisible1(false)
            action_timeout(setTooltip_perfil);
            // setTooltip_perfil(true);
            return true;
          } 
          else if (item.value === 'carrinho' && item.status === false) {
            setTooltip_perfil(false);
            action_timeout(setTooltip_carrinho);
            // setTooltip_carrinho(true);
            return true;
          }
          else if (item.value === 'favoritos' && item.status === false) {
            setTooltip_perfil(false);
            setTooltip_carrinho(false);
            action_timeout(setTooltip_favoritos);
            // setTooltip_favoritos(true);
            return true;
          }
          else if (item.value === 'categorias' && item.status === false) {
            setTooltip_perfil(false);
            setTooltip_carrinho(false);
            setTooltip_favoritos(false);
            action_timeout(setTooltip_categoria);
            // setTooltip_categoria(true);
            return true;
          }
          else if (item.value === 'ordem' && item.status === false) {
            setTooltip_perfil(false);
            setTooltip_carrinho(false);
            setTooltip_favoritos(false);
            setTooltip_categoria(false);
            action_timeout(setTooltip_ordem);
            // setTooltip_ordem(true);
            return true;
          }
          else if (item.value === 'qrcode' && item.status === false) {
            setTooltip_perfil(false);
            setTooltip_carrinho(false);
            setTooltip_favoritos(false);
            setTooltip_categoria(false);
            setTooltip_ordem(false);
            action_timeout(setTooltip_qrcode);
            //setTooltip_qrcode(true);
            return true;
          }
          else if (item.value === 'lista_itens' && item.status === false && (pedido_mesa.length > 0 || pedido_online.length > 0)) {
            setTooltip_qrcode(false);
            action_timeout(setTooltip_lista_itens);
            //setTooltip_lista_itens(true);
            return true;
          }
          else if (item.value === 'ultimos_pedidos' && item.status === false && (props.user_info.ultimos_pedidos?.length > 0 && props.user_info?.status_mesa !== true)) {
            // console.log('entrou')
            setTooltip_lista_itens(false);
            setTooltip_ultimos_pedidos(false);
            action_timeout(setTooltip_ultimos_pedidos);
            //setTooltip_ultimos_pedidos(true);
            return true;
          }
          else if (item.value === 'relogio' && item.status === false && (condicaoRelogio)) {
            setTooltip_lista_itens(false);
            setTooltip_ultimos_pedidos(false);
            action_timeout(setTooltip_relogio);
            //setTooltip_relogio(true);
            return true;
          }
          return false; 
        });
      }else if(props.user_info?.status_tutorial === undefined){
        setTimeout(() => {
          setVisible1(true);
          setPrimeira_renderizacao(true);
        }, 1500);
      }
  }
  ///em desuso
  // useEffect(() => {
  //   // const tutorials = props.user_info.tutorial || [];
  //   // // console.log(tutorials);

  //   // if(props.user_info?.status_tutorial === true){
  //   //   if(tutorials.length === 0){
  //   //     props.onTutorial_inicial(props.user_info.id);
  //   //   }
  //   //   tutorials.some((item) => {
  //   //     if (item.value === 'perfil' && item.status === false) {
  //   //       setVisible1(false)
  //   //       action_timeout(setTooltip_perfil);
  //   //       // setTooltip_perfil(true);
  //   //       return true;
  //   //     } 
  //   //     else if (item.value === 'carrinho' && item.status === false) {
  //   //       setTooltip_perfil(false);
  //   //       action_timeout(setTooltip_carrinho);
  //   //       // setTooltip_carrinho(true);
  //   //       return true;
  //   //     }
  //   //     else if (item.value === 'favoritos' && item.status === false) {
  //   //       setTooltip_perfil(false);
  //   //       setTooltip_carrinho(false);
  //   //       action_timeout(setTooltip_favoritos);
  //   //       // setTooltip_favoritos(true);
  //   //       return true;
  //   //     }
  //   //     else if (item.value === 'categorias' && item.status === false) {
  //   //       setTooltip_perfil(false);
  //   //       setTooltip_carrinho(false);
  //   //       setTooltip_favoritos(false);
  //   //       action_timeout(setTooltip_categoria);
  //   //       // setTooltip_categoria(true);
  //   //       return true;
  //   //     }
  //   //     else if (item.value === 'ordem' && item.status === false) {
  //   //       setTooltip_perfil(false);
  //   //       setTooltip_carrinho(false);
  //   //       setTooltip_favoritos(false);
  //   //       setTooltip_categoria(false);
  //   //       action_timeout(setTooltip_ordem);
  //   //       // setTooltip_ordem(true);
  //   //       return true;
  //   //     }
  //   //     else if (item.value === 'qrcode' && item.status === false) {
  //   //       setTooltip_perfil(false);
  //   //       setTooltip_carrinho(false);
  //   //       setTooltip_favoritos(false);
  //   //       setTooltip_categoria(false);
  //   //       setTooltip_ordem(false);
  //   //       action_timeout(setTooltip_qrcode);
  //   //       //setTooltip_qrcode(true);
  //   //       return true;
  //   //     }
  //   //     else if (item.value === 'lista_itens' && item.status === false && (pedido_mesa.length > 0 || pedido_online.length > 0)) {
  //   //       setTooltip_qrcode(false);
  //   //       action_timeout(setTooltip_lista_itens);
  //   //       //setTooltip_lista_itens(true);
  //   //       return true;
  //   //     }
  //   //     else if (item.value === 'ultimos_pedidos' && item.status === false && (props.user_info.ultimos_pedidos?.length > 0 && props.user_info?.status_mesa !== true)) {
  //   //       // console.log('entrou')
  //   //       setTooltip_lista_itens(false);
  //   //       setTooltip_ultimos_pedidos(false);
  //   //       action_timeout(setTooltip_ultimos_pedidos);
  //   //       //setTooltip_ultimos_pedidos(true);
  //   //       return true;
  //   //     }
  //   //     else if (item.value === 'relogio' && item.status === false && (condicaoRelogio)) {
  //   //       setTooltip_lista_itens(false);
  //   //       setTooltip_ultimos_pedidos(false);
  //   //       action_timeout(setTooltip_relogio);
  //   //       //setTooltip_relogio(true);
  //   //       return true;
  //   //     }
  //   //     return false; 
  //   //   });
  //   // }else if(props.user_info?.status_tutorial === undefined){
  //   //   setTimeout(() => {
  //   //     setVisible1(true);
  //   //     setPrimeira_renderizacao(true);
  //   //   }, 1500);
  //   // }
 
  // }, [props.user_info,pedido_mesa,pedido_online]);

  ////////////////////////////////////////////////////// algoritmo q irá verificar os pedidos ativos q possuem o id do usuario e se existir um pedido que tenha o status===true iremos pegar o date do pedido e verificar com a hora atual do dispositivo se a diferença for entre 0 a 3 horas iremos mostrar uma mensagem que o pedido esta sendo entregue .
  const [visible_entrega, setVisible_entrega] = useState(false);

  const toggleDialog2 = () => {
    if(props.alerta === true){
      // console.log('entrou')
      setTimeout(() => {
        setVisible_entrega(!visible_entrega);
        props.onSet_carrinho_aviso(false);
      }, 6000);
    }else {
      // console.log('entrou 2 ')
      setTimeout(() => {
        setVisible_entrega(!visible_entrega);
      }, 1700);
    }
  };
  useEffect(() => {

    ////////////////////////Entrega
    const pedido_online_finalizados = props.pedidos?.filter((item) => item.id_user === props.user_info?.id && item.status === true) || [];

    if (pedido_online_finalizados.length > 0) {
      const pedido_ativo = pedido_online_finalizados.reduce((prev, current) => {
        return (new Date(prev.date?prev.date:0) > new Date(current.date?current.date:0)) ? prev : current;
      });
    
      if(pedido_ativo && pedido_ativo.date){
        
        const date = new Date(pedido_ativo.date)
        //////////////////////  verificacao de data
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Os meses começam do 0 em JavaScript
        const day = date.getDate();
        const hours = date.getHours(); 
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();  
        //////////////////////  
        // console.log('getime',day)

        const date_now = new Date()
        //////////////////////  verificacao de data
        const hours_now = date_now.getHours();
        const minutes_now = date_now.getMinutes();
        /////////////////////
        const diff = date_now.getTime() - date.getTime()
        //////////////////////  verificacao de data
        // console.log('hours',hours)
        // console.log('minutes',minutes)
        // console.log('hours_now',hours_now)
        // console.log('minutes_now',minutes_now)

        const diff_horas = diff / (1000 * 60 * 60)
        // console.log('getime',diff_horas)
        if(diff_horas < 3){ 
          toggleDialog2()
        }else {
          func_tutorial();
        }
      }
    }else {
      func_tutorial();
    }
    /////////////////////////////////Tutorial
  }, [props.pedidos,props.user_info,pedido_mesa,pedido_online]);
  /////////////////////////////////Tutorial

  /////////////////////////////////Aberto Fechado
  // const [visible_fechado_aberto, setVisible_fechado_aberto] = useState(false);
  const [fechado_aberto, setFechado_aberto] = useState(''); 
  const [data_fechado_aberto, setData_fechado_aberto] = useState(new Date());
  const data_hoje = new Date()
  
  useEffect(() => {
    // setVisible_fechado_aberto(props.modal_fechado_aberto);
    // console.log(props.modal_fechado_aberto)
    // console.log('data', data_fechado_aberto.getTime());

    setFechado_aberto(props.fechado_aberto);
    setData_fechado_aberto(new Date(props.data_fechado_aberto));
    
  }, [props.modal_fechado_aberto,props.fechado_aberto,props.data_fechado_aberto ]);

  const redirecionarParaRedeSocial = (redeSocial: string) => {
    let url;
  
    switch (redeSocial) {
      case 'facebook':
        url = 'https://www.facebook.com/MadrugaolanchesTupa';
        break;
      // Add more cases here for other social networks
      case 'instagram':
        url = 'https://www.instagram.com/madrugaolanchestupa/';
        break;
      default:
        url = 'https://www.facebook.com';
    }
  
    // Open the URL in the default web browser
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URL: ${url}`);
      }
    });
  };
  /////////////////////////////////Aberto Fechado

  /////////////////////////////////////////////DIALOG
  /// abrir telefone :
  const redirecionarParaLigacao = (numero) => {
    const numeroFormatado = `tel:${numero}`;
    // console.log(numeroFormatado)
    Linking.openURL(numeroFormatado)
      .catch((err) => console.error('Erro ao tentar abrir a ligação', err));
  };

  //////////////////////////////////////////////////////
  ///mensagem quando chamar o garcom 
  const [visible_garcom, setVisible_garcom] = useState(false);
  const toggleDialog1 = () => {
    setVisible_garcom(!visible_garcom);
  };

  // console.log( pedido_online.length > 0 && (props.user_info?.status_mesa === false || props.user_info?.status_mesa === undefined))
  //tamanho responsivo dos icones
  const windowWidth = Dimensions.get('window').width;
  const iconSize = windowWidth * 0.06; 
  ////////////////////////////////Expotoken//////////////////////////////////////
   useEffect(()=>{
    // console.log('props.user_on',props.expotoken)
    const tokenup = async () => {
      if(props.expotoken === undefined) return;
        if(props.user_on.token !== props.expotoken){
          // console.log('aki')
          await props.onAtualizar_token( props.expotoken,props.user_on.id,)
        }
    } 
    tokenup();
  },[props.expotoken]) 
  //////////////////////////////////////ambiente de treinamento e testes IA //////////////////////////////
  useEffect(() => {
    // Estrutura base para o cardápio:
    // {
    //   "nome_pai": "String",
    //   "filhos": [
    //     {
    //       "nome": "String",
    //       "valor": "Number",
    //       "ingredientes": "String",
    //       "adicionais": [
    //         {
    //           "nome": "String",
    //           "valor": "Number"
    //         }
    //       ],
    //       "categoria": "String",
    //       "categoria_2": "String"
    //     }
    //   ],
    //   "curtidas": "Number", 
    //   "pedidos_quantidades": "Number"
    // }
  
    const cardapio_pai = props.cardapio.filter(item => !('versao' in item));
    const cardapio_filhos = props.cardapio.filter(item => ('versao' in item));
  
    // Criando a estrutura do cardápio com pais e filhos:
    const cardapioOrganizado = cardapio_pai.map(item => {
      const filhos = cardapio_filhos.filter(filho => filho.versao === item.id);
      return {
        nome_pai: item.name,
        filhos: filhos.map(filho => ({
          nome: filho.name,
          valor: filho.valor,
          ingredientes: filho.ingredientes,
          adicionais: filho.adicionais,
          categoria: filho.categoria,
          categoria_2: filho.categoria_2
        })),
        curtidas: item.curtidas,
        pedidos_quantidades: item.pedidos_quantidade
      };
    });
  
    // console.log(JSON.stringify(cardapioOrganizado, null, 0));
  
    // Estrutura 2: { nomes_filhos: 'String',}
    const nomesFilhos = cardapio_filhos.map(item => item.name); 
  
    // Imprimindo os nomes dos filhos para fins de debug:
    // console.log(nomesFilhos);
    
    //Estrutura 3 : {id:string,name:string,ingredientes:[strings...],adicionais:[strings...]}
    const cardapio_filhos_2 = cardapio_filhos.map(item => ({
      id: item.id,
      name: item.name,
      ingredientes: item.ingredientes,
      adicionais: item.adicionais,
      categoria: item.categoria,
      categoria_2: item.categoria_2
    }));
    // console.log(JSON.stringify(cardapio_filhos_2, null, 0));
    
    
  }, [props.cardapio]);
  
  return (
    <SafeAreaView style={[styles.container,styles_dark0rligth.mode_theme_container]}>
      {/* /////////////////////////////////////////////////theme mode e qrcode */}
      <View style={{width:'100%', flexDirection:'row',justifyContent:'center',marginBottom:10}}>
        
        <TouchableOpacity 
          style={{flexDirection:'row',width:'50%',backgroundColor:'#DE6F00',borderRadius:10, elevation:2,justifyContent:'center',alignItems:'center',padding:5}}
          onPress={()=>{
          pedido_online.length > 0 && (props.user_info?.status_mesa === false || props.user_info?.status_mesa === undefined)?
          setModal_pedido(true):
          props.user_info.status_mesa?
          props.onUser_localidade(false,0,props.user_info.id):
          props.navigation.navigate('Qrcode')
        }}
        >
          
          {props.user_info.status_mesa?
          <Text style={{fontSize:14,fontFamily:'Roboto-Bold',color:'#ffffff'}}> Sair da Mesa N:{props.user_info.mesa} !</Text>:
          <>
            <AntDesign name="qrcode" size={20} color="#ffffff" />
            <Text style={{fontSize:14,fontFamily:'Roboto-Bold',color:'#ffffff'}}> Estou na Mesa !</Text>
          </>
          }
          
          
        </TouchableOpacity>
        <ControlledTooltip_qrcode
        popover={
          <>
          <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>QR code: </Text>
          <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
            Aqui você pode escanear o QR code da mesa para fazer pedidos.
          </Text>
        </>
        }
        withPointer={true}
        //orvelay
        withOverlay={true}
        overlayColor={'#3c404342'} 
        //container styles
        backgroundColor={'#f8fafd'}
        containerStyle={{elevation:3,shadowColor:'#E81000'}}
        //pointer styles
        pointerColor={'#DE6F00'}
        pointerStyle={{elevation:5,shadowColor:'#E81000'}}
        //tamanho 
        height={120}
        width={245}
        //controle de abertura e de dados
        open={tooltip_qrcode}
        //dados
        id_user={props.user_info.id}
        tutorials={props.user_info.tutorial}
        />
      </View>
      {/* /////////////////////////////////////////////////theme mode e qrcode */}
      
      {/* /////////////////////////////////////////////////////////// */}
      {/* /////////////////////Categoria///////////////////////// */} 
    
      <View style={{alignItems:'flex-start',width:'100%',backgroundColor:'#de6f0011',}}>

        {/* ////////////Categorias e ordens /////////////////////////////*/}
        <View style={{
          flexDirection:'row',
          justifyContent:'space-between',
          width:'100%',
          elevation:15, shadowColor:'#E81000',
          backgroundColor:'#fff',
          }}>
          {/* {bar?
            <Subcategoria_bar styles_mode={styles_dark0rligth}/>
          :null}
          {comida?
            <Subcategoria_comida styles_mode={styles_dark0rligth}/>
          :null} */}
        {/* ////////////Categoria /////////////////////////////*/}
          <View style={{width:'50%'}}>
            <Subcategoria_bar_new toggleFilter={toggleFilter} filters={filters} loading_categoria={loading_categoria}/>
            <Divider/>
            <Subcategoria_comida_new toggleFilter={toggleFilter} filters={filters} loading_categoria={loading_categoria}/>
            <Divider/>
            {/*  toucha opaciti para resetar o filtro de categoria */}
            <TouchableOpacity 
              onPress={()=>setFilters([])}
              style={{ 
                backgroundColor: '#DE6F00', 
                padding: 1, 
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{fontFamily:'Roboto-Bold',fontSize:14,color:'#f8f8f8',textAlign:'center'}}>Limpar filtros</Text>
            </TouchableOpacity>
            {/*  toucha opaciti para resetar o filtro de categoria */}
            <ControlledTooltip_categorias
            popover={
              <>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Filtros: </Text>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                Aqui você pode filtrar os itens do cardápio por categorias.
              </Text>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                Clique em mais do que uma categoria para filtrar mais de uma categoria ao mesmo tempo!
              </Text>
            </>
            }
            withPointer={true}
            //orvelay
            withOverlay={true}
            overlayColor={'#3c404342'}
            //container styles
            backgroundColor={'#f8fafd'}
            containerStyle={{elevation:3,shadowColor:'#E81000'}}
            //pointer styles
            pointerColor={'#DE6F00'}
            pointerStyle={{elevation:5,shadowColor:'#E81000'}}
            //tamanho 
            height={175}
            width={200}
            //controle de abertura e de dados
            open={tooltip_categoria}
            //dados
            id_user={props.user_info.id}
            tutorials={props.user_info.tutorial}
            />
          </View>
          {/* ////////////Categoria /////////////////////////////*/}

          {/* ////////////////lottie///////////////////////////// */}
          <View style={{flex: 1}}  pointerEvents="none">
            <LottieView
              loop={false}
              ref={animation_search}
              source={require('../../assets/anim/searching_animacao.json')}
              style={{transform: [{scale: 1.2}]}}
              
            />
          </View>
          {/* ////////////////lottie///////////////////////////// */}

          {/* ////////////Filtro /////////////////////////////*/}
          <View style={{width:'15%'}}>

            <View style={styles.container_filtro}>
              <TouchableOpacity style={[styles.buttons_filtro,mais_curtidas? {borderWidth:1,borderColor:'#E81000',borderRadius:10} :null]} onPress={()=>{
                setMais_curtidas(true)
                setMais_pedidos(false)
                }
              }>
                {/* <IconComponent name={icon} size={25} color="#fff" /> */}
                {loading_mais_curtidas?
                <ActivityIndicator size="small" color="#3C4043" />
                :<FontAwesome5 name="heartbeat" size={iconSize} color="#3C4043" />}
                
                <Text style={styles.text_filtro}>+curtidos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.buttons_filtro,mais_pedidos? {borderWidth:1,borderColor:'#E81000',borderRadius:10} :null]} onPress={()=>{
                setMais_pedidos(true)
                setMais_curtidas(false) 
                }
              }>
                {/* <IconComponent name={icon} size={25} color="#fff" /> */}
                {loading_mais_pedidos?
                <ActivityIndicator size="small" color="#3C4043" />
                :<Fontisto name="smiling" size={iconSize} color="#3C4043" />}
                
                <Text style={styles.text_filtro} >+pedidos</Text>
              </TouchableOpacity>
              
            </View>
            <ControlledTooltip_ordem
            popover={
              <>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Filtros: </Text>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                Aqui você pode ordenar os itens do cardápio por mais curtidos ou mais pedidos.
              </Text>
            </>
            }
            withPointer={true}
            //orvelay
            withOverlay={true}
            overlayColor={'#3c404342'}
            //container styles
            backgroundColor={'#f8fafd'}
            containerStyle={{elevation:3,shadowColor:'#E81000'}}
            //pointer styles
            pointerColor={'#DE6F00'}
            pointerStyle={{elevation:5,shadowColor:'#E81000'}}
            //tamanho 
            height={140}
            width={200}
            //controle de abertura e de dados
            open={tooltip_ordem}
            //dados
            id_user={props.user_info.id}
            tutorials={props.user_info.tutorial}
            />
          </View>
          {/* ////////////Filtro /////////////////////////////*/}
          
        </View>
        {/* ////////////Favoritos /////////////////////////////*/}
        
        <View style={styles.favoritos}>
          {/*fechado ou fechadodata  */}
          {fechado_aberto === 'fechado'?
          <View style={{ alignItems: 'center',width: '50%'}}>
            <Text style={{ color: 'red', fontSize: 17 }}>FECHADO</Text>
            <Text style={{ fontSize: 10 }}>Sem privisão para abrir</Text>
          </View>
          :null}
          {fechado_aberto === 'fechadodata'?
          <View style={{ alignItems: 'center',width: '50%'}}>
            <Text style={{ color: 'red', fontSize: 17 }}>FECHADO</Text>
            <Text style={{ fontSize: 10 }}>
            Iremos abrir {
                        data_fechado_aberto.getDate() === data_hoje.getDate() && data_fechado_aberto.getMonth() === data_hoje.getMonth()
                          ? `hoje às ${data_fechado_aberto.getHours().toString().padStart(2, '0')}:${data_fechado_aberto.getMinutes().toString().padStart(2, '0')}`
                          : `no dia ${data_fechado_aberto.getDate()}/${data_fechado_aberto.getMonth() + 1} às ${data_fechado_aberto.getHours().toString().padStart(2, '0')}:${data_fechado_aberto.getMinutes().toString().padStart(2, '0')}`
                      }
            </Text>
          </View>
          :null}
          {/*fechado ou fechadodata  */}

          <TouchableOpacity style={{alignItems:'center'}} 
          onPress={()=>{
              if(voltar_favoritos){
                
                setVoltar_favoritos(false)
                setFilters([])
                return
              }else{
                if(voltar_ultimo_pedido){
                  setVoltar_ultimo_pedido(false)
                  toggleFavoritos()
                  return
                }else{
                  toggleFavoritos()
                }
              }
          }}>
              
            {
            loading_favoritos?
            <ActivityIndicator size="small" color="#3C4043" />
            :voltar_favoritos?
            <Ionicons name="return-down-back" size={24} color="#3C4043" />:
            <MaterialCommunityIcons name="hand-heart-outline" size={24} color="#3C4043" />
            }

            <Text style={{color:'#3C4043',fontSize:10,fontFamily:'Roboto-Regular'}}>Favoritos</Text>
            <ControlledTooltip_favoritos
            popover={
              <>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Favoritos: </Text>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                Aqui aparecerão seus itens curtidos. Crie uma lista só sua!
              </Text>
            </>
            }
            withPointer={true}
            //orvelay
            withOverlay={true}
            overlayColor={'#3c404342'}
            //container styles
            backgroundColor={'#f8fafd'}
            containerStyle={{elevation:3,shadowColor:'#E81000'}}
            //pointer styles
            pointerColor={'#DE6F00'}
            pointerStyle={{elevation:5,shadowColor:'#E81000'}}
            //tamanho 
            height={150}
            width={200}
            //controle de abertura e de dados
            open={tooltip_favoritos}
            //dados
            id_user={props.user_info.id}
            tutorials={props.user_info.tutorial}
            />
          </TouchableOpacity>
          
      {/* ////////////Favoritos /////////////////////////////*/}
      {/* //////////// ultimos pedidos /////////////////////////////*/}
          {props.user_info.ultimos_pedidos && props.user_info?.status_mesa !== true?<Divider orientation="vertical" style={{marginLeft:10,marginRight:10}}/>:null}

          <View>
            {props.user_info.ultimos_pedidos && props.user_info?.status_mesa !== true?
            <>
            <TouchableOpacity style={{alignItems:'center'}} 
            onPress={()=>{
              if(voltar_ultimo_pedido){
                
                setVoltar_ultimo_pedido(false)
                setFilters([])
                return
              }else{
                if(voltar_favoritos){
                  setVoltar_favoritos(false)
                  toggleUltimo_pedido()
                  return
                }else{
                  toggleUltimo_pedido()
                }
              }
            }}>
              
              {
              loading_ultimo_pedido?
              <ActivityIndicator size="small" color="#3C4043" />
              :voltar_ultimo_pedido?
              <Ionicons name="return-down-back" size={24} color="#3C4043" />:
              <Fontisto name="favorite" size={24} color="#3C4043" />
              }
              <Text style={{color:'#3C4043',fontSize:10,fontFamily:'Roboto-Regular'}}>Ultimos Pedidos</Text>
              
            </TouchableOpacity> 
            </> 
            :null} 
              <ControlledTooltip_ultimos_pedidos
              popover={
                <>
                <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Ultimos Pedidos: </Text>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                  Aqui aparecerão seus ultimos pedidos. 
                  {'\n'}
                  Refaça pedidos anteriores com apenas um clique!
                </Text>
              </>
              }
              withPointer={true}
              //orvelay
              withOverlay={true}
              overlayColor={'#3c404342'}
              //container styles
              backgroundColor={'#f8fafd'}
              containerStyle={{elevation:3,shadowColor:'#E81000'}}
              //pointer styles
              pointerColor={'#DE6F00'}
              pointerStyle={{elevation:5,shadowColor:'#E81000'}}
              //tamanho 
              height={150}
              width={200}
              //controle de abertura e de dados
              open={tooltip_ultimos_pedidos}
              //dados
              id_user={props.user_info.id}
              tutorials={props.user_info.tutorial}
              />
          </View>
        {/* //////////// ultimos pedidos /////////////////////////////*/}
        </View>
          
          {/* ////////////Filtro /////////////////////////////*/}
      </View>
      {/* /////////////////////Categorias e ordens///////////////////////// */}

      {/* ////////////////////////////////////////////// FLATLIST*/}
      
      <View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        //
      }}>
        
        {
        lottie ?
        <View style={{
          flex: 1,
          // backgroundColor: '#003ffd',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:'#de6f0011'
          //
        }}>
            <LottieView
              autoPlay
              ref={animation}
              source={require('../../assets/anim/animacao_flatlist.json')}
              style={{width:'100%'}}
              speed={1.4}

            /> 
          </View>:
          voltar_ultimo_pedido ?
          <Flatlist_principal_ultimos_pedidos lista_pedidos={ultimo_pedido} pedido_online={pedido_online}/>:
          <Flatlist_principal cardapio={Cardapio} pedido_online={pedido_online} />
        }
        
      </View>
      
      {/* ////////////////////////////////////////////// FLATLIST*/}
      
      {/* ////////////////////////////////////////////// Base*/}
      <View style={[styles.base_view_container,{backgroundColor:'#de6f0011'}]}>

        {/*buttons relogio*/}
        
        <TouchableOpacity style={[styles.base_buttons,condicaoRelogio? {opacity:1}: {opacity:0}]} onPress={()=>{
          condicaoRelogio?
          props.navigation.navigate('Pedidos')
          :null
          }}> 
          {props.user_info.theme_mode ?
          <AntDesign name="clockcircleo" size={30} color="#f8fafd" />
          :<AntDesign name="clockcircleo" size={30} color="#202124" />}
            <ControlledTooltip_relogio
            popover={
              <>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Fila de Pedidos: </Text>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                Aqui você pode visualizar os pedidos que estão sendo preparados, e qual ordem que esta sendo preparado.
              </Text>
            </>
            }
            withPointer={true}
            //orvelay
            withOverlay={true}
            overlayColor={'#3c404342'}
            //container styles
            backgroundColor={'#f8fafd'}
            containerStyle={{elevation:3,shadowColor:'#E81000'}}
            //pointer styles
            pointerColor={'#DE6F00'}
            pointerStyle={{elevation:5,shadowColor:'#E81000'}}
            //tamanho 
            height={150}
            width={200}
            //controle de abertura e de dados
            open={tooltip_relogio}
            //dados
            id_user={props.user_info.id}
            tutorials={props.user_info.tutorial}
            />
        </TouchableOpacity> 
        
        {/*buttons relogio*/}
        
        
        {/* Iachat button navegation */}
        {/* Carrinho */}
        <View style={{width:'20%'}}>
          <ControlledTooltip_carrinho
          popover={
            <>
            <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Carrinho e Chamar Garçom: </Text>
            <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
              {'\n'}
              Esta seção contém informações sobre os itens adicionados no seu carrinho, informações de entrega e pagamento. 
              {'\n'}
            </Text>
            <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
              Podendo visualizar e editar os itens adicionados, como:
              {'\n'}
            </Text>
            <View style={{backgroundColor:'#DE6F00',padding:10,borderRadius:15,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#fff'}}>
                Excluir Item
              </Text>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#fff'}}>
                Quantidade : ...............
              </Text>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#fff'}}>
                Adicionais: ...............
              </Text>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#fff'}}>
                Retirar: ...............
              </Text>
            </View>
            <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
              {'\n'}
              Tambem contém a opção de chamar o garçom, caso você esteja no modo local em uma mesa do estabelecimento.
              {'\n'}
            </Text>
          </>
          }
          withPointer={true}
          //orvelay
          withOverlay={true}
          overlayColor={'#3c404342'}
          //container styles
          backgroundColor={'#f8fafd'}
          containerStyle={{elevation:3,shadowColor:'#E81000'}}
          //pointer styles
          pointerColor={'#DE6F00'}
          pointerStyle={{elevation:5,shadowColor:'#E81000'}}
          //tamanho 
          height={375}
          width={300}
          //controle de abertura e de dados
          open={tooltip_carrinho}
          //dados
          id_user={props.user_info.id}
          tutorials={props.user_info.tutorial}
          />
          <AnimatedTouchableOpacity 
          style={[styles.base_button_carrinho,styles_dark0rligth.carrinho,style]} 
          onPress={async()=>{
            if (props.user_info?.status_mesa && (props.adicionar_itens?.length === 0 || props.adicionar_itens === undefined)) {
              setLoadding_mesa(true);
              await props.onMesa_status_call(props.user_info?.mesa);
              toggleDialog1();
              setLoadding_mesa(false);
            } else {
              props.navigation.navigate('Carrinho');
            }
            }}>
            
            {renderAnimation()}
            
          </AnimatedTouchableOpacity>
        </View>
        {/* Carrinho */}

        {/* perfil e lista */}
        <View style={{flexDirection:'column'}}>
          {/* lista de pedido feito */}
          {/* Iachat button navegation */}
          <TouchableOpacity style={[styles.base_buttons,{marginBottom:10}]} onPress={()=>{
            props.navigation.navigate('IaChat')
          }}>
            <MaterialCommunityIcons name="robot-happy" size={30} color="tomato" />
          </TouchableOpacity>
          {/* Iachat button navegation */}

          <View>
          <ControlledTooltip_lista_itens
            popover={
              <>
              <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Lista de itens: </Text>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                Esta seção contém informações sobre os itens do pedidos. 
              </Text>
            </>
            }
            withPointer={true}
            //orvelay
            withOverlay={true}
            overlayColor={'#3c404342'} 
            //container styles
            backgroundColor={'#f8fafd'}
            containerStyle={{elevation:3,shadowColor:'#E81000'}}
            //pointer styles
            pointerColor={'#DE6F00'}
            pointerStyle={{elevation:5,shadowColor:'#E81000'}}
            //tamanho 
            height={120}
            width={245}
            //controle de abertura e de dados
            open={tooltip_lista_itens}
            //dados
            id_user={props.user_info.id}
            tutorials={props.user_info.tutorial}
            />
            {pedido_mesa.length > 0 || pedido_online.length > 0?
              
            <TouchableOpacity style={styles.base_buttons} onPress={()=>{props.navigation.navigate('Lista_itens')}}>
              
              {props.user_info.theme_mode ?
              <FontAwesome5 name="clipboard-list" size={24} color="#f8fafd" />:
              <FontAwesome5 name="clipboard-list" size={24} color="#202124" />}

            </TouchableOpacity>
            :null}
          </View>
          {/* lista de pedido feito */}
          
          {/* perfil */}
          <TouchableOpacity style={styles.base_buttons} onPress={()=>{
            setModal_perfil(true)
            }}>
            <ControlledTooltip_perfil
              popover={
                <>
                  <Text style={{fontFamily:'Roboto-Bold',fontSize:18}}>Perfil: </Text>
                  <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                    Esta seção contém informações detalhadas sobre sua conta. 
                  </Text>
                  <Text style={{fontFamily:'Roboto-Regular',fontSize:14,alignSelf:'flex-start'}}>
                    {'\n'}
                    Você pode visualizar e editar suas informações pessoais, como:
                    {'\n'}
                  </Text>
                  <View style={{backgroundColor:'#DE6F00',padding:10,borderRadius:15,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#fff'}}>
                      Rua : ...............
                    </Text>
                    <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#fff'}}>
                      numero : ...............
                    </Text>
                  </View>
                </>
              }
              withPointer={true}
              //orvelay
              withOverlay={true}
              overlayColor={'#3c404342'}
              //container styles
              backgroundColor={'#f8fafd'}
              containerStyle={{elevation:3,shadowColor:'#E81000'}}
              //pointer styles
              pointerColor={'#DE6F00'}
              pointerStyle={{elevation:5,shadowColor:'#E81000'}}
              //tamanho 
              height={210}
              width={300}
              //controle de abertura e de dados
              open={tooltip_perfil}
              //dados
              id_user={props.user_info.id}
              tutorials={props.user_info.tutorial}
            />
            <FontAwesome name="user-circle" size={30} color="#202124" />
              {/* {props.user_info.theme_mode ?
              <FontAwesome name="user-circle" size={30} color="#f8fafd" />:
              <FontAwesome name="user-circle" size={30} color="#202124" />} */}

          </TouchableOpacity>
          {/* perfil */}

        </View>
        {/* perfil e lista */}

        
      </View>
      {/* ////////////////////////////////////////////// Base*/}
      {/* DIALOG TUTORIAL QUER FAZER OU NAO? */}
      <Dialog
        isVisible={visible1}
        onBackdropPress={()=>setClickback(true)}

      >
        <Dialog.Title title="Tutorial" titleStyle={{fontFamily:'Roboto-Bold',fontSize:18}}/>
        <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>
          Decida se deseja ativar o tutorial. {'\n'} 
        </Text>
        <Text style={{fontFamily:'Roboto-Light',fontSize:15}}>
          Garantimos que o processo não tomará mais que 5 minutos do seu tempo.  {'\n'} 
        </Text>
        <Text style={{fontFamily:'Roboto-Light',fontSize:15}}>
          Ou, se preferir, pule direto para a ação! {'\n'} 
        </Text>
        {clickback?
        <View style={{backgroundColor:'#DE6F00',padding:10,borderRadius:15}}>
          <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#fff'}}>Porfavor Escolha uma das opções a baixo! </Text>
        </View>
        :null}
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:18}}>
          <TouchableOpacity onPress={async()=>{
            setLoading_tutorial(true)
            await props.onTutorial_status(false,props.user_info.id)
            setVisible1(false)
            setLoading_tutorial(false)
            }} style={{backgroundColor:'#f8fafd',elevation:2,shadowColor:'#E81000',padding:5,borderRadius:10}}>
              {loading_tutorial?<ActivityIndicator size="small" color="#DE6F00" />
              :<Text style={{fontFamily:'Roboto-Bold',fontSize:15}}>Sem Turorial</Text>}
            </TouchableOpacity>
          <TouchableOpacity onPress={async()=>{
            setLoading_tutorial(true)
            await props.onTutorial_status(true,props.user_info.id)
            setVisible1(false)
            setLoading_tutorial(false)
            
            }} style={{backgroundColor:'#f8fafd',elevation:2,shadowColor:'#E81000',padding:5,borderRadius:10}}>
              {loading_tutorial?<ActivityIndicator size="small" color="#DE6F00" />
              :<Text style={{fontFamily:'Roboto-Bold',fontSize:15}}>Fazer Tutorial</Text>}
            </TouchableOpacity>
        </View>
      </Dialog>
      {/* DIALOG TUTORIAL QUER FAZER OU NAO? */}

      {/* MODAL perfil */}
      <Modal
      animationType="fade"
      transparent={true}
      visible={modal_perfil}
      >
        <View style={{flex:1,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center'}}>
          <View style={{backgroundColor:'#fff',width:'80%',justifyContent:'space-between',alignItems:'center',borderRadius:20}}>
            <View style={{width:'100%',flexDirection: 'row', justifyContent: 'flex-end', alignItems:'flex-start'}}>
              <Ionicons name="md-close-circle-sharp" size={45} color="#3C4043" onPress={()=>setModal_perfil(false)}/>
            </View>
            
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image
                      style={{width:100,height:100,borderRadius:200}}
                      source={{uri: props.user_info.image_on}}
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
              <Text style={{fontFamily:'Roboto-Bold',fontSize:20}}>{props.user_info.name_on}</Text>
              <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>Cidade : Tupã - sp</Text>
              {/* rua */}
              <View style={{width:'100%',justifyContent:'space-between',alignItems:'flex-start',padding:10}}>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>Rua :</Text>
                <Input
                  placeholder="Rua"
                  value={rua}
                  onChangeText={(text) => setRua(text)}
                  style={{width:'100%'}}
                  />
              </View>
              {/* numero */}
              <View style={{width:'100%',justifyContent:'space-between',alignItems:'flex-start',padding:10}}>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>Número :</Text>
                <Input
                  placeholder="Número"
                  value={numero}
                  onChangeText={(text) => setNumero(text)}
                  style={{width:'100%'}}
                  />
              </View>
              {/* celular */}
              <View style={{width:'100%',justifyContent:'space-between',alignItems:'flex-start',padding:10}}>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>Celular :</Text>
                <Input
                  placeholder="Celular"
                  value={celular}
                  onChangeText={(text) => setCelular(text)}
                  style={{width:'100%'}}
                  />
              </View>
              {rua !== props.user_info.rua_on || numero !== props.user_info.numero_on || celular !== props.user_info.celular?
              <TouchableOpacity style={{width:'100%',justifyContent:'center',alignItems:'center',padding:10,backgroundColor:'#DE6F00'}}
              onPress={()=>{
                props.onRua_numero_celular(rua,numero,celular,props.user_info.id)
                setModal_perfil(false)
              }}
              >
                <Text style={{fontFamily:'Roboto-Bold',fontSize:15,color:'#f8fafd'}}>Salvar</Text>
              </TouchableOpacity>:null
              }

              {/* buttom sair logof firebase */}
                
              {/* <TouchableOpacity style={{width:'100%',justifyContent:'center',alignItems:'center',padding:10}}
              onPress={resetApp}
              >
                <Text style={{fontFamily:'Roboto-Bold',fontSize:15}}>Sair</Text>
              </TouchableOpacity>  */}
            </View>
          </View>
        </View>
      </Modal>
      {/* MODAL perfil */}

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

      {/* Dialog aviso de garcom */}
      <Dialog
        isVisible={visible_garcom}
        onBackdropPress={toggleDialog1}
        style={{borderRadius:20}}
        >
        <Dialog.Title title="Aviso" titleStyle={{fontFamily:'Roboto-Bold',fontSize:18}}/>
        <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}>
          Você Chamou o Garçom, logo ele irá te atender. {'\n'}
        </Text>
      </Dialog>
      {/* Dialog aviso de garcom */}
      
      {/* modal para notificar q o pedido esta a caminho */}
      <Modal
      animationType="fade"
      transparent={true}
      visible={visible_entrega}
      >
        <View style={{flex:1,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center'}}>
          <View style={{backgroundColor:'#fff',width:'80%',justifyContent:'space-between',alignItems:'center',borderRadius:20}}>
            <View style={{width:'100%',flexDirection: 'row', justifyContent: 'flex-end', alignItems:'flex-start'}}>
              <Ionicons name="md-close-circle-sharp" size={45} color="#3C4043" onPress={()=>setVisible_entrega(false)}/>
            </View>
            <ScrollView>
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
                <Text style={{fontFamily:'Roboto-Bold',fontSize:20,padding:5}}>Seu pedido está a caminho</Text>
                <LottieView
                  autoPlay
                  ref={animation}
                  source={require('../../assets/anim/entrega.json')}
                  style={{width:'100%',marginBottom:10,marginTop:10}}
                />
                <Text style={{fontFamily:'Roboto-Regular',fontSize:15,padding:5}}>Agradecemos a preferência, e esperamos que goste do seu pedido.{'\n'}</Text>
                <Text style={{fontFamily:'Roboto-Regular',fontSize:17,padding:5}}>Caso tenha algum problema ou seu pedido esta demorando muito entre em contato:</Text>
                <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#fff',padding:15,margin:30,borderRadius:10,borderWidth:1,borderColor:'#E81000',shadowColor:'#E81000',elevation:5}}> 
                  <TouchableOpacity onPress={()=>redirecionarParaLigacao(34911272)} >
                      <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}> 14 3491-1272</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView> 
          </View>
        </View>
      </Modal>
      {/* modal para notificar q o pedido esta a caminho */}

      {/* modal para notificar se a loja ta aberta ou fechada */}
      <Modal
      animationType="fade"
      transparent={true}
      visible={props.modal_fechado_aberto}
      >
        <View style={{flex:1,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center'}}>
          <View style={{backgroundColor:'#fff',width:'80%',justifyContent:'space-between',alignItems:'center',borderRadius:20}}>
            <View style={{width:'100%',flexDirection: 'row', justifyContent: 'flex-end', alignItems:'flex-start'}}>
              <Ionicons name="md-close-circle-sharp" size={45} color="#3C4043" onPress={()=>props.SetModal_fechado_aberto(false)}/>
            </View>
            <ScrollView> 
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
                <Text style={{fontFamily:'Roboto-Bold',fontSize:20,padding:5}}>Estamos Fechados</Text>
                <LottieView
                  autoPlay
                  ref={animation}
                  source={require('../../assets/anim/calendario.json')}
                  style={{width:'100%',marginBottom:10,marginTop:10}}
                />
                {fechado_aberto === 'fechado'?
                  <>
                      <Text style={{fontFamily:'Roboto-Regular',fontSize:17,padding:5}}>Atualmente estamos fechados e ainda não temos uma previsão para reabertura.{'\n'}</Text>
                      <Text style={{fontFamily:'Roboto-Regular',fontSize:15,padding:5}}>Acompanhe nossas redes sociais para receber atualizações e mais informações : </Text>

                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width:'50%'}}>
                        <TouchableOpacity onPress={() => redirecionarParaRedeSocial('instagram')}>
                          <Image
                            style={{width: 30, height: 30}}
                            source={require('../../assets/icones/instagram.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        {/* onPress={() => redirecionarParaRedeSocial('facebook')} */}
                        <TouchableOpacity onPress={() => redirecionarParaRedeSocial('facebook')}>
                          <Image
                            style={{width: 30, height: 30}}
                            source={require('../../assets/icones/facebook.png')}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                  </>
                :null}
                {fechado_aberto === 'fechadodata'?
                  <>
                    <Text style={{fontFamily:'Roboto-Regular',fontSize:17,padding:5}}>Atualmente, estamos fechados.{'\n'}</Text>
                    <Text style={{fontFamily:'Roboto-Regular',fontSize:15,padding:5}}>
                    Iremos abrir {
                        data_fechado_aberto.getDate() === data_hoje.getDate() && data_fechado_aberto.getMonth() === data_hoje.getMonth()
                          ? `hoje às ${data_fechado_aberto.getHours().toString().padStart(2, '0')}:${data_fechado_aberto.getMinutes().toString().padStart(2, '0')}`
                          : `no dia ${data_fechado_aberto.getDate()}/${data_fechado_aberto.getMonth() + 1} às ${data_fechado_aberto.getHours().toString().padStart(2, '0')}:${data_fechado_aberto.getMinutes().toString().padStart(2, '0')}`
                      }
                    </Text>
                  </>
                :null}
                <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#fff',padding:15,margin:30,borderRadius:10,borderWidth:1,borderColor:'#E81000',shadowColor:'#E81000',elevation:5}}> 
                  <TouchableOpacity onPress={()=>redirecionarParaLigacao(998881272)} >
                      <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}> WhatsApp : {'\n'}</Text>

                      <Text style={{fontFamily:'Roboto-Regular',fontSize:15}}> 14 99888-1272</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView> 
          </View>
        </View>
      </Modal>
      {/* modal para notificar se a loja ta aberta ou fechada */}

    </SafeAreaView>
  ); 
} 


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
   
/////////////////////////////////////////////// Filtro
  container_filtro:{
    borderRadius:20,
    alignItems:'center',

    backgroundColor:'#fff',
  },
  buttons_filtro:{
    padding:7,
    alignItems:'center',

  },
  text_filtro: {
    fontSize: 10,
    color: '#3C4043',
    fontFamily: 'Roboto-Regular',
  },
  //////////////////////////////////////////////// Base
  base_view_container:{
    flexDirection:'row',
    justifyContent:'space-between', 
    alignItems:'flex-end',
    width:'100%',
    height:'10%',

    padding:5,
  },
  base_buttons:{
    justifyContent:'center',
    alignItems:'center',
    margin:3,
    // width:"10%",
    // height:'50%', 
    // borderRadius:100
  },
  base_button_carrinho:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f8fafd',
    width:"100%", 
    aspectRatio: 1, // Adicionado para garantir que width e height sejam iguais
    borderRadius:9999, // Modificado para um valor muito alto para garantir q sera redondo

    elevation: 10,

    shadowColor: '#E81000',
  },
  //////////////////////////////////////////////Favoritos
  favoritos:{
    alignSelf: 'flex-end',
    flexDirection:'row',
    marginTop:25,
    marginRight:15, 
    //stilos
    backgroundColor:'#f8fafd',
    padding:5,
    borderRadius:10,
    elevation:5,

    borderColor:'#E81000',
    borderWidth:0.5,
  }
//nao usado
  //      //////////////////////////////////////////////// categoria
  // view_categoria:{
  //   backgroundColor:'#fff',
  //   margin:10,
  //   borderRadius:20,
  // },
  // buttons_categoria:{
  //   padding:15,
  //   borderRadius:20,
  // },
  // text: {
  //   fontSize: 13,
  //   color: '#3C4043',
    
  //   fontFamily: 'OpenSans-Bold',
  // },
});

const mapStateToProps = ({  user, cardapio,adicionar_pedido,pedidos,mesa, message }: { user: any,cardapio:any,adicionar_pedido:any,pedidos:any,mesa:any, message:any})=> {
  return {
    cardapio: cardapio.cardapio,
    onorof: cardapio.onorof,
    comments: cardapio.comments,
    isModalOpen: cardapio.modal,
    user_info: user.user_info,

    adicionar_itens: adicionar_pedido.adicionar_itens,

    pedidos: pedidos.pedidos,

    mesas:mesa.mesas,
    
    alerta: adicionar_pedido.alerta,

    modal_fechado_aberto: message.modal_fechado_aberto,
    data_fechado_aberto: message.data_fechado_aberto,
    fechado_aberto: message.fechado_aberto,

    expotoken: user.expotoken,
    user_on :user.user_info,
      };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onUpdate_theme: (id:string,theme_mode:boolean) => dispatch(update_On_theme(id,theme_mode)),
    onUser_localidade: (status_mesa:boolean, mesa:number, id_user:string) => dispatch(setUser_localidade(status_mesa,mesa,id_user)),
    onRua_numero_celular : (rua_on:string, numero_on:string,celular:string, id_user:string) => dispatch(setUser_rua_numero_celular(rua_on,numero_on,celular,id_user)),
    Resetstate : () => dispatch(resetState()),
    onMesa_status_call:(mesa:number) => dispatch(fetch_mesa_status_user_call(mesa)),

    onLogout: (state_logout:boolean) => dispatch(setLogout(state_logout)),
  //tutorials tudo sobre
    onTutorial_inicial : (id_user:string) => dispatch(setUser_tutorial_inicial(id_user)),
    onTutorial_status : (status:boolean,id_user:string) => dispatch(setUser_tutorial_status(status,id_user)),
    // onTutorial : (value:string,status: boolean, id_user: string) => dispatch(setUser_tutorial(value,status,id_user)),
    onSet_carrinho_aviso: (alerta:boolean) => dispatch(set_carrinho_aviso_tutorialeentrega(alerta)),
    
    SetModal_fechado_aberto: (modal:boolean) => dispatch(setModal_Fechado_aberto(modal)),
    
    onAtualizar_token: (token:string,id_user:string) => dispatch(setUser_token(token,id_user)),
  };
}; 
export default connect(mapStateToProps,mapDispatchProps)(Principal_comp);