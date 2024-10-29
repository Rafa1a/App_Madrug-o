import { message } from './../../interface/inter_actions';
import { SET_DATA_FECHADO_ABERTO, SET_FECHADO_ABERTO, SET_MESSAGE, SET_MODAL_FECHADO_ABERTO } from './actionTypes';
import { db } from '../auth';
import { collection,onSnapshot, query,  } from 'firebase/firestore';

export const setMessage = (message:message) => {
    return {
        type: SET_MESSAGE,
        payload: message
    }
}
export const setFechado_aberto = (fechado_aberto:string) => {
    return {
        type: SET_FECHADO_ABERTO,
        payload: fechado_aberto
    }
}
export const setData_Fechado_aberto= (data_fechado_aberto:number) => {
    return {
        type: SET_DATA_FECHADO_ABERTO,
        payload: data_fechado_aberto
    }
}

export const setModal_Fechado_aberto= (modal:boolean) => {
    return {
        type: SET_MODAL_FECHADO_ABERTO,
        payload: modal
    }
}


export const startfechado_aberto = () => {
    return (dispatch: any) => {
      try{
        const q = query(collection(db, "loja"));
        onSnapshot(q, (snapshot) => {
          const item: any[] = [];
          snapshot.forEach((doc) => {
              // console.log(doc.id)
              const rawitem = doc.data();
              item.push({...rawitem,
                id: doc.id}) 
            }); 
            
            dispatch(setFechado_aberto(item[0].fechado_aberto))
            dispatch(setData_Fechado_aberto(item[0].data_fechado_aberto))
            console.log("fechado_aberto onsnap")
  
          });
          
      }catch (error) {
          // console.error('Erro ao adicionar item ao pedido:', error);
          dispatch(setMessage({
              title: 'Error',
              text: 'Ocorreu um erro o servidor do Mesas'
            }))
        }
      
    };
  };