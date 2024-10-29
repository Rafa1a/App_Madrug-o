import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  SafeAreaView
} from 'react-native';
import { Button } from '@rneui/themed';
import { HeaderPedidosProps, pedido_inter } from '../../interface/inter';
import { connect } from 'react-redux';
import List_mesas from '../List_mesas';

// Header de Pedidos simples
const Header = ({ call, mesa, navigation, mesas,entrega }: HeaderPedidosProps) => {
  
 
  // console.log(mesas)
  const [visible, setVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const toggleModal = () => {
    setVisible(!visible);
  };

  const handleSelectTable = (table:any) => {
    setSelectedTable(table);
  }; 
  const array_mesas = mesas
  const numero_mesa = array_mesas.sort((a:any, b:any) =>  a.numero_mesa - b.numero_mesa)
  //confirma caso tenha seleciona oo numero da mesa ou nao
 
  const confirmarSelecao = () => {
    if (selectedTable === null) {
      // Mostrar um alerta pedindo para escolher uma mesa
      Alert.alert('Escolha uma mesa', 'Por favor, escolha uma mesa antes de confirmar.');
    } else {
      // Salvar a mesa selecionada
      navigation?.navigate('Adicionar', { numero_mesa: selectedTable, mesa:mesa });
      setSelectedTable(null)
      toggleModal();
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        {mesa ? 'Mesa' : null}
        {call ? 'Chamadas' : null}
        {entrega ? 'Entrega' : null}
      </Text>
      
      {mesa? 
      <Button
        size='md'
        radius='lg'
        type='outline'
        icon={{
          name: 'add',
          type: 'ionicons',
          size: 25,
          color: 'white',
        }}
        buttonStyle={{ borderColor: 'tomato', backgroundColor: '#2d2f31' }}
          onPress={toggleModal}
      />:null}

      
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={toggleModal}
      >
        <SafeAreaView style={styles.container2}>
          <View style={styles.modalView}>
          <Text style={styles.title}>Selecione uma mesa</Text>
          <View style={styles.test}>
          <FlatList
            data={numero_mesa}
            keyExtractor={(item:any )=> `${item.id}`}
            renderItem={({ item,index })=> <List_mesas {...item} handleSelectTable={handleSelectTable} selectedTable={selectedTable}/>}
          />
          </View>
           <View style={styles.divider} /> 
          <View style={styles.buttons}>
            <Button
              title="Cancelar"
              onPress={() => {
                setSelectedTable(null)
                toggleModal();
              }}
            />
            <Button
              title="Confirmar"
              onPress={() => {
                // Salvar a mesa selecionada
                confirmarSelecao()

              }}
            />
          </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    height: '15%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OpenSans-Bold',
    color: '#F4F7FC',
    fontSize: 50, // Defina o tamanho da fonte aqui
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex:1,
    maxHeight:'75%',
    width:'85%',
    backgroundColor: '#F4F7FC',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 10,
    shadowColor:"#F4F7FC"
  },
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold',
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  tableButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    margin:10
  },
  tableText: {
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  buttons: {
    width:'100%',
    flexDirection:'row',
    justifyContent: 'space-between',
  },
test:{
  flex:1,
  width:'50%'
}
});
const mapStateProps = ({ pedidos }: { pedidos: any }) => {
  return {
    mesas:pedidos.mesas
  };
};

export default connect(mapStateProps,null)(Header)
