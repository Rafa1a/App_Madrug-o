import { registerRootComponent } from 'expo';

import App from './App';
import React from 'react';
import { Provider } from 'react-redux';
import storeConfig from './src/store/storeConfig';

// Configuração global do Axios
// import axios from 'axios';

// axios.defaults.baseURL = 'https://madrugaotulio-default-rtdb.firebaseio.com'

const store = storeConfig()
const Redux = () => (
    <Provider store={store}>
        <App />
    </Provider>
)
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Redux);
