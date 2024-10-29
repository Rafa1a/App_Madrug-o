import {  SET_ADICIONAR_PEDIDO_ITENS, SET_CARRINHO_AVISO,  } from './actionTypes';
import { db } from '../auth';

import { addDoc, collection,} from 'firebase/firestore';
import { setMessage } from './message';
import { Item } from '../../interface/inter';



//additemtopedidos para adicionar um novo pedido no banco de dados
export const addItemToPedidos = (novoItem:any) => {
    return async (dispatch:any) => {
        // console.log('Conteúdo de novoItem:', novoItem);
      try {
        // Adiciona um novo item à coleção "pedidos" no Firestore
       await addDoc(collection(db, 'pedidos'), novoItem);
  
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

export const setAdicionar_itens= (pedido:Item[]) => {
    return {
        type: SET_ADICIONAR_PEDIDO_ITENS,
        payload: pedido
    }
}
export const set_carrinho_aviso_tutorialeentrega= (alerta:boolean) => {
    return {
        type: SET_CARRINHO_AVISO,
        payload: alerta
    }
}
// export const setAdicionar_pedido_state_mesa = (pedido:any) => {
//   return {
//       type: SET_ADICIONAR_PEDIDO_MESA,
//       payload: pedido
//   }
// }