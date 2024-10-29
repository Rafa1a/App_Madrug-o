import React, {useState} from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from "@react-navigation/stack";

import Pedidos from "../screens/Pedidos";
import Splash from "../screens/Splash";
import Updat from "../screens/Updates";
import Pedido_itens from "../screens/Pedido_itens";

const Stack = createNativeStackNavigator();



const FeedStack = (props:any) => {
  //splash q inicia o app e carrega os dados de auth/firebase
  return (
    <Stack.Navigator initialRouteName="Updates" >
      <Stack.Screen name="Updates" component={Updat} options={{ headerShown: false }} {...props} />
      
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}} {...props}/>

      <Stack.Screen name="Pedidos" component={Pedidos} options={{headerShown:false}} {...props}/>

      <Stack.Screen name="Pedido_itens" component={Pedido_itens}  {...props}/>
      
    </Stack.Navigator> 
  );
};

export default FeedStack