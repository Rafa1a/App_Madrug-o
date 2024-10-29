import React, { useEffect } from 'react';
import {  StyleSheet,  View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Pedido from '../components/Flatlist_pedido_item'
import { pedido_inter, user_on } from '../interface/inter';
import { NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tab, Text, TabView } from '@rneui/themed';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface Props {
  pedidos: pedido_inter[];
  users:user_on[];
  navigation: NavigationProp<any,any>;
  user_info: user_on;
}
const Pedidos = ({ pedidos ,users,navigation,user_info }:Props) => {
  const [index, setIndex] = React.useState(0);

  const [pedidos_chapeiro, setPedidos_chapeiro] = React.useState<pedido_inter[]>([]);
  const [pedidos_bar, setPedidos_bar] = React.useState<pedido_inter[]>([]);
  const [pedidos_cozinha, setPedidos_cozinha] = React.useState<pedido_inter[]>([]);//porcoes
  useEffect(() => {
    const pedidos_chapeiro = pedidos.filter(pedido =>  pedido.status_chapeiro && pedido.itens.some(item => item.categoria === 'comidas' && (item.categoria_2 === 'lanches' || item.categoria_2 === 'hotdogs')));
    const pedidos_cozinha = pedidos.filter(pedido =>  pedido.status_porcoes && pedido.itens.some(item => item.categoria === 'comidas' && item.categoria_2 === 'porcoes'));
    const pedidos_bar = pedidos.filter(pedido =>  pedido.status_bar && pedido.itens.some(item => item.categoria === 'bar'));
    
    setPedidos_chapeiro(pedidos_chapeiro);
    setPedidos_bar(pedidos_bar);
    setPedidos_cozinha(pedidos_cozinha);

  }, [pedidos]);
  
  return (
    <SafeAreaView style={styles.container}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: '#E81000',
            height: 3,
          }}
          variant="primary"
        >
          {(user_info.status_mesa && pedidos_chapeiro.some(item => item.numero_mesa === user_info.mesa)) || pedidos_chapeiro.some(item => item.id_user === user_info.id)?
            <Tab.Item
              title="Chapeiro"
              titleStyle={{ fontSize: 12,color:'#3C4043' }}
              icon={<MaterialCommunityIcons name="hamburger" size={24} color="#3C4043" />}
              containerStyle={{backgroundColor: '#f8fafd'}}

            /> : null 
          }
          {(user_info.status_mesa && pedidos_cozinha.some(item => item.numero_mesa === user_info.mesa)) || pedidos_cozinha.some(item => item.id_user === user_info.id)?
            <Tab.Item
            title="Porções"
            titleStyle={{ fontSize: 12,color:'#3C4043' }}
            icon={<MaterialCommunityIcons name="food-turkey" size={24} color="#3C4043" />}
            containerStyle={{backgroundColor: '#f8fafd'}}

            /> : null 
          }
          {(user_info.status_mesa && pedidos_bar.some(item => item.numero_mesa === user_info.mesa)) || pedidos_bar.some(item => item.id_user === user_info.id)?
            <Tab.Item
            title="Bar"
            titleStyle={{ fontSize: 12,color:'#3C4043' }}
            icon={<Entypo name="drink" size={24} color="#3C4043" />}
            containerStyle={{backgroundColor: '#f8fafd'}}
          /> : null 
          }
          
        </Tab>
        {/* view tab */}
        <TabView value={index} onChange={setIndex} animationType="spring">
          {/* chapeiro */}
          {(user_info.status_mesa && pedidos_chapeiro.some(item => item.numero_mesa === user_info.mesa)) || pedidos_chapeiro.some(item => item.id_user === user_info.id)?
          <TabView.Item style={{width: '100%', marginTop:50 }}>
            <FlatList
            data={pedidos_chapeiro || []}
            //item ja retorna apenas os status_chapeiro de acordo com o back0end query
            keyExtractor={item => `${item.id}`}
            renderItem={({ item,index }) => {
              
                // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
                if (item.localidade === 'MESA') {
                
                  if(user_info.status_mesa && item.numero_mesa === user_info.mesa) {

                    return <Pedido  id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} chapeiro />;

                  }else return <Pedido  id={item.id} key={item.id} numero_mesa={item.numero_mesa} chapeiro />;
                  
                } else if (item.localidade === 'ONLINE') {
                  // se algum user tem um pedido id_user na lista de pedidos novos pega o nome e image
                  const currentUser = users.find(user => user.id === item.id_user);
                  const name = currentUser ? currentUser.name_on : 'Anonymo';
                  const image = currentUser ? currentUser.image_on : undefined;
      
                  if(user_info.id === item.id_user) {

                    return <Pedido id={item.id} key={item.id} styles name_on={name} image_on={image} chapeiro/>;

                  }else return item.id_user ?  
                  <Pedido id={item.id} key={item.id} name_on={name} image_on={image} chapeiro/> :  
                  <Pedido id={item.id} key={item.id} name_on='Anonymo' chapeiro />
                
                } else if (item.localidade === 'OUTROS') {
                  
                  return (
                    <Pedido 
                      id={item.id?item.id:''} key={item.id} 
                      name_on={item.name_outros?item.name_outros:'Anonymo'}
                      chapeiro
                      {...item}
                    />);
                } 
              return null;
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </TabView.Item> :null
          }
          {/* chapeiro */}
          
          {/* procoes */}
          {(user_info.status_mesa && pedidos_cozinha.some(item => item.numero_mesa === user_info.mesa)) || pedidos_cozinha.some(item => item.id_user === user_info.id)?
          <TabView.Item style={{  width: '100%', marginTop:50}}>
            <FlatList
            data={pedidos_cozinha || []}
            //item ja retorna apenas os status_chapeiro de acordo com o back0end query
            keyExtractor={item => `${item.id}`}
            renderItem={({ item,index }) => {
              
                // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
                if (item.localidade === 'MESA') {
                
                  if(user_info.status_mesa && item.numero_mesa === user_info.mesa) {

                    return <Pedido  id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} porcoes />;

                  }else return <Pedido  id={item.id} key={item.id} numero_mesa={item.numero_mesa} porcoes />;
                  
                } else if (item.localidade === 'ONLINE') {
                  // se algum user tem um pedido id_user na lista de pedidos novos pega o nome e image
                  const currentUser = users.find(user => user.id === item.id_user);
                  const name = currentUser ? currentUser.name_on : 'Anonymo';
                  const image = currentUser ? currentUser.image_on : undefined;
      
                  if(user_info.id === item.id_user) {

                    return <Pedido id={item.id} key={item.id} styles name_on={name} image_on={image} porcoes/>;

                  }else return item.id_user ?  
                  <Pedido id={item.id} key={item.id} name_on={name} image_on={image} porcoes/> :  
                  <Pedido id={item.id} key={item.id} name_on='Anonymo' porcoes />
                
                } else if (item.localidade === 'OUTROS') {
      
                  return (
                  <Pedido 
                    id={item.id?item.id:''} key={item.id} 
                    name_on={item.name_outros?item.name_outros:'Anonymo'}
                    porcoes
                    {...item}
                  />);
                } 
              return null;
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </TabView.Item> : null
          }
          {/* procoes */}
          
          {/* bar */}
          {(user_info.status_mesa && pedidos_bar.some(item => item.numero_mesa === user_info.mesa)) || pedidos_bar.some(item => item.id_user === user_info.id)?
          <TabView.Item style={{ width: '100%', marginTop:50 }}>
            <FlatList
            data={pedidos_bar || []}
            //item ja retorna apenas os status_chapeiro de acordo com o back0end query
            keyExtractor={item => `${item.id}`}
            renderItem={({ item,index }) => {
              
                // condicoes para realizar a pesquisa e filtro sobre os resultados obtidos
                if (item.localidade === 'MESA') {
                
                  if(user_info.status_mesa && item.numero_mesa === user_info.mesa) {

                    return <Pedido  id={item.id} key={item.id} styles numero_mesa={item.numero_mesa} drinks />;

                  }else return <Pedido  id={item.id} key={item.id} numero_mesa={item.numero_mesa} drinks />;
                  
                } else if (item.localidade === 'ONLINE') {
                  // se algum user tem um pedido id_user na lista de pedidos novos pega o nome e image
                  const currentUser = users.find(user => user.id === item.id_user);
                  const name = currentUser ? currentUser.name_on : 'Anonymo';
                  const image = currentUser ? currentUser.image_on : undefined;
      
                  if(user_info.id === item.id_user) {

                    return <Pedido id={item.id} key={item.id} styles name_on={name} image_on={image} drinks/>;

                  }else return item.id_user ?  
                  <Pedido id={item.id} key={item.id} name_on={name} image_on={image} drinks/> :  
                  <Pedido id={item.id} key={item.id} name_on='Anonymo' drinks />
                
                } else if (item.localidade === 'OUTROS') {
      
                  return (
                  <Pedido 
                    id={item.id?item.id:''} key={item.id} 
                    name_on={item.name_outros?item.name_outros:'Anonymo'}
                    drinks
                    {...item}
                  />);
                } 
              return null;
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </TabView.Item> : null
          } 
          {/* bar */}

        </TabView>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#ffffff',
    width:"100%"
  },
  separator: {
    height: 5,
    width: '100%',
    backgroundColor: 'transparent',
  },
  
});

const mapStateProps = ({ pedidos, user }: { pedidos: any; user: any }) => {
  return {
    pedidos: pedidos.pedidos,
    user_info: user.user_info,
    users:user.users
  };
};

export default connect(mapStateProps, null)(Pedidos);
