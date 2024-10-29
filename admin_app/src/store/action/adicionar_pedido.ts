import { SET_ADICIONAR_PEDIDO, SET_ADICIONAR_PEDIDO_ITENS, SET_ADICIONAR_PEDIDO_MESA, SET_MESAS } from './actionTypes';
import { db } from '../auth';

import { addDoc, collection, getDocs } from 'firebase/firestore';
import { setMessage } from './message';



//additemtopedidos para adicionar um novo pedido no banco de dados
export const addItemToPedidos = (novoItem:any) => {
    return async (dispatch:any) => {
        // console.log('Conteúdo de novoItem:', novoItem);
      try {
        // Adiciona um novo item à coleção "pedidos" no Firestore
        const docRef = await addDoc(collection(db, 'pedidos'), novoItem);
  
        // console.log('Item adicionado com sucesso ao pedido:', docRef.id);
  
      } catch (error) {
        console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro ao contatar o servidor para Adicionar o Pedido'
          }))
      }
    };
  };

export const fetchMesas =  () =>{
    return async (dispatch:any)=>{
      try {
        const q = collection(db, "mesas");
        const querySnapshot = await getDocs(q);
        const mesas = querySnapshot.docs.map((doc) => {
          const rawMesas = doc.data();
          return {
            ...rawMesas,
            id: doc.id
          };
        }); 
        
         dispatch(setMesas(mesas))
        
      } catch (e) {
        console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor das Mesas'
        }))
      }
    }
  }
export const setMesas = (mesas:any) => {
    return {
        type: SET_MESAS,
        payload: mesas
    }
}
export const setAdicionar_pedido = (pedido:any) => {
    return {
        type: SET_ADICIONAR_PEDIDO_ITENS,
        payload: pedido
    }
}
export const setAdicionar_pedido_state = (pedido:any) => {
  return {
      type: SET_ADICIONAR_PEDIDO,
      payload: pedido
  }
}
export const setAdicionar_pedido_state_mesa = (pedido:any) => {
  return {
      type: SET_ADICIONAR_PEDIDO_MESA,
      payload: pedido
  }
}