import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Updates from 'expo-updates';
import { SafeAreaView } from 'react-native-safe-area-context';

// Restante do seu código...

const CheckForUpdatesScreen = (props: any) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [key, setKey] = useState(0); // Adicione um estado para a chave
   const navigateToLogin = () => props.navigation?.replace('Splash');

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdateAvailable(true);
        } else {
          setTimeout(() => {
            navigateToLogin();
          }, 1000);
        }
      } catch (error) {
        navigateToLogin();
        console.error('Error ao verificar Updates:', error);
      }
    };

    checkForUpdates();
  }, [key]); 

  useEffect(() => {
    const handleUpdateAvailable = () => {
      // Aumenta a chave para recriar o componente
      setKey((prevKey) => prevKey + 1);
    };

    setTimeout(() => {
      handleUpdateAvailable();
    }, 3000);
  },[])
  

  const handleUpdatePress = async () => {
    try {
      await Updates.fetchUpdateAsync();
      Updates.reloadAsync();

    } catch (error) {
      console.error('Error fetching update:', error);
      Alert.alert('Error', 'Ao tentar atualizar, tente mais tarde.');
    }
  };

  
  return (
    <SafeAreaView style={styles.container}>
      {isUpdateAvailable ? (
        <View>
          <Text style={styles.text}>Nova Atualização disponível!</Text>
          <Button title="Atualizar" onPress={handleUpdatePress} />
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2d2f31' }}>
          <ActivityIndicator size="large" />
        </View>
      ) } 
      
    </SafeAreaView>
  );
};

// Restante do seu código...


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d2f31',
  },
  text: {
    color: '#F4F7FC',
    fontFamily: 'OpenSans-Regular',
    fontSize: 40,
    marginBottom: 15,
  },
});

export default CheckForUpdatesScreen;
