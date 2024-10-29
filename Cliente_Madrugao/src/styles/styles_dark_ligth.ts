import { makeStyles } from '@rneui/themed';

type Props = {
    fullWidth?: boolean;
  };
  
  export const useStyles = makeStyles((theme, props: any) => ({
    mode_theme_container: {
        backgroundColor: props?.theme_mode?"#202124":"#ffffff",
    },
    mode_theme_animated: {
        backgroundColor:  props?.theme_mode?"#515457":"#e8f0fe",

    },
    /////////////////card/////////////////////
    mode_theme_card: {
        backgroundColor:  props?.theme_mode?"#3C4043":"#f8fafd",
        elevation: 5,
        shadowColor: props?.theme_mode?'#f8fafd':'#202124',
    },
    mode_theme_card_text: {
        color: props?.theme_mode?"#f8fafd":"#202124",
    },
    mode_theme_card_image: {
        //nao sendo usado
        shadowColor: props?.theme_mode?"#f8fafd":"#202124",
    },
    /////////////////////////////categoria/////////////////////////
    view_categoria:{
        backgroundColor: props?.theme_mode?"#f8fafd":"#f8fafd",
        elevation: 8,
        shadowColor: props?.theme_mode?'#f8fafd':'#202124',
    },
    ///////////////////////////////sub_categoria/////////////////////////
    text_sub_categoria:{
        color: props?.theme_mode?"#f8fafd":"#202124",
    },
    separator:{
        backgroundColor: props?.theme_mode?"#f8fafd":"#202124",
    },
    ///////////////////////////////carrinho/////////////////////////
    carrinho: {
        shadowColor: props?.theme_mode?"#f8fafd":"#202124",
    },
  }));
 