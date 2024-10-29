import { actions } from "../../interface/inter_actions"
import { SET_FECHADO_ABERTO, SET_MESSAGE } from "../action/actionTypes"

const initialState = {
    title: '',
    text : '',
    fechado_aberto: {
        fechado_aberto: '',
        data_fechado_aberto: 0,
    }
}

const reducer = (state = initialState, action:actions) =>{
    switch (action.type) {
        case SET_MESSAGE :{
            return {
                ...state,
                title:action.payload.title,
                text:action.payload.text
            }
        }
        case SET_FECHADO_ABERTO :{
            return {
                ...state,
                fechado_aberto:action.payload
            }
        }
        default :
            return state
    }
}


export default reducer