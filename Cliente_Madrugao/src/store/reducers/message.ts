import { actions } from "../../interface/inter_actions"
import { SET_DATA_FECHADO_ABERTO, SET_FECHADO_ABERTO, SET_MESSAGE, SET_MODAL_FECHADO_ABERTO } from "../action/actionTypes"

const initialState = {
    title: '',
    text : '',
    fechado_aberto : '',
    data_fechado_aberto : 0,
    modal_fechado_aberto : false
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
        case SET_DATA_FECHADO_ABERTO :{
            return {
                ...state,
                data_fechado_aberto:action.payload
            }
        }
        case SET_MODAL_FECHADO_ABERTO :{
            return {
                ...state,
                modal_fechado_aberto:action.payload
            }
        }
        default :
            return state
    }
}


export default reducer