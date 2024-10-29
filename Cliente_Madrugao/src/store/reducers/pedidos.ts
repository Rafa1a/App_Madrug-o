import { initialState,actions } from "../../interface/inter_actions"
import { SET_ADICIONAR_PEDIDO_ITENS, SET_MESAS, SET_PEDIDOS, SET_PEDIDOS_MESA, SET_TOTALVALOR } from "../action/actionTypes"

const reducer = (state = initialState, action:actions) =>{
    switch (action.type) {
        case SET_PEDIDOS : {
            return {
                ...state,
                pedidos: action.payload
            }
        }
        case SET_PEDIDOS_MESA :{
            return {
                ...state,
                pedidos_mesa: action.payload
            }
        }
        case SET_TOTALVALOR :{
            return {
                ...state,
                total: action.payload
            }
        }
        
        default :
            return state
    }
}
export default reducer