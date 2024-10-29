
import {GET_USER, LOGIN_USER} from './actionTypes'
import { Dispatch } from 'redux'
import { user_fun} from '../../interface/inter'

import { collection, addDoc,setDoc,doc,onSnapshot,getDocs,query, where, updateDoc,arrayUnion} from "firebase/firestore"; 
import { db } from '../auth';
import { setMessage } from './message';




//onSnapshot para atualizar caso alguma informacao mude 

export const startUser_func= () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "user_func"));
      onSnapshot(q, (snapshot) => {
        const users: any[] = [];
          snapshot.forEach((doc) => {
              const rawUsers = doc.data();
              users.push({...rawUsers,
                id: doc.id}) 
            }); 
        // console.log(users)
        dispatch(setUser(users));
        console.log("user_func onsnap")
      }); 
    }catch (error) {
        // console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor do User: funcionarios'
          }))
      }
  }; 
};


// retornar users e Atualizar users redux [users]

export const fetchuser_get = () =>{
    return async(dispatch:any)=>{
        try {
            const usersCol = collection(db, 'user_func');
            const querySnapshot = await getDocs(usersCol);
            const users:any = querySnapshot.docs.map((doc) => {
              const rawUsers = doc.data();
              return {
                ...rawUsers,
                id: doc.id
              };
            }); 
            
            // console.log("users")
            dispatch(setUser(users))
            
          } catch (e) {
            console.log(e)
            dispatch(setMessage({
              title: 'Error',
              text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
            }))
          }
    }
}

export const add_Func = (user:user_fun) => {
  return async(dispatch:any)=>{
    try {
        
        const usersCol = collection(db, 'user_func');
        await addDoc(usersCol,user);
        
        // console.log("users")
      } catch (e) {
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
        }))
      }
  }
}

// Atualizar user call :
export const fetch_user_call = (id:string,number:number) => {
  return async (dispatch:any)=>{
    // console.log(number)
    try{
        const pedidoRef = doc(db, 'user_func', id);
        await updateDoc(pedidoRef, {
          call: number
      });
    }catch (e) {
      console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar user call'
      }))
    }
   
  }
} 
// Atualizar user entregando variavel momentania :
export const fetch_user_entregando = (id:string,array:string[]) => {
  return async (dispatch:any)=>{
    // console.log(number)
    try{
        const pedidoRef = doc(db, 'user_func', id);
        await updateDoc(pedidoRef, {
          entregando: array
      });
    }catch (e) {
      console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar user entregando'
      }))
    }
   
  }
} 
// Atualizar user chapeiro :
export const fetch_user_chapeiro = (id:string,ids_pedidos:string[]) => {
  return async (dispatch:any)=>{
    // console.log(number)
    try{
      for(const ids of ids_pedidos){
        const pedidoRef = doc(db, 'user_func', id);
        await updateDoc(pedidoRef, {
          chapeiro : arrayUnion(ids)
      });
      }
    }catch (e) {
      console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar user chapeiro'
      }))
    }
   
  }
} 
// Atualizar user bar :
export const fetch_user_bar = (id:string,ids_pedidos:string[]) => {
  return async (dispatch:any)=>{
    // console.log(number)
    try{
      for(const ids of ids_pedidos){
        const pedidoRef = doc(db, 'user_func', id);
        await updateDoc(pedidoRef, {
          bar : arrayUnion(ids)
      });
      }
    }catch (e) {
      console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar user bar'
      }))
    }
   
  }
}
// Atualizar user porcoes :
export const fetch_user_porcoes = (id:string,ids_pedidos:string[]) => {
  return async (dispatch:any)=>{
    // console.log(number)
    try{
      for(const ids of ids_pedidos){
        const pedidoRef = doc(db, 'user_func', id);
        await updateDoc(pedidoRef, {
          porcoes : arrayUnion(ids)
      });
      }
    }catch (e) {
      console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar user porcoes'
      }))
    }
   
  }
}
// Atualizar user bebidas :
export const fetch_user_bebidas = (id:string,ids_pedidos:string[]) => {
  return async (dispatch:any)=>{
    // console.log(number)
    try{
      for(const ids of ids_pedidos){
        const pedidoRef = doc(db, 'user_func', id);
        await updateDoc(pedidoRef, {
          bebidas : arrayUnion(ids)
      });
      }
    }catch (e) {
      console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar user bebidas'
      }))
    }
   
  }
}
//users_on deslogar users quando finalizar pedido
//funcao para deslogar todos os users q estiver na mesa 
export const fetchAtualizarUser_status_mesa = (numero_mesa:number) => {
  return async (dispatch: any) => {
    try {
      const q = collection(db, "user_on");
      const querySnapshot = await getDocs(q);
      const users: any[] = [];
      querySnapshot.forEach((doc) => {
          const rawUsers = doc.data();
          users.push({...rawUsers,
            id: doc.id}) 
        });

      users.forEach(async (user) => {
        if(user.status_mesa){
          if(user.mesa === numero_mesa){
            await updateDoc(doc(db, 'user_on', user.id), {
              status_mesa: false,
              mesa: 0
            }); 
          }
        }
      });
    } catch (error) {
      // Adicione tratamento de erro conforme necessário
      dispatch(
        setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualziar user online',
        })
      );
    }
  }
}
//atualizar token notification
export const fetchAtualizarUser_token = (id:string,token:string) => {
  return async (dispatch: any) => {
    try {
      await updateDoc(doc(db, 'user_func', id), {
        token: token
      }); 
    } catch (error) {
      // Adicione tratamento de erro conforme necessário
      dispatch(
        setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualziar user token',
        })
      );
    }
  }
}
export const setUser =  (users:user_fun[]) => {
    return { 
        type:GET_USER,
        payload:users
    }
    

}
export const setUser_login =  (user:user_fun) => {
    return { 
        type:LOGIN_USER,
        payload:user
    }
    
}