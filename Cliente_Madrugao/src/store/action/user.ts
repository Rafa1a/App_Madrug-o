
import {GET_USER, LOGIN_USER, LOGIN_USER_INFO, RESET_STATE, SET_EXPOTOKEN, SET_LOGOUT, SET_QR_CODE} from './actionTypes'
import { user_on} from '../../interface/inter'
import { collection, addDoc,setDoc,doc,onSnapshot,getDocs,query, where, updateDoc,arrayUnion, arrayRemove} from "firebase/firestore"; 
import { db } from '../auth';
import { setMessage } from './message';




// veficacao em um unico user logado 
export const startUser_on_info= (uid:string) => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "user_on",),where("uid", "==", uid));
      onSnapshot(q, (snapshot) => {
        const users: any[] = [];
          snapshot.forEach((doc) => {
              const rawUsers = doc.data();
              users.push({...rawUsers,
                id: doc.id}) 
            }); 
        // console.log(users[0])
        dispatch(setUser_login_info(users[0]));
        console.log("user_on_info onsnap")
      }); 
    }catch (error) {
        // console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor do User'
          }))
      }
  }; 
};

//onSnapshot para atualizar caso alguma informacao mude em USERS GERAL

export const startUsers_on= () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "user_on"));
      onSnapshot(q, (snapshot) => {
        const users: any[] = [];
          snapshot.forEach((doc) => {
              const rawUsers = doc.data();
              users.push({...rawUsers,
                id: doc.id}) 
            }); 
        // console.log(users)
        dispatch(setUsers(users));
        console.log("users onsnap")
      }); 
    }catch (error) {
        // console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor do User'
          }))
      }
  }; 
};

