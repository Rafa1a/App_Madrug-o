
import React from 'react';

import {NavigationContainer }from  '@react-navigation/native'

import Stacks from './Navegation';
import { SafeAreaView } from 'react-native-safe-area-context';


export default (props: any) => {
   
  return (
// navegacao stack 
    <SafeAreaView style={{ flex:1 }}>
      <NavigationContainer>
        
         <Stacks {...props} />
    
      </NavigationContainer>
    </SafeAreaView>
  );
}




