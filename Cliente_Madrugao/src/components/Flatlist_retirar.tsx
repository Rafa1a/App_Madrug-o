import { CheckBox } from '@rneui/themed';
import React, { useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props_retirar {
  item: any;
  retirar_: string[];
  setRetirar_: (retirar_: any) => void;
}

const Flatlist_retirar = (props:Props_retirar) =>{
  //checkbox
  const [check1, setCheck1] = React.useState(false);
  
  useEffect(() => {
    if (check1) {
      props.setRetirar_([...(props.retirar_ ?? []), props.item]);
    } else {
      props.setRetirar_((props.retirar_ ?? []).filter((item: string) => item != props.item));
    }
  }, [check1]);
  // caso o tem ja exista, definir check como true
  useEffect(()=>{
    // console.log(props.adicionar_adicionais)
    if(props.retirar_?.includes(props.item)){
      setCheck1(true)
    }
  },[props.retirar_]) 
  return(
    <TouchableOpacity style={[styles.flatlist_container,{ width:'75%',elevation:3,}]} onPress={()=>{setCheck1(!check1)}}>

       <View style={styles.flatlist_container}>

            <View style={{width:'80%',alignItems:'center'}}>
                <Text style={styles.text_flatlist}>{props.item}</Text>
            </View>
            
            <CheckBox
                center
                checkedIcon={<MaterialCommunityIcons name="checkbox-blank-circle" size={22} color="#DE6F00" />}
                uncheckedIcon={<MaterialCommunityIcons name="checkbox-blank-circle-outline" size={15} color="#DE6F00" />}
                // iconType="material"
                checkedColor="red"
                // title="Click Here"
                checked={check1}
                onPress={() => setCheck1(!check1)}

                containerStyle={{width:'20%',backgroundColor:'#f8fafd0'}}
            />
            
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  //////////////////////////////////////////////// FLATLIST
  flatlist_container:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#f8fafd',
    borderRadius:10,

    // elevation:3,
    marginVertical:5,
  },
  text_flatlist:{
    color: '#3C4043',
    fontSize: 15,
    fontFamily:'OpenSans-Regular',
}
,
});

export default Flatlist_retirar