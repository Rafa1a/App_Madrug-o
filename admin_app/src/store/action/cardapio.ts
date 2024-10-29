import { collection,doc,onSnapshot,getDocs,query, where, updateDoc, deleteDoc, arrayRemove,addDoc, arrayUnion, getDoc} from "firebase/firestore"; 
import { db, storage } from '../auth';

import { setMessage } from "./message";
import { SET_CARDAPIO, SET_CARDAPIO_URL, SET_REF_NOTA } from "./actionTypes";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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
          dispatch(setCardapio(cardapio))
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
// get em cardapio 
// export const fetchcardapio =  () =>{
//     return async (dispatch:any)=>{
//       try {
//         const q = collection(db, "cardapio");
//         const querySnapshot = await getDocs(q);
//         const cardapio = querySnapshot.docs.map((doc) => {
//           const rawPedidos = doc.data();
//           return {
//             ...rawPedidos,
//             id: doc.id
//           };
//         }); 
//         dispatch(setCardapio(cardapio))
//       } catch (e) {
//         // console.error("Error fetching documents: ", e);
//         dispatch(setMessage({
//           title: 'Error',
//           text: 'Ocorreu um erro ao contatar o servidor dos Cardapios'
//         }))
//       }
//       ///////////ANTIGO  data base///////////
//         // axios.get('/pedidos.json')
//         // .catch(err => console.log(err))
//         // .then((res:any) => {
            
//         //     const rawPedidos = res.data
//         //     const pedidos = []
//         //     for (let key in rawPedidos) {
//         //         pedidos.push({
//         //             ...rawPedidos[key],
//         //             id: key
//         //         })
//         //     }
//         //     dispatch(setPedidos(pedidos))
//         // })
//     }
//   }

  export const fetchatualizar_cardapio_onoroff = (id:any,onorof:Boolean) => {
    return async (dispatch:any)=>{
      try{
        const pedidoRef = doc(db, 'cardapio', id);
        await updateDoc(pedidoRef, {
          onorof: onorof
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
  export const fetchatualizar_cardapio_estoque = (id:any,estoque:number) => {
    return async (dispatch:any)=>{
      try{
        const pedidoRef = doc(db, 'cardapio', id);
        
        await updateDoc(pedidoRef, {
          estoque: estoque
        });
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar estado do estoque'
        }))
      }
      
    }
  }
  export const fetchatualizar_cardapio_estoque_auto = (id:string, estoque:number, id_pedido:string) => {
    return async (dispatch:any) => {
      try {
        // Buscar o documento no Firebase
        const cardapioRef = doc(db, 'cardapio', id);
        const cardapioSnapshot = await getDoc(cardapioRef);
        const dadosCardapio:any = cardapioSnapshot.data();
  
        // Obter o array atual de id_pedido ou inicializar um array vazio
        const idCardapioArray = dadosCardapio.id_pedido || [];
  
        // Adicionar o novo id_pedido ao array usando arrayUnion
        const novoIdPedidoArray = arrayUnion(id_pedido, ...idCardapioArray);
  
        // Atualizar o documento com o novo array de id_pedido e o estoque
        await updateDoc(cardapioRef, {
          estoque: estoque,
          id_pedido: novoIdPedidoArray,
        });
        
        console.log('Estoque atualizado com sucesso');
      } catch (error) {
        // console.error('Erro ao atualizar estoque:', error);
        // Adicione tratamento de erro conforme necessário
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar estado do estoque automatico'
        }))
      }
    };
  };

  // limpeza
  export const fetchAtualizarCardapioIdPedidosLimpeza = () => {
    return async (dispatch: any) => {
      try {
        // Buscar todos os documentos do cardapio
        const cardapioQuerySnapshot = await getDocs(query(collection(db, 'cardapio'), where("categoria", "==", 'bebidas')));
        
        // Buscar todos os documentos do pedido
        const pedidoQuerySnapshot = await getDocs(collection(db, 'pedidos'));
        // Obter os IDs de pedidos existentes em todos os documentos do pedido
        const idsPedidoArray = pedidoQuerySnapshot.docs.map(doc => doc.id);

        // Iterar sobre cada documento do cardapio
        cardapioQuerySnapshot.forEach(async (cardapioDoc) => {
          const cardapioId = cardapioDoc.id;
  
          // Buscar os IDs de pedidos existentes no documento do cardapio
          const idsCardapioArray = cardapioDoc.data()?.id_pedido || [];
          // console.log(idsCardapioArray)
   
          // Filtrar os IDs de pedidos atuais para incluir apenas aqueles que existem no cardápio
          const idsExistentesNoCardapio = idsPedidoArray.filter((idPedido: string) =>
            idsCardapioArray.includes(idPedido)
          );
          // console.log(idsExistentesNoCardapio)
          // Atualizar o documento do cardapio com o novo array de id_pedido
          await updateDoc(doc(db, 'cardapio', cardapioId), {
            id_pedido: idsExistentesNoCardapio,
          });
  
          // console.log(`Ids de Pedidos atualizado com sucesso para o cardapio : estoque ${cardapioId}`);
        });
  
        console.log('Atualização concluída para todos os cardapios');
      } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        // Adicione tratamento de erro conforme necessário
        dispatch(
          setMessage({
            title: 'Error',
            text: 'Ocorreu um erro ao atualizar o estoque automaticamente',
          })
        );
      }
    };
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
///////////////////atualizar pedidos_quantidade - 1

//enviar par ao storage imagem
export const fetchatualizar_cardapio_imagem = (imagem:any) => {
  return async (dispatch:any)=>{
    try{
      const response = await fetch(imagem);
      const blob = await response.blob();

      const storage = getStorage();
      const id = Date.now(); // Generate a unique id
      const imageRef = ref(storage, `cardapio/${id}`);
      const uploadTask = uploadBytes(imageRef, blob);

      uploadTask.then(async () => {
        console.log('Image uploaded to the bucket!');
        const url = await getDownloadURL(imageRef);
        dispatch(set_CARDAPIO_URL(url));
        console.log('Download URL:', url);
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
///adicionar item no cardapio firebase
export const fetchadicionar_cardapio = (item:any) => {
    return async (dispatch:any)=>{
      try{
        await addDoc(collection(db, "cardapio"), item);
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao adicionar item ao cardapio'
        }))
      }
      
    }
  }
//atualizar item do cardapio
export const fetchatualizar_cardapio = (id:any,item:any) => {
    return async (dispatch:any)=>{
      try{
        const pedidoRef = doc(db, 'cardapio', id);
        await updateDoc(pedidoRef, item);
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar item do cardapio'
        }))
      }
      
    }
  }
///retirar um item do cardapio
export const fetchretirar_cardapio = (id:any) => {
    return async (dispatch:any)=>{
      try{
        await deleteDoc(doc(db, "cardapio", id));
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao retirar item do cardapio'
        }))
      }
      
    }
  }
//retirar varios itens do cardapios retirar itens q possuem versao === id
export const fetchretirar_cardapio_versao = (id:any) => {
    return async (dispatch:any)=>{
      try{
        const q = query(collection(db, "cardapio"), where("versao", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao retirar item do cardapio'
        }))
      }
      
    }
  }

  //retirar varios itens do cardapios retirar itens q possuem versao === id
//set cardapio para toda a aplicacao
export const setCardapio = (cardapio:any) =>{
    return { 
        type:SET_CARDAPIO,
        payload:cardapio
    }
} 
  //set cardapio para toda a aplicacao
export const set_CARDAPIO_URL = (url:any) =>{
    return { 
        type:SET_CARDAPIO_URL,
        payload:url
    }
} 