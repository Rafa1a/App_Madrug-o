import React, { useEffect } from 'react';
import {  StyleSheet, Text, View, FlatList, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Pedido from '../components/Pedido'
import { pedido_inter, user_on } from '../interface/inter';
import Header from '../components/Header_pedidos';
import { NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  pedidos: pedido_inter[];
  name_on?: string;
  image_on?:string;
  status_chapeiro?:boolean;
  users:user_on[];
  navigation: NavigationProp<any,any>;
}
const Pedidos = ({ pedidos,users,navigation }:Props) => {
  
  return (
    <SafeAreaView style={styles.container}>
      
      <Header online/>
      
      <FlatList
        
        data={pedidos.filter(item => item.localidade==='ONLINE')}
        //item ja retorna apenas os status_chapeiro de acordo com o back0end query
        keyExtractor={item => `${item.id}`}
        renderItem={({ item,index }) => {
           
             
              // se algum user tem um pedido id_user na lista de pedidos novos pega o nome e image
              const currentUser = users.find(user => user.id === item.id_user);
              const name = currentUser ? currentUser.name_on : 'Anonymo';
              const image = currentUser ? currentUser.image_on : undefined;
  
              if(item.status===false) {

                return (
                <Pedido 
                  id={item.id?item.id:''} key={item.id} styles name_on={name} image_on={image} navigation={navigation} {...item}
                />)

              }else return (
                item.id_user ?  
                <Pedido 
                  id={item.id?item.id:''} key={item.id} name_on={name} image_on={image} navigation={navigation}  {...item}
                /> 
                :  
                <Pedido 
                  id={item.id?item.id:''} key={item.id} name_on='Anonymo' navigation={navigation} {...item}
                />)
             
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#202124',
    width:"100%"
  },
  separator: {
    height: 30,
    width: '100%',
    backgroundColor: 'transparent',
  },
  
});

const mapStateProps = ({ pedidos, user }: { pedidos: any; user: any }) => {
  return {
    pedidos: pedidos.pedidos,
    users:user.users
  };
};

export default connect(mapStateProps, null)(Pedidos);
