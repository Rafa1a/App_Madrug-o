import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useStyles } from '../styles/styles_dark_ligth';
import { connect } from 'react-redux';
import { Divider } from '@rneui/themed';
import { Subcategoria } from '../interface/Novas_componentes';



const App = (props: Subcategoria) => {
    //Estilo customizado do dark mode
    const styles_dark0rligth = useStyles(props.user_info);  
    const theme = props.user_info?props.user_info.theme_mode || false :null;
    //tamanho responsivo dos icones
    const windowWidth = Dimensions.get('window').width;
    const iconSize = windowWidth * 0.06; 
    // loading
    const [loading_definir,setLoading_definir] = React.useState('');
    //button component com estilos customizados
    const Button = ({ icon, text, IconComponent, funcao_string }) => (
        <TouchableOpacity 
        style={[styles.buttons_subcategoria,
            props.filters.includes(funcao_string)?
            {elevation:5,shadowColor:'#E81000',backgroundColor:'#fff',borderWidth:1,borderColor:'#E81000'}
            :{}]} 
            
        onPress={()=>{props.toggleFilter(funcao_string),setLoading_definir(funcao_string)}}>

            <IconComponent name={icon} size={iconSize} color="#202124" />

            <Text 
            style={[styles.text_sub,styles_dark0rligth.text_sub_categoria]}>
                {text}
            </Text>

        </TouchableOpacity>
    );
    //atualizacao loading
    useEffect(() => {
        if (!props.filters.includes('hamburguer') && !props.filters.includes('hotdog') && !props.filters.includes('porcao')) {
            setLoading_definir('');
        }
    }, [props.filters]);          
                
    return (
        <>
            {/* <Text style={[styles.text,styles_dark0rligth.text_sub_categoria]}>Comidas</Text> */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection:'row'}}>
                    
                    {loading_definir === 'hamburguer' && props.loading_categoria?
                    <ActivityIndicator size="small" color="#3C4043" />:
                    <Button icon="hamburger" text="hamburguer" IconComponent={FontAwesome5} funcao_string='hamburguer'/>
                    }

                    <Divider orientation="vertical"/>

                    {loading_definir === 'hotdog' && props.loading_categoria?
                    <ActivityIndicator size="small" color="#3C4043" />:
                    <Button icon="hotdog" text="hotdog" IconComponent={FontAwesome5} funcao_string='hotdog'/>
                    }

                    <Divider orientation="vertical"/>

                    {loading_definir === 'porcao' && props.loading_categoria?
                    <ActivityIndicator size="small" color="#3C4043" />:
                    <Button icon="food-turkey" text="Porções" IconComponent={MaterialCommunityIcons} funcao_string='porcao' />
                    }

                    <Divider orientation="vertical"/>

                    {/* <Button icon="cow" text="Boi" IconComponent={MaterialCommunityIcons} funcao_string='boi'/>
                    <Divider orientation="vertical"/>

                    <Button icon="pig-variant-outline" text="Porco" IconComponent={MaterialCommunityIcons} funcao_string='porco'/>
                    <Divider orientation="vertical"/>

                    <Button icon="food-drumstick" text="Frango" IconComponent={MaterialCommunityIcons} funcao_string='frango'/>
                    <Divider orientation="vertical"/>

                    <Button icon="fish" text="Peixe" IconComponent={FontAwesome5} funcao_string='peixe'/>
                    <Divider orientation="vertical"/>

                    <Button icon="food-apple-outline" text="Vegano" IconComponent={MaterialCommunityIcons}  funcao_string='vegano'/> */}

                </View>
            </ScrollView>

            {/* separador */}
            {/* <View style={[styles.separator,styles_dark0rligth.separator]}/> */}
        </>
    );
}

const styles = StyleSheet.create({
    text:{
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
    },
    buttons_subcategoria:{
        padding:6,
        borderRadius:10,
        alignItems:'center',
    },
    text_sub: {
        fontSize: 10,
        fontFamily: 'Roboto-Regular',
    },
    separator: {
        height:'100%',
        width:1.1
    }
});
const mapStateToProps = ({  user }: { user: any})=> {
    return {
      user_info: user.user_info,
        };
  };
export default connect(mapStateToProps)(React.memo(App));