///////////////////ADD
export const add_On = (user:user_on) => {
  return async(dispatch:any)=>{
    try {
      const usersCol = collection(db, 'user_on');
      const q = query(usersCol, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
          console.log("nao existe")
          await addDoc(usersCol,user);  
      } else {
          console.log("ja existe")
      }
    } catch (e) { 
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
        }))
      }
  }
}
/////////////////////////UPDATE THEME em user_on
export const update_On_theme = (id:string,theme_mode:boolean) => {
  return async(dispatch:any)=>{
    try {
      console.log(theme_mode)
      updateDoc(doc(db, "user_on", id), {
        theme_mode: theme_mode,
      });
  } catch (e) { 
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
        }))
      }
  }
}
/////////////////////////UPDATE CURTIDAS em cardapio
export const update_On_curtidas = (id:string,curtidas:number) => {
  return async(dispatch:any)=>{
    try {
      // console.log(curtidas)
      updateDoc(doc(db, "cardapio", id), {
        curtidas: curtidas,
      });
  } catch (e) { 
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
        }))
      }
  }
}
/////////////////////////UPDATE user_on Curtidas em user_on id de cardapio
export const update_On_curtidas_user = (id:string,curtidas:string,curtidas_array:string[]) => {
  return async(dispatch:any)=>{
    try {
      // console.log(curtidas)
      if(curtidas_array.includes(curtidas)){
        updateDoc(doc(db, "user_on", id), {
          curtidas: arrayRemove(curtidas),
        });
      } else {
        updateDoc(doc(db, "user_on", id), {
          curtidas: arrayUnion(curtidas),
        });
      }
  } catch (e) { 
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
        }))
      }
  }
}
///////////////////////////////////// atualizar localidade MESA
export const setUser_localidade = (status_mesa:boolean, mesa:number, id_user:string) =>{
  return async(dispatch:any)=>{
    try {
      updateDoc(doc(db, "user_on", id_user), {
        status_mesa:status_mesa,
        mesa:mesa
      });
    } catch (e) {
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
      }))
    }
  }
}
///////////////////////////////////// atualizar user on rua_on e numero_on
export const setUser_rua_numero_celular = (rua_on:string, numero_on:string,celular:string, id_user:string) =>{
  return async(dispatch:any)=>{
    try {
      console.log(rua_on, numero_on)
      updateDoc(doc(db, "user_on", id_user), {
        rua_on:rua_on,
        numero_on:numero_on,
        celular:celular
      });
    } catch (e) {
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
      }))
    }
  }
}
/////////////////////////////////////
////////////////////////////////////adicionar ultimos pedidos em ultimo_pedido dentro de user_on
export const setUser_ultimo_pedido = (ultimo_pedido: {}, id_user: string, user_ultimos_pedidos: {}[] = []) => {
  return async(dispatch: any) => {
    try {
      // Garante que user_ultimos_pedidos seja um array
      user_ultimos_pedidos = user_ultimos_pedidos || [];

      // Se já temos 3 pedidos, removemos o mais antigo
      if (user_ultimos_pedidos.length >= 3) {
        user_ultimos_pedidos.shift();
      }

      // Adicionamos o novo pedido
      user_ultimos_pedidos.push(ultimo_pedido);

      // Atualizamos o array inteiro no Firebase
      await updateDoc(doc(db, "user_on", id_user), {
        ultimos_pedidos: user_ultimos_pedidos
      });
    } catch (e) {
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
      }))
    }
  }
}
///////////////////////////////////// 
/////////////////////////////////////adicionar tutorial em useron
//status_tutorial
export const setUser_tutorial_status = (status:boolean, id_user: string) => {
  return async(dispatch: any) => {
    try {
      await updateDoc(doc(db, "user_on", id_user), {
        status_tutorial: status
      });
    } catch (e) {
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
      }))
    }
  }
}
//
export const setUser_tutorial_inicial = ( id_user: string) => {
  return async(dispatch: any) => {
    try {
      await updateDoc(doc(db, "user_on", id_user), {
        tutorial:[{
          status: false,
          value: 'perfil'
        },
        {
          status: false,
          value: 'carrinho'
        },
        {
          status: false,
          value: 'favoritos'
        },
        {
          status: false,
          value: 'categorias'
        },
        {
          status: false,
          value: 'ordem'
        },
        {
          status: false,
          value: 'qrcode'
        },
        {
          status: false,
          value: 'lista_itens'
        },
        {
          status: false,
          value: 'ultimos_pedidos'
        },
        {
          status: false,
          value: 'relogio'
        },
      ]
      });
    } catch (e) {
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
      }))
    }
  }
}
//
export const setUser_tutorial = (tutorials:any[], id_user: string) => {
  return async(dispatch: any) => {
    try {
      await updateDoc(doc(db, "user_on", id_user), {
        tutorial: tutorials
      });
    } catch (e) {
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
      }))
    }
  }
}

/////////////////////////////////////atualizar token em user_on
export const setUser_token = (token:string, id_user: string) => {
  return async(dispatch: any) => {
    try {
      await updateDoc(doc(db, "user_on", id_user), {
        token: token
      });
    } catch (e) {
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao contatar o servidor dos usuarios em token'
      }))
    }
  }
}
/////////////////////////////////////adicionar tutorial em useron
export const setUsers =  (users:user_on[]) => {
    return { 
        type:GET_USER,
        payload:users
    }
    
}
export const setUser_login =  (user:any) => {
    return { 
        type:LOGIN_USER,
        payload:user
    }
    
}

export const setUser_login_info =  (user_info:user_on) => {
  return { 
      type:LOGIN_USER_INFO,
      payload:user_info
  }
  
}

//QR CODE solucao para nao ser redundante quando voltar ao login o qr code

export const setQr_code =  (qrcode:boolean) => {
  return { 
      type:SET_QR_CODE,
      payload:qrcode
  }
  
}
//resetar stado
export const resetState = () => {
  return {
    type: RESET_STATE
  }
}
//logout
export const setLogout = (state_logout:boolean) => {
  return {
    type: SET_LOGOUT,
    payload: state_logout
  }
  
}

export const setExpotoken = (expotoken:string) => {
  return {
    type: SET_EXPOTOKEN,
    payload: expotoken
  }
}