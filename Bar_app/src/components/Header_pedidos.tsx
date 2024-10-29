import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';
import { Avatar } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';


// header de Pedidos simples
export default class Header extends React.Component <any>{
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Bar</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:"15%",
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
