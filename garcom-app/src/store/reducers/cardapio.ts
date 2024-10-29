import { actions, initialState_cardapio } from "../../interface/inter_actions"
import { SET_CARDAPIO } from "../action/actionTypes"

const reducer = (state = initialState_cardapio, action:actions) =>{
    switch (action.type) {
            case SET_CARDAPIO : {
                return {
                    ...state,
                    cardapio: action.payload
                }
            }
        default :
            return state
    }
}
export default reducer