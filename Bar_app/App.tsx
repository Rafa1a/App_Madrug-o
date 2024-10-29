import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
// import Test from './src/Tessst';
import Main from './src/Main';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Lato-Thin': require('./assets/fonts/Lato-Thin.ttf'),
    'Lato-Light': require('./assets/fonts/Lato-Light.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'RobotoMono-Bold': require('./assets/fonts/RobotoMono-Bold.ttf'),
    'RobotoMono-Light': require('./assets/fonts/RobotoMono-Light.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView onLayout={onLayoutRootView} style={{flex:1}}>
      <Main/>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
} 

