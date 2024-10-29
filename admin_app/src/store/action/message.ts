import { message } from './../../interface/inter_actions';
import {  SET_FECHADO_ABERTO, SET_MESSAGE,  } from './actionTypes';
import { db } from '../auth';
import {  collection,doc,onSnapshot, query, updateDoc,  } from 'firebase/firestore';

export const setMessage = (message:message) => {
    return {
        type: SET_MESSAGE,
        payload: message
    }
}
export const setFechado_aberto = (fechado_aberto:any) => {
    return {
        type: SET_FECHADO_ABERTO,
        payload: fechado_aberto
    }
}
