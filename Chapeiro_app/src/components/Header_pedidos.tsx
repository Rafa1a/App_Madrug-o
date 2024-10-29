import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Header de Pedidos simples
const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Chapeiro</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OpenSans-Bold',
    color: '#F4F7FC',
    fontSize: 50, // Defina o tamanho da fonte aqui
  },
});

export default Header;
