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
import { connect } from 'react-redux';
import { setAdicionar_itens } from '../store/action/adicionar_pedido';
import { Item } from '../interface/inter';

interface Props_adicionar {
  item: any;
  adicionar_itens?: any;
  adicionar_adicionais?: string[];
  setAdicionar_adicionais?: (adicionais: any) => void;

  versoes?:boolean;
  index ?: number;
  setIndex_selecionado?: (index: number) => void;
  index_selecionado?: number;

}
const Flatlist_adicionar = (props:Props_adicionar) =>{
  //checkbox
  const [check1, setCheck1] = React.useState(false);
  
  useEffect(()=>{
    if(props.versoes){
      if(props.index === props.index_selecionado){
        setCheck1(true)
      }else {
        setCheck1(false)
      }
    }else {
    if(check1){
        props.setAdicionar_adicionais([...(props.adicionar_adicionais ?? []), props.item.name])
    } else {
        props.setAdicionar_adicionais((props.adicionar_adicionais ?? []).filter((item: string) => item != props.item.name))
    }
    }
    
  },[check1,props.index_selecionado]) 
  // caso o tem ja exista, definir check como true
  useEffect(()=>{
    // console.log(props.adicionar_adicionais)

      if(props.adicionar_adicionais?.includes(props.item.name)){
        setCheck1(true)
      }
  },[props.adicionar_adicionais])
  return(
    
    <TouchableOpacity style={[styles.flatlist_container,{ width:'75%',elevation:3,}]} onPress={()=>{
      setCheck1(!check1)
      if(props.versoes){
        props.setIndex_selecionado(props.index)
      }
      }}>
       <View style={styles.flatlist_container} >

            <View style={{width:'50%',alignItems:'center',}}>
                <Text style={styles.text_flatlist}>{props.item.name}</Text>
            </View>

            <View style={{width:'30%',alignItems:'center',}}>
              {props.versoes ? 
              <Text style={styles.text_flatlist}>  =  ${Number(props.item.valor).toFixed(2)}</Text> 
              : <Text style={styles.text_flatlist}>+ ${Number(props.item.valor).toFixed(2)}</Text>}
                
            </View>

            <CheckBox
                center
                checkedIcon={<MaterialCommunityIcons name="checkbox-blank-circle" size={20} color="#DE6F00" />}
                uncheckedIcon={<MaterialCommunityIcons name="checkbox-blank-circle-outline" size={15} color="#DE6F00" />}
                // iconType="material"
                checkedColor="red"
                // title="Click Here"
                checked={check1}
                onPress={() => setCheck1(!check1)}

                containerStyle={{width:'20%',backgroundColor:'#f4f7fc0'}}
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
    backgroundColor:'#f4f7fc',
    borderRadius:10,

    marginVertical:5,
  },
  text_flatlist:{
    color: '#3C4043',
    fontSize: 15,
    fontFamily:'OpenSans-Regular',
}
,
});
const mapStateToProps = ({ adicionar_pedido }: { adicionar_pedido:any})=> {
  return {
    
    adicionar_itens: adicionar_pedido.adicionar_itens,
      };
};
export default connect(mapStateToProps)(Flatlist_adicionar)