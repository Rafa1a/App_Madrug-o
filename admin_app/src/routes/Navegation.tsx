import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons, Fontisto, Zocial,FontAwesome } from "@expo/vector-icons"; // Importe os ícones específicos que você precisa
import Splash from "../screens/Splash";
import Pedido_itens from "../screens/Pedido_itens"
import Pedidos_Mesa from "../screens/Pedidos_Mesa";
import Pedidos_Online from "../screens/Pedidos_Online";
import Pedidos_Outros from "../screens/Pedidos_Outros";
import Estoque from '../screens/Estoque'
import Adicionar from "../screens/Adicionar";
import Pedido_itens_adicionar from "../screens/Pedido_itens_adicionar";
import { setAdicionar_pedido } from "../store/action/adicionar_pedido";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Updat from "../screens/Updates";
import Cardapio_add from "../screens/cardapio_add_retirar/Cardapio_add";
import Cardapio_retirar from "../screens/cardapio_add_retirar/Cardapio_retirar";
import Versao from "../screens/cardapio_add_retirar/versao";
import Versao_add from "../screens/cardapio_add_retirar/Versao_add";
import Controle_caixa from "../screens/Controle_caixa";
import Caixas_anteriores from "../screens/Caixas_anteriores";
import Caixa from "../screens/Caixa";
import garcons from "../screens/garcons";
//////////////////////////////////////////////////////////////////////
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator()

const FeedStack = (props: any) => {
  const navigation = useNavigation();

  const reset_pedido_novo = () => {
    props.onAdicionar_pedido([])
    navigation.goBack();
  }

  //splash q inicia o app e carrega os dados de auth/firebase
  return (
    <Stack.Navigator initialRouteName="Updates" >
      <Stack.Screen name="Updates" component={Updat} options={{ headerShown: false }} {...props} />

      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} {...props} />

      <Stack.Screen name="Pedidos" component={MenuTab} options={{ headerShown: false, }} {...props} />

      <Stack.Screen name="Pedido" component={Pedido_itens} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A" }, }} {...props} />

      <Stack.Screen name="Adicionar" component={Adicionar} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A" }, headerLeft: (props) => (
        <FontAwesome
          {...props}
          size={25}
          name='arrow-left'
          color='#F4F7FC'
          style={{ margin: 10 }}
          onPress={() => reset_pedido_novo()}
        />
      ), }} {...props} />

      <Stack.Screen name="Pedido_Adicionar" component={Pedido_itens_adicionar} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />
      <Stack.Screen name="Cardapio_add" component={Cardapio_add} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />
      <Stack.Screen name="Cardapio_retirar" component={Cardapio_retirar} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />

      <Stack.Screen name="Versao" component={Versao} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />

      <Stack.Screen name="Versao_add" component={Versao_add} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />
      
      <Stack.Screen name="Controle_caixa" component={Controle_caixa} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />
      <Stack.Screen name="Caixas_anteriores" component={Caixas_anteriores} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />
      <Stack.Screen name="Caixa" component={Caixa} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />
      
      <Stack.Screen name="garcons" component={garcons} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A", }, }} {...props} />

    </Stack.Navigator>
  );
};

const MenuTab = () => {

  return (
    <Tab.Navigator
      initialRouteName="Pedidos_Mesa"
      activeColor="#e91e63"
      shifting
      barStyle={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Pedidos_Mesa"
        component={Pedidos_Mesa}
        options={{
          tabBarLabel: 'Mesa',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="table-furniture" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Pedidos_Online"
        component={Pedidos_Online}
        options={{
          tabBarLabel: 'Online',
          tabBarIcon: ({ color }) => (
            <Fontisto name="world" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Pedidos_Outros"
        component={Pedidos_Outros}
        options={{
          tabBarLabel: 'Outros',
          tabBarIcon: ({ color }) => (
            <Fontisto name="user-secret" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Estoque"
        component={Estoque}
        options={{
          tabBarLabel: 'Estoque',
          tabBarIcon: ({ color }) => (
            <Zocial name="stackoverflow" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const mapDispatchProps = (dispatch: any) => {
  return {
    onAdicionar_pedido: (pedido: []) => dispatch(setAdicionar_pedido(pedido)),
  }
}

export default connect(null, mapDispatchProps)(FeedStack)
