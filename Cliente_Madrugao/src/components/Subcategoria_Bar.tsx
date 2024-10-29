import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons,Ionicons,Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { useStyles } from '../styles/styles_dark_ligth';




const App = (props: any) => {

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
                <Button icon="bottle-soda-classic-outline" text="Refri" IconComponent={MaterialCommunityIcons} />
                <Button icon="local-drink" text="Sucos" IconComponent={MaterialIcons} />
            </View>

            {/* separador */}
            <View style={[styles.separator,styles_dark0rligth.separator]}/>

            <View>
                <Button icon="beer-outline" text="Cerveja" IconComponent={Ionicons} />
                <Button icon="drink" text="Drinks" IconComponent={Entypo} />
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    buttons_subcategoria:{
        padding:10,
        borderRadius:20,
        alignItems:'center',
    },
    text_sub: {
        fontSize: 9,
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