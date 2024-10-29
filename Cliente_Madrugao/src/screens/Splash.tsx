import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { setComments, setOnorof, startCardapio } from '../store/action/cardapio';
// 
import { useStyles } from '../styles/styles_dark_ligth';
import { user_on } from '../interface/inter';
import { setQr_code, startUser_on_info, startUsers_on } from '../store/action/user';
import { startPedidosListener } from '../store/action/pedidos';
import { startMesas } from '../store/action/mesas';
import { startfechado_aberto } from '../store/action/message';
import { startpaesListeners } from '../store/action/paes';

interface SplashProps {
    navigation: any;
    cardapio: any;
    user_info: user_on;
    users: user_on[];

    qrcode:boolean
    
    onCardapio: ()=>void;
    onUsers: ()=>void;
    onPedidos: ()=>void;
    onMesas: ()=>void;
    setComments: (comments:string)=>void;
    setOnorof: (onorof:string)=>void;
    OnQr_code?: (qrcode:boolean) => void;
    onFechado_Aberto?: ()=>void;
    OnfetchPaes?: ()=>void;

}
function Splash(props: SplashProps) {


  //Estilo customizado do dark mode
  const styles_dark0rligth = useStyles(props.user_info);  

    ////animacao
    const animation = useSharedValue(-100);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: animation.value }],
      };
    });

    //card menores animacao
    const animation_m = useSharedValue(-100);

    const animatedStyle_m = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: animation_m.value }],
      };
    });
    //////////////
   ////animacao
    React.useEffect(() => {

        animation.value = withRepeat(
            withSequence(
                withTiming(300, { duration: 900 }),
                withTiming(-200, { duration: 0 }),
          ), -1, true
        );
        animation_m.value = withRepeat(
            withSequence(
                withTiming(250, { duration: 900 }),
                withTiming(-150, { duration: 0 }),
          ), -1, true
        );

        // 
    }, []); 
    //
    //carregar dados backend
    //
   useEffect(() => {
        //carregar dados backend
        const carregarcardapio_users_pedidos = async () => {
          await props.onCardapio();
          await props.onUsers();
          await props.onPedidos();
          await props.onFechado_Aberto();
          await props.OnfetchPaes();
          
        }
        const carregar_mesa = async () => {
          await props.onMesas();
        }
        // console.log(props.qrcode)
        
        if(props.qrcode === false){
          carregarcardapio_users_pedidos();
          props.OnQr_code(true);
        }
        //
        if(props.user_info?.status_mesa){
          carregar_mesa();
        }
        //
    }, []);
    
    useEffect(() => { 

      if(props.cardapio && props.users){
        // console.log('props.cardapio');
        setTimeout(() => {
          props.navigation.replace('Principal');
        },1500);

      }

    }, [props.cardapio,props.users]);
    //
  //////////////////////////////////////onofor e comentarios atualizacao GATILHO de mudanças
    useEffect(() => {
      if(props.cardapio !== undefined){
        // console.log(props.cardapio[0])
        //onorof do cardapio caso mude
        const onorofValues = props.cardapio.map(item => item.onorof).join();
        props.setOnorof(onorofValues);
        //comentarios do cardapio caso mude
        const comentariosValues = props.cardapio.map(item => item.comments).join();
        props.setComments(comentariosValues);
      }
    },[props.cardapio]);
    
//////////////////////////////////////
  return (
    <SafeAreaView style={[styles.container,styles_dark0rligth.mode_theme_container]}>

        {/* <View style={[styles.view_secundario,{ overflow: 'hidden' }]}>
            <Animated.View style={[styles.box_animacao, animatedStyle_m, ]}/>
        </View> */}
        

            
        <View style={[styles.view_principal,styles_dark0rligth.mode_theme_card]}>
            <View style={[{ overflow: 'hidden',width:'100%',flex:1,borderRadius: 30,}]}>
                <Animated.View style={[styles.box_animacao,styles_dark0rligth.mode_theme_animated, animatedStyle]} />
            </View>
            {
            props.user_info?props.user_info.theme_mode?
              <Image 
                  source={require('../../assets/estilos/desfoque.png')} 
                  style={styles.circulo}
              />:
              <Image 
              source={require('../../assets/estilos/desfoque_black.png')} 
              style={styles.circulo}
              />
            :null}
            
        </View>

        {/* <View style={[styles.view_secundario,{ overflow: 'hidden' }]}>
            <Animated.View style={[styles.box_animacao, animatedStyle_m, ]}/>
        </View> */}

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202124'
  },
  view_principal: {
    height: '45%',
    width: '55%',
    backgroundColor: '#3C4043',
    margin: 20,
    borderRadius: 30,

    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  view_secundario: {
    height: '35%',
    width: '45%',
    backgroundColor: '#3C4043',

    borderRadius: 30,
  },
  circulo:{
    position: 'absolute',
    bottom: '-40%',

    height: '25%',
    width: '70%',
    // backgroundColor: '#f8fafd',
    borderRadius: 300,

    opacity: 0.1,
  },

  box_animacao: {
    height: '100%',
    width: '15%',
    opacity: 0.5,

    borderRadius: 30,
  },
  
  
});
const mapStateToProps = ({  user, cardapio }: { user: any,cardapio})=> {
  return {
    cardapio: cardapio.cardapio,
    user_info: user.user_info,
    users: user.users,

    qrcode:user.qrcode

      };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        onCardapio : () => dispatch(startCardapio()),
        onUsers : () => dispatch(startUsers_on()),
        onPedidos : () => dispatch(startPedidosListener()),
        onMesas: () => dispatch(startMesas()),
        onFechado_Aberto: () => dispatch(startfechado_aberto()),

        setComments : (comments:string) => dispatch(setComments(comments)),
        setOnorof : (onorof:string) => dispatch(setOnorof(onorof)),
        OnQr_code: (qrcode:boolean) => dispatch(setQr_code(qrcode)),
        OnfetchPaes: () => dispatch(startpaesListeners())

      };
};
export default connect(mapStateToProps,mapDispatchToProps)(Splash);