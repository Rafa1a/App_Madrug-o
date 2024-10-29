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
import { MaterialIcons, MaterialCommunityIcons,Ionicons,Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { useStyles } from '../styles/styles_dark_ligth';
import { Divider } from '@rneui/themed';
import { Subcategoria } from '../interface/Novas_componentes';




const App = (props: Subcategoria) => {

    const styles_dark0rligth = useStyles(props.user_info);  
    const theme = props.user_info?props.user_info.theme_mode || false :null;
    const [loading_definir,setLoading_definir] = React.useState('');
    //tamanho responsivo dos icones
    const windowWidth = Dimensions.get('window').width;
    const iconSize = windowWidth * 0.06; 
    // console.log(props.filters.includes('refri'));
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

    useEffect(() => {
        if (!props.filters.includes('refri') && !props.filters.includes('sucos') && !props.filters.includes('cerveja') && !props.filters.includes('drinks')) {
            setLoading_definir('');
        }
    }, [props.filters]);  
    
    return (
        <>  
            {/* <Text style={[styles.text,styles_dark0rligth.text_sub_categoria]}>Bebidas</Text> */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection:'row'}}>

                    {loading_definir === 'refri' && props.loading_categoria?
                    <ActivityIndicator size="small" color="#3C4043" />:
                    <Button icon="bottle-soda-classic-outline" text="Refri" IconComponent={MaterialCommunityIcons} funcao_string='refri'/>
                    }
                    
                    <Divider orientation="vertical"/>

                    { loading_definir === 'sucos' && props.loading_categoria?
                    <ActivityIndicator size="small" color="#3C4043" />:
                    <Button icon="local-drink" text="Sucos" IconComponent={MaterialIcons} funcao_string='sucos'/>
                    }
                    <Divider orientation="vertical"/>

                    { loading_definir === 'cerveja' && props.loading_categoria?
                    <ActivityIndicator size="small" color="#3C4043" />:
                    <Button icon="beer-outline" text="Cerveja" IconComponent={Ionicons} funcao_string='cerveja'/>
                    }
                    
                    <Divider orientation="vertical"/>

                    { loading_definir === 'drinks' && props.loading_categoria?
                    <ActivityIndicator size="small" color="#3C4043" />:
                    <Button icon="drink" text="Drinks" IconComponent={Entypo} funcao_string='drinks' />
                    }
                    
                </View>

                {/* separador */}
                {/* <View style={[styles.separator,styles_dark0rligth.separator]}/> */}
            </ScrollView>
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
        color: '#fff',
        fontFamily: 'Roboto-Regular',
    },
    separator: {
        backgroundColor:'#fff',
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