
import axios from 'axios'
import {SET_PEDIDOS, SET_PEDIDO_ITENS} from './actionTypes'
import { Dispatch } from 'redux'
//auth
import { db } from '../auth';

import { collection,doc,onSnapshot,getDocs,query, where, updateDoc} from "firebase/firestore"; 
import { setMessage } from './message';

//onSnapshot para atualizar caso alguma informacao mude 
export const startPedidosListener = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "pedidos"), where("status_chapeiro", "==", true));
      onSnapshot(q, (snapshot) => {
        const pedidos: any[] = [];
          snapshot.forEach((doc) => {
              const rawPedidos = doc.data();
              pedidos.push({...rawPedidos,
                id: doc.id}) 
            }); 
        // console.log(pedidos)
        if(pedidos.length === 1) {
          onDisplayNotification()
        }
        pedidos.sort((a:any, b:any) => a.ordem - b.ordem)
        dispatch(setPedidos(pedidos));
        console.log("pedidos onsnap")
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


//chamada assyncrona com o firebase get () com QUERY e WHERE retornando uma consulta especifica

// chamda apra atualizar o status_chapeiro
export const fetchatualizar_pedido = (id:any) => {
  return async (dispatch:any)=>{

    const pedidoRef = doc(db, 'pedidos', id);
    await updateDoc(pedidoRef, {
      status_chapeiro: false
    });
    
  }
}
// definir no redux os pedidos ACTION
export const setPedidos =  (pedidos:any) => {
  return { 
      type:SET_PEDIDOS,
      payload:pedidos
  }

}
export const set_Pedido_Itens =  (pedidos:any) => {
  return { 
      type:SET_PEDIDO_ITENS,
      payload:pedidos
  }

}


/////////////////notificacao ///////////////////////////////////
import * as Notifications from 'expo-notifications';

async function onDisplayNotification() {
  try {
    // Solicitar permissões (necessário para iOS)
    await Notifications.requestPermissionsAsync();

    // Criar um canal (necessário para Android)
    const channelId = 'default';
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.HIGH,
    });

    // Exibir uma notificação
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Novo Pedido',
        body: 'Vamos começar!',
      },
      trigger: null, // para exibir imediatamente, ou você pode definir um gatilho específico
    });

    console.log('Notificação enviada com sucesso.');
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
}


/////////////////////////////////////////////////////////////

  


