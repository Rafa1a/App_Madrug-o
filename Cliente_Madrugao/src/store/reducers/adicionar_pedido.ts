import {actions } from "../../interface/inter_actions"
import { SET_ADICIONAR_PEDIDO_ITENS, SET_CARRINHO_AVISO } from "../action/actionTypes"

const inicial_state_ ={
    adicionar_itens:undefined,
    alerta:false
}
const reducer = (state = inicial_state_, action:actions) =>{
    switch (action.type) {
        case SET_ADICIONAR_PEDIDO_ITENS : {
            return {
                ...state,
                adicionar_itens: action.payload
            }
        }
        case SET_CARRINHO_AVISO : {
            return {
                ...state,
                alerta: action.payload
            }
        }
        default :
            return state
    }
}
export default reducer