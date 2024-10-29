import { initialState,actions } from "../../interface/inter_actions"
import { SET_ADICIONAR_PEDIDO_ITENS, SET_MAIOR_ORDEM, SET_MESAS, SET_PEDIDOS, SET_PEDIDOS_MESA, SET_PEDIDOS_MESA_TRUE, SET_TOTALVALOR } from "../action/actionTypes"

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
        case SET_PEDIDOS_MESA_TRUE :{
            return {
                ...state,
                pedidos_mesa_true: action.payload
            }
        }
        case SET_TOTALVALOR :{
            return {
                ...state,
                total: action.payload
            }
        }
        case SET_ADICIONAR_PEDIDO_ITENS : {
            return {
                ...state,
                adicionar_pedido: action.payload
            }
        }
        case SET_MESAS : {
            return {
                ...state,
                mesas: action.payload
            }
        }
        case SET_MAIOR_ORDEM : {
            return {
                ...state,
                ordem: action.payload
            }
        }
        default :
            return state
    }
}
export default reducer