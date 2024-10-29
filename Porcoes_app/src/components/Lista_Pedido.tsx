import React from 'react';
import { FlatList,  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Item_pedido from './Item_pedido';
import { SafeAreaView } from 'react-native-safe-area-context';

class Lista extends React.Component<any> {
  render() {
    const objeto_pedido = this.props.pedidos.find((item: any) => item.id === this.props.id);

    if (!objeto_pedido || !objeto_pedido.itens) {
      return null; // retorna null se os pedidos nao existir 
    }
    // Flat list de itens do Pedido de 1 PEDIDO
    return (
      <SafeAreaView style={styles.container}>
        
        <FlatList
        scrollEnabled={false}
          style={styles.flat}
          data={objeto_pedido.itens}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) =><Item_pedido {...item}/>}
          // ItemSeparatorComponent={() => <View style={styles.divider}/>}
        />
      
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    width:"100%"
    
  },divider: {
    borderBottomColor: '#2D2F31',
    borderBottomWidth: 5,
    width: '100%',
},
flat :{
  width:"100%"
}
});

const mapStateProps = ({ pedidos }: { pedidos: any }) => {
  return {
    pedidos: pedidos.pedidos,
  };
};
export default connect(mapStateProps)(Lista);
