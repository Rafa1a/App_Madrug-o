import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {  signInWithEmailAndPassword, initializeAuth, getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAuth from 'firebase/auth';
import { setMessage } from './action/message';

//capturando o reactinativePersistence     
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
// initialize auth
      
const firebaseConfig = {
apiKey: "firebaseOptions.apiKey",
  authDomain: "firebaseOptions.authDomain", 
  databaseURL:"firebaseOptions.databaseURL",
  projectId: "firebaseOptions.projectId",
  storageBucket: "firebaseOptions.storageBucket",
  messagingSenderId:"firebaseOptions.messagingSenderId",
  appId: "firebaseOptions.appId",
  measurementId: "firebaseOptions.measurementId" 
};

//auth de conta do firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  // const vertexAI = getVertexAI(app);

//adicionando persistencia de Login
export const auth = initializeAuth(app, {
    persistence: reactNativePersistence(AsyncStorage),
  });


export { db };