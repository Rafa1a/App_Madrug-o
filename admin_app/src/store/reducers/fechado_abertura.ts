import { actions } from "../../interface/inter_actions"
import { SET_ABERTURA_VALOR, SET_CAIXAS_ANTERIORES, } from "../action/actionTypes"
const inicial_state_outros ={
    abertura_valor:200,
    caixas_anteriores:[]
}
const reducer = (state = inicial_state_outros, action:actions) =>{
    switch (action.type) {
        case SET_ABERTURA_VALOR : {
            return {
                ...state,
                abertura_valor: action.payload
            }
        }
        case SET_CAIXAS_ANTERIORES : {
            return {
                ...state,
                caixas_anteriores: action.payload
            }
        }

        default :
            return state
    }
}
export default reducer