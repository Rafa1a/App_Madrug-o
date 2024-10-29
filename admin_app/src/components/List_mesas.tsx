
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default (props: any) => {
    // console.log(props)
    const color_mesa = props.selectedTable===props.numero_mesa?true:false
  return (
    <SafeAreaView style={styles.container2}>
         
         <TouchableOpacity
              style={color_mesa?styles.tableButton_2:styles.tableButton}
              onPress={() => props.handleSelectTable(props.numero_mesa)}
            >
              <Text style={color_mesa?styles.tableText_2:styles.tableText}>Mesa {props.numero_mesa}</Text>
            </TouchableOpacity>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
   container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  tableButton: {
    width:'100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor:'#3C4043'

  },
  tableText: {
    fontSize: 15,
    color:'#F4F7FC',
    fontFamily: 'Roboto-Regular',
  },
  tableButton_2: {
    width:'100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor:'#F4F7FC'

  },
  tableText_2: {
    fontSize: 15,
    color:'#3C4043',
    fontFamily: 'Roboto-Regular',
  },
});

