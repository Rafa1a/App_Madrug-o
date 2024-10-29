import { initialState,actions } from "../../interface/inter_actions"
import { SET_PEDIDOS, SET_PEDIDO_ITENS } from "../action/actionTypes"

const reducer = (state = initialState, action:actions) =>{
    switch (action.type) {
        case SET_PEDIDOS : {
            return {
                ...state,
                pedidos: action.payload
            }
        }
        case SET_PEDIDO_ITENS : {
            return {
                ...state,
                pedidos_itens: action.payload
            }
        }
        default :
            return state
    }
}

export default reducer