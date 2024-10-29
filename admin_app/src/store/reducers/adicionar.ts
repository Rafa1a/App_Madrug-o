import { inicial_state_outros,actions } from "../../interface/inter_actions"
import { SET_ADICIONAR_PEDIDO, SET_ADICIONAR_PEDIDO_MESA } from "../action/actionTypes"

const reducer = (state = inicial_state_outros, action:actions) =>{
    switch (action.type) {
        case SET_ADICIONAR_PEDIDO : {
            return {
                ...state,
                state_outros: action.payload
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