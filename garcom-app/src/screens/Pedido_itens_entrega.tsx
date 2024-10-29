import React, { useEffect } from 'react';
import {
    FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { pedido_itens_comp } from '../interface/inter';
import { SafeAreaView } from 'react-native-safe-area-context';
import Item_pedido from '../components/pedidos/Item_pedido';


const pedidos_itens_entrega = (props:pedido_itens_comp) =>{
  const { numeros_mesas,chapeiro_bar_porcoes_itens } = props.route.params;
  const [mesas, setMesas] = React.useState([]);

  useEffect(() => {
    const mesas = numeros_mesas.map(numero_mesa => {
      const itens = chapeiro_bar_porcoes_itens
        .filter(item => item.numero_mesa === numero_mesa)
        .flatMap(itens => itens.itens);

      return { numero_mesa, itens };
    });

    setMesas(mesas);
    // console.log(mesas)
  }, [])

  return(
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <FlatList
          scrollEnabled={false}
          style={{width:"100%"}}
          data={mesas}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item: mesa }) => (
            <>
              <Text style={{color:'#ff0000',fontSize:25}}>Mesa {mesa.numero_mesa} :</Text>
              <FlatList
                data={mesa.itens}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => <Item_pedido {...item} />}
              />
            </>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#252A32",
    width: '100%',
  },
  scroll: {
    flex:1,
    width: '100%',
  },
  button: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'tomato',
    padding: 10,
    height:160,
    width:160,
    borderRadius: 100,
    margin: 5,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#DE6F00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
        color: '#F4F7FC',
        fontSize: 30,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: '#F4F7FC',
    borderBottomWidth: 0.5,
    width: '100%',
    marginBottom:10
},
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end',
    width: '90%',
    marginBottom: 10,
  },
  totalText: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 30,
  },
  totalValue: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 50,
  },
});
const mapStateProps = ({ pedidos }: { pedidos: any}) => {
    return {
      total: pedidos.total,
      pedidos: pedidos.pedidos,
      pedidos_mesa:pedidos.pedidos_mesa,
  
    };
  };

export default connect(mapStateProps)(pedidos_itens_entrega)