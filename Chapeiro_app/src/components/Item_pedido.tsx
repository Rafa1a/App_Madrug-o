import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

const Item_pedido = (props) => {
    // para lanches ou hotdogs
    if(props.categoria === "bar" || props.categoria === "bebidas" || props.categoria_2 === "porcoes" ) { return }
    //para bar
    // if(props.categoria === "comidas" || props.categoria === "bebidas")  {return } 
    //porcoes
    // if(props.categoria === "bar" || props.categoria === "bebidas" || props.categoria_2 === "lanches" || props.categoria_2 === "hotdogs" ) { 
    //     return 
    // }  
  const { adicionar_p, retirar_p, name_p, quantidade } = props;
  const [possuiAdicionar, setPossuiAdicionar] = useState(null);
  const [possuiRetirar, setPossuiRetirar] = useState(null);

  useEffect(() => {
    const adicionalArray = adicionar_p ? adicionar_p.join(', ') : null;
    const retirarArray = retirar_p ? retirar_p.join(', ') : null;

    const adicionarComponente = adicionalArray ? (
      <View style={styles.section}>
        <Text style={styles.text1}>Adicionar: {adicionalArray}</Text>
      </View>
    ) : null;

    const retirarComponente = retirarArray ? (
      <View style={styles.section}>
        <Text style={styles.text1}>Retirar: {retirarArray}</Text>
      </View>
    ) : null;

    setPossuiAdicionar(adicionarComponente);
    setPossuiRetirar(retirarComponente);
  }, [adicionar_p, retirar_p]);

  return (
    <View style={styles.container}>
      <View style={styles.container_2}>
        <View style={styles.container_3}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{name_p}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.container_4}>
          <View style={styles.content}>
            {possuiAdicionar}
            {possuiRetirar}
          </View>
          <View style={styles.container_5}>
            <Text style={styles.text2}>x{quantidade}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: StatusBar.currentHeight || 0,
    width: '100%',
  },
  container_2: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: StatusBar.currentHeight || 0,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  container_3: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '70%',
  },
  container_4: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
  },
  container_5: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FE',
    width: '60%',
    borderRadius: 30,
    elevation: 20,
    shadowColor: '#202124',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
    margin: 10,
  },
  text: {
    fontFamily: 'Roboto-Regular',
    color: '#202124',
    fontSize: 30,
    margin: 10,
  },
  text1: {
    fontFamily: 'OpenSans-Regular',
    color: '#2D2F31',
    fontSize: 14,
  },
  text2: {
    fontFamily: 'OpenSans-Regular',
    color: '#3C4043',
    fontSize: 18,
  },
  divider: {
    borderBottomColor: '#2D2F31',
    borderBottomWidth: 0.5,
    width: '100%',
    marginBottom: 10,
  },
});

export default connect()(Item_pedido);
