import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, initializeAuth } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
// foracar a chamada do getReactNativePersistence Pois não encontrava
import * as firebaseAuth from 'firebase/auth';
import { setMessage } from './action/message';
//capturando o reactinativePersistence     
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
        
            // initialize auth
      
 
    
  ////////////// FIREBASEOPTIONS is secret/////////////////
//exemple:
const firebaseOptions = {
  apiKey: "firebaseOptions.apiKey",
  authDomain: "firebaseOptions.authDomain", 
  databaseURL:"firebaseOptions.databaseURL",
  projectId: "firebaseOptions.projectId",
  storageBucket: "firebaseOptions.storageBucket",
  messagingSenderId:"firebaseOptions.messagingSenderId",
  appId: "firebaseOptions.appId",
  measurementId: "" 
};


//auth de conta do firebase
  const app = initializeApp(firebaseOptions);
  const db = getFirestore(app);
  // const auth = getAuth(app);


//adicionando persistencia de Login
 const auth2 = initializeAuth(app, {
    persistence: reactNativePersistence(AsyncStorage),
  });




  const email = "email.secret";
  const password = 'senha.secret';
// funcao de autenticacao
export const auth_user = () => 
  
  signInWithEmailAndPassword(auth2, email, password)
    .then((userCredential:any) => {
      // Signed in 
      // const user = userCredential._tokenResponse.idToken;
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Authentication error: ', errorCode, errorMessage);
      setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao autenticar'
      })
    });

export { db };
