import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useStyles } from '../styles/styles_dark_ligth';
import { connect } from 'react-redux';



const App = (props: any) => {
    //Estilo customizado do dark mode
    const styles_dark0rligth = useStyles(props.user_info);  
    const theme = props.user_info?props.user_info.theme_mode || false :null;


    const Button = ({ icon, text, IconComponent }) => (
        <TouchableOpacity style={styles.buttons_subcategoria}>
            {theme?
            <IconComponent name={icon} size={17} color="#f8fafd" />
            :<IconComponent name={icon} size={17} color="#202124" />}
            
            <Text style={[styles.text_sub,styles_dark0rligth.text_sub_categoria]}>{text}</Text>
        </TouchableOpacity>
    );
    return (
        <>
            <View>
                <Button icon="hamburger" text="hamburguer" IconComponent={FontAwesome5} />
                <Button icon="hotdog" text="hotdog" IconComponent={FontAwesome5} />
                <Button icon="food-turkey" text="Porções" IconComponent={MaterialCommunityIcons} />
            </View>

            {/* separador */}
            <View style={[styles.separator,styles_dark0rligth.separator]}/>

            <View>
                <Button icon="cow" text="Boi" IconComponent={MaterialCommunityIcons} />
                <Button icon="pig-variant-outline" text="Porco" IconComponent={MaterialCommunityIcons} />
            </View>

            {/* separador */}
            <View style={[styles.separator,styles_dark0rligth.separator]}/>

            <View>
                <Button icon="food-drumstick" text="Frango" IconComponent={MaterialCommunityIcons} />
                <Button icon="food-apple-outline" text="Vegano" IconComponent={MaterialCommunityIcons}  />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    buttons_subcategoria:{
        padding:5,
        alignItems:'center',
    },
    text_sub: {
        fontSize: 9,
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