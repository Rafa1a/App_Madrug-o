import { initialState,actions } from "../../interface/inter_actions"
import { SET_PEDIDOS } from "../action/actionTypes"

const reducer = (state = initialState, action:actions) =>{
    switch (action.type) {
        case SET_PEDIDOS : {
            return {
                ...state,
                pedidos: action.payload
            }
        }
        default :
            return state
    }
}

export default reducer