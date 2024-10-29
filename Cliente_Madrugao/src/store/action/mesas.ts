import { SET_MESAS } from './actionTypes';
import { db } from '../auth';
import { collection, doc, getDocs, onSnapshot, query, updateDoc,where } from 'firebase/firestore';
import { setMessage } from './message';


export const startMesas = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "mesas"));
      onSnapshot(q, (snapshot) => {
        const mesas: any[] = [];
        snapshot.forEach((doc) => {
            // console.log(doc.id)
            const rawmesas = doc.data();
            mesas.push({...rawmesas,
              id: doc.id}) 
          }); 
          
          dispatch(setMesas(mesas))
          console.log("mesas onsnap")

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

// Atualizar MESA  status_call: 

export const fetch_mesa_status_user_call = (mesa:number) => {
  return async (dispatch:any)=>{
    try{  
        console.log(mesa)
        const q = query(collection(db, "mesas"), where("numero_mesa", "==", mesa));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id; 
          const docRef = doc(db, 'mesas', docId);
          await updateDoc(docRef, {
            status_call: true
          });
        } else {
          console.log('nao encontrado');
        }
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar status da chamada'
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