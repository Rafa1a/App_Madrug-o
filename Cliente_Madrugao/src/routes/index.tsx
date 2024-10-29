import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

import Stacks from './Navegation';

export default (props: any) => {
  const routeNameRef = useRef();
  const navigationRef = useRef<any>();

  const linking = {
    prefixes: ['com.madrugao.madrugao://'],
    config: {
      screens: {
        Principal: { 
          path:'Principal/:id',
          parse: {
            id: (id:string)=>id,
          },
        },
        Carrinho: { 
          path:'Carrinho/:id',
          parse: {
            id: (id:string)=>id,
          },
        },
        Login: { 
          path:'Login/:numero_mesa',
          parse: {
            numero_mesa: (numero_mesa:string)=>Number(numero_mesa),
          },
        },
      },
    },
  };
  useEffect(() => { 
    console.log('routeNameRef',routeNameRef)
    console.log('navigationRef',navigationRef)
    console.log('linking',linking)
  }, [routeNameRef, navigationRef, linking]); 
  return ( 
    <SafeAreaView style={{ flex:1, }}>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current; 
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }

          routeNameRef.current = currentRouteName;
        }}
      >
        <Stacks {...props} />
      </NavigationContainer>
    </SafeAreaView>
  );
}