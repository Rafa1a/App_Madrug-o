
import axios from 'axios'
import {GET_USER} from './actionTypes'
import { Dispatch } from 'redux'
import { user_on } from '../../interface/inter'

import { collection, addDoc,setDoc,doc,onSnapshot,getDocs,query, where, updateDoc} from "firebase/firestore"; 
import { db } from '../auth';
import { setMessage } from './message';
//onSnapshot para atualizar caso alguma informacao mude 
export const startUsers = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "user_on"));
      onSnapshot(q, (snapshot) => {
        const users: any[] = [];
          snapshot.forEach((doc) => {
              const rawUsers = doc.data();
              users.push({...rawUsers,
                id: doc.id}) 
            }); 
        // console.log(pedidos)
        dispatch(setUser(users))
        console.log("users onsnap")
      }); 
    }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor'
        }))
      }
   
  };
};
export const setUser =  (users:user_on[]) => {
    return { 
        type:GET_USER,
        payload:users
    }
    

}