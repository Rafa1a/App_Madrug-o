import { inicial_state_mesa,actions } from "../../interface/inter_actions"
import {  SET_ADICIONAR_PEDIDO_MESA, SET_MESAS } from "../action/actionTypes"

const reducer = (state = inicial_state_mesa, action:actions) =>{
    switch (action.type) {
        case SET_MESAS : {
            return {
                ...state,
                mesas: action.payload
            }
        }
        case SET_ADICIONAR_PEDIDO_MESA : {
            return {
                ...state,
                state_mesas: action.payload
            }
        }
        default :
            return state
    }
}
export default reducer