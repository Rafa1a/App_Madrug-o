import React, { useEffect } from 'react';
import {  StyleSheet, Text, View, FlatList, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { startPedidosListener} from '../store/action/pedidos';
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
const Pedidos = ({ pedidos ,users,navigation }:Props) => {
  const [pedidos_array, setPedidos_array] = React.useState(pedidos);
  useEffect(() => {
    const pedidos_bar = pedidos.filter(pedido => pedido.status_bar === true);
    const pedidos_bebidas = pedidos.filter(pedido => pedido.itens.some(item => item.categoria === 'bebidas'));
    //tratemento de bebidas caso ja exista no array_bebidas do pedido
    const pedido_bebidas_filter = pedidos_bebidas.filter(pedido => {
      return pedido.itens.some(item => (pedido.array_bebidas?.includes(item.id) === false || pedido.array_bebidas===undefined) && item.categoria === 'bebidas');
    });
    // console.log('pedido_bebidas_filter',pedido_bebidas_filter)
    //juntando o array de pedidos_bar com o array de pedidos_bebidas
    const array_union = Array.from(new Set([...pedidos_bar, ...pedido_bebidas_filter].flat().filter(Boolean)));
    array_union.sort((a,b) => a.ordem - b.ordem);
    setPedidos_array(array_union);

    console.log('atualixou')
  }, [pedidos]);
  
  return (
    <SafeAreaView style={styles.container}>
      
      <Header/>
      
      <FlatList
        showsVerticalScrollIndicator={false}
        data={pedidos_array}
        //item ja retorna apenas os status_chapeiro de acordo com o back0end query
        keyExtractor={(item,index) => `${item.id}`}
        renderItem={({ item,index }) => {
           
            // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
            if (item.localidade === 'MESA') {
            
              if(index === 0) {

                return <Pedido  
                array_bebidas={item.array_bebidas}
                itens={item.itens} id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} navigation={navigation} {...item}/>;

              }else return <Pedido  
              array_bebidas={item.array_bebidas}
              itens={item.itens} id={item.id} key={item.id} numero_mesa={item.numero_mesa} navigation={navigation} {...item}/>;
              
            } else if (item.localidade === 'ONLINE') {
              // se algum user tem um pedido id_user na lista de pedidos novos pega o nome e image
              const currentUser = users.find(user => user.id === item.id_user);
              const name = currentUser ? currentUser.name_on : 'Anonymo';
              const image = currentUser ? currentUser.image_on : undefined;
  
              if(index === 0) {

                return <Pedido 
                array_bebidas={item.array_bebidas}
                itens={item.itens} id={item.id} key={item.id} styles name_on={name} image_on={image} navigation={navigation} {...item}/>;

              }else return item.id_user ?  
              <Pedido 
              array_bebidas={item.array_bebidas}
              itens={item.itens} id={item.id} key={item.id} name_on={name} image_on={image} navigation={navigation} {...item}/> :  
              <Pedido 
              array_bebidas={item.array_bebidas}
              itens={item.itens} id={item.id} key={item.id} name_on='Anonymo' navigation={navigation} {...item}/>
             
            } else if (item.localidade === 'OUTROS') {
  
              if(index === 0) {

                return (
                  <Pedido 
                    
                  array_bebidas={item.array_bebidas}
                  itens={item.itens} 
                    id={item.id?item.id:''} 
                    key={item.id} 
                    styles 
                    name_on={item.name_outros?item.name_outros:'Anonymo'}
                    navigation={navigation} 
                    {...item}
                  />);

              }else return (
              <Pedido 
                
              array_bebidas={item.array_bebidas}
              itens={item.itens} 
                id={item.id?item.id:''} key={item.id} 
                name_on={item.name_outros?item.name_outros:'Anonymo'}
                rua = {item.rua}
                numero={item.numero}
                pegar_local={item.pegar_local}
                navigation={navigation}
                {...item}
              />);
            } 
          return null;
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


const mapDispatchProps = (dispatch: any) => {
  return {
    onFetchPedidos: () => dispatch(startPedidosListener()),
    
  };
};

export default connect(mapStateProps, mapDispatchProps)(Pedidos);
