import { message } from './../../interface/inter_actions';
import { SET_MESSAGE } from './actionTypes';


export const setMessage = (message:message) => {
    return {
        type: SET_MESSAGE,
        payload: message
    }
}