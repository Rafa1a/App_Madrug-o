import { ListItem, Switch } from '@rneui/themed';
import React, { useState } from 'react';
import {
  StyleSheet,

  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import { estoque_comp } from '../interface/inter_cardapio';




export default (props: estoque_comp) => {
  // controle modal
  const [modalVisible, setModalVisible] = useState(false);
  //definir valor de entrada para estoque 
  const [inputValue, setInputValue] = useState('');
  

  return (
    
    <>
      <ListItem 
        containerStyle={{
        backgroundColor: '#28292a',    
        borderRadius:25,
        margin:10}} 
        bottomDivider
      >
        
        <Text style={styles.estoque}>
            {props.estoque?`x ${props.estoque}`:null}
        </Text>
        
        <ListItem.Content>
          {/*condicao para mudar o valor do estoque apenas em bebidas, props.estoq só tem em bebidas*/}
          {props.estoq?
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <ListItem.Title style={styles.title}>
              {props.name}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtittle}>
              {props.categoria_3?props.categoria_3:null}
            </ListItem.Subtitle>
          </TouchableOpacity>:
          <>
            <ListItem.Title style={styles.title}>
              {props.name}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtittle}>
              {props.categoria_3?props.categoria_3:null}
            </ListItem.Subtitle>
          </> 
          }
        </ListItem.Content>
      
        <Switch
            onValueChange={() => {
            // console.log(!props.onorof)
            props.onAtualizar_onorof(props.id,!props.onorof)
            }}
            value={props.onorof}
        />
      </ListItem>




      
      {/*modal para mudar o valor do estoque*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              onChangeText={setInputValue}
              value={inputValue}
              placeholder="Enter a number"
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => {
                props.onAtualizar_estoque(props.id,Number(inputValue)) 
                setModalVisible(false)}}>
              {/* props.onAtualizar_estoque(props.id,inputValue) */}
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#F4F7FC',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#3C4043',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    elevation:4,
    shadowColor:'#F4F7FC'
  },
  buttonText: {
    color: 'white',
    fontFamily:'Roboto-Regular'
  },
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold',
    color:'#F4F7FC'

  },
  subtittle:{
    fontSize: 12,
    fontFamily:'Roboto-Regular',
    color:'#F4F7FC'

  },
  estoque:{
    fontSize: 11,
    fontFamily:'Roboto-Regular',
    color:'#F4F7FC'
  }
});
