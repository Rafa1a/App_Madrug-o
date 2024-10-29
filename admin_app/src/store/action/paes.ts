import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { db } from "../auth";
import { setMessage } from "./message";
import { SET_PAES } from "./actionTypes";

//onSnapshot para atualizar caso alguma informacao mude no paes
export const startpaesListeners = () => {
    return (dispatch: any) => {
      try{
        const q = query(collection(db, "paes"));
        onSnapshot(q, (snapshot) => {
          const paes: any[] = [];
            snapshot.forEach((doc) => {
                const rawpaes = doc.data();
                paes.push({...rawpaes,
                  id: doc.id}) 
              }); 
          dispatch(setPaes(paes[0]))
          console.log("paes onsnap",paes[0])
        }); 
      }catch (e) {
          dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro ao contatar o servidor de pães'
          }))
        }
     
    };
  };
//update paes
export const fetchUpdatePaes = (hamburguer: any,frances:any,sirio:any,id:string) => {
    return async (dispatch: any) => {
      try{
        const paesRef = doc(db, "paes",id);
        await updateDoc(paesRef, {
            hamburguer: hamburguer,
            frances: frances,
            sirio: sirio
          });
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar pães'
        }))
      }
    };
  };
// atualizar pedido no banco
export const fetchUpdatepedidos_Paes_status = (id:string) => {
    return async (dispatch: any) => {
      try{
        const paesRef = doc(db, "pedidos",id);
        await updateDoc(paesRef, {
            status_pao : true
          });
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar pães'
        }))
      }
    };
  };
  //set paes
export const setPaes = (paes: any) => {
    console.log("paes onsnap",paes)
    return {
      type: SET_PAES,
      payload:paes
    };
  };