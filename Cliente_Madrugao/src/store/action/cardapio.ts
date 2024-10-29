import { collection,doc,onSnapshot,getDocs,query, where, updateDoc, deleteDoc, arrayRemove,addDoc, arrayUnion, getDoc} from "firebase/firestore"; 
import { db } from '../auth';

import { setMessage } from "./message";
import { SET_CARDAPIO, SET_COMMENTS, SET_MODAL_COMMENTS, SET_ONOROF } from "./actionTypes";

//onSnapshot para atualizar caso alguma informacao mude 

export const startCardapio = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "cardapio"));
      onSnapshot(q, (snapshot) => {
        const cardapio: any[] = [];
        snapshot.forEach((doc) => {
            // console.log(doc.id)
            const rawCradapio = doc.data();
            cardapio.push({...rawCradapio,
              id: doc.id}) 
          }); 
          // console.log(cardapio)

          const cardapio_filtrado = cardapio.filter((item)=>item.onorof===true)
          
          dispatch(setCardapio(cardapio_filtrado))

          console.log("Cardapio onsnap")

        });
        
    }catch (error) {
        // console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor do Cardapio'
          }))
      }
    
  };
};
//add comentario
export const addComment = (id:string,comment:any) => {
  return async(dispatch: any) => {
    try{
      console.log('tudo certo add comment')
      const cardapioRef = doc(db, "cardapio", id);
      await updateDoc(cardapioRef, {
        comments: arrayUnion(comment)
      });
    }catch (error) {
      console.error('Erro ao adicionar item ao pedido:', error);
      dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro o servidor do Cardapio'
        }))
    }
  }
};
///////////////////atualizar pedidos_quantidade + 1 
export const fetchatualizar_cardapio_pedidos_quantidade = (id:string,number:number) => {
  return async (dispatch:any)=>{
    try{
      const pedidoRef = doc(db, 'cardapio', id);
      await updateDoc(pedidoRef, {
        pedidos_quantidade: number
      });
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar estado do cardapio'
      }))
    }
    
  }
}

//atuazlizar o cardapio
// export const updateAllCardapio = async () => {
//   const cardapioSnapshot = await getDocs(collection(db, "cardapio"));

//   cardapioSnapshot.forEach(async(docSnapshot) => {
//     console.log(docSnapshot.id, "=>", docSnapshot.data());
//     const cardapioRef = doc(db, "cardapio", docSnapshot.id);
//     // await updateDoc(cardapioRef, {
//     //   comments: [{
//     //     uid: "7yLERVv0ImRfB7ZGmZu3SveKT643",
//     //     comment: "Muito bom",
//     //     date: new Date()
//     //   }]
//     // });
//   });
// };
// updateAllCardapio();


 //set cardapio para toda a aplicacao
export const setCardapio = (cardapio:any) =>{
    return { 
        type:SET_CARDAPIO,
        payload:cardapio
    }
} 
export const setModal_comments = (boolean:boolean) =>{
    return { 
        type:SET_MODAL_COMMENTS,
        payload:boolean
    }
} 
export const setComments = (comments:string) =>{
    return { 
        type:SET_COMMENTS,
        payload:comments
    }
} 
export const setOnorof = (onorofs:string) =>{
    return { 
        type:SET_ONOROF,
        payload:onorofs
    }
} 