import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import { MaterialCommunityIcons, Fontisto, Zocial,FontAwesome } from "@expo/vector-icons"; // Importe os ícones específicos que você precisa
import Splash from "../screens/Splash";
import Pedido_itens from "../screens/Pedido_itens"
import Pedidos_Mesa from "../screens/Pedidos_Mesa";
import Adicionar from "../screens/Adicionar";
import Pedido_itens_adicionar from "../screens/Pedido_itens_adicionar";
import { setAdicionar_pedido } from "../store/action/adicionar_pedido";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Login from "../screens/Login";
import Mesa_call from "../screens/Mesa_call";
import Entrega_pedido from "../screens/Entrega_pedido";
import { Ionicons } from '@expo/vector-icons';
import Updat from "../screens/Updates";
import Pedido_itens_entrega from "../screens/Pedido_itens_entrega";
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
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} {...props} />

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

      <Stack.Screen name="Pedido_itens_entrega" component={Pedido_itens_entrega} options={{ headerTintColor: '#F4F7FC', headerStyle: { backgroundColor: "#28292A" }, }} {...props} />

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
        name="Mesa_Call"
        component={Mesa_call}
        options={{
          tabBarLabel: 'Call',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="hand-wave" size={24} color={color} />
          ),
        }} 
      /> 

       <Tab.Screen
        name="Entrega_pedido"
        component={Entrega_pedido}
        options={{
          tabBarLabel: 'Entrega',
          tabBarIcon: ({ color }) => (
            <Ionicons name="file-tray-stacked" size={24} color={color} />
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
