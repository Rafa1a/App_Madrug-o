import { db } from '../auth';
import {  addDoc, arrayUnion, collection,doc,getDocs,onSnapshot, query, updateDoc,  } from 'firebase/firestore';
import { setFechado_aberto, setMessage } from './message';
import { SET_ABERTURA_VALOR, SET_CAIXAS_ANTERIORES } from './actionTypes';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


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
            
            dispatch(setFechado_aberto(item[0]))
            console.log("fechado_aberto onsnap")
  
          });
          
      }catch (error) {
          // console.error('Erro ao adicionar item ao pedido:', error);
          dispatch(setMessage({
              title: 'Error',
              text: 'Ocorreu um erro o servidor da loja'
            }))
        }
      
    };
  };

  //alterar fechado_aberto
  export const Loja_up = (id:string,fechado_aberto:any,data_fechado_aberto:any,abertura:number) => {
    return async(dispatch: any) => {
      try{
        const lojaRef = doc(db, "loja", id);
        await updateDoc(lojaRef, {
            fechado_aberto: fechado_aberto,
            data_fechado_aberto:data_fechado_aberto,
            abertura:abertura
        });
      }catch (error) {
        console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor da loja'
          }))
      }
    }
  };
// controle de caixa 
export const controle_caixa_add = (
  data_abertura:number,
  data_fechamento:number,
  abertura:number,
  total:number,
  lucro:number,
  dinheiro_caixa:number,
  cartao_caixa:number,
  pix_caixa:number,
  pedidos:any
  ) => {
  return async(dispatch: any) => {
    try{
      const lojaRef = collection(db, "controle_caixa");
      addDoc(lojaRef, {
        data_abertura   : data_abertura,
        data_fechamento : data_fechamento,
        abertura        : abertura,
        total           : total,
        lucro           : lucro,
        dinheiro_caixa  : dinheiro_caixa,
        cartao_caixa    : cartao_caixa,
        pix_caixa       : pix_caixa,

        pedidos         : pedidos
      });
    }catch (error) {
      console.error('Erro ao adicionar item ao pedido:', error);
      dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro o servidor da loja'
        }))
    }
  }
};
// caixas anteriores em controle de caixa get
export const controle_caixa_get = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "controle_caixa"));
      // get
      getDocs(q).then((snapshot) => {
        const item: any[] = [];
        snapshot.forEach((doc) => {
            // console.log(doc.id)
            const rawitem = doc.data();
            item.push({...rawitem,
              id: doc.id}) 
          });
          dispatch(setCaixas_anteriores(item))
          console.log("fechado_aberto onsnap")
        });
          
        
    }catch (error) {
        // console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor da loja controles caixas anteriores'
          }))
      }
    
  };
};
//abertura valor
export const set_Abertura_valor = (valor:any) =>{
  return { 
      type:SET_ABERTURA_VALOR,
      payload:valor
  }
}
// caixas anteriores
export const setCaixas_anteriores = (caixas:any) =>{
  return { 
      type:SET_CAIXAS_ANTERIORES,
      payload:caixas
  }
}