import { actions, initialState_cardapio } from "../../interface/inter_actions"
import { SET_CARDAPIO, SET_COMMENTS, SET_MODAL_COMMENTS, SET_ONOROF } from "../action/actionTypes"

const reducer = (state = initialState_cardapio, action:actions) =>{
    switch (action.type) {
            case SET_CARDAPIO : {
                return {
                    ...state,
                    cardapio: action.payload
                }
            }
            case SET_MODAL_COMMENTS : {
                return {
                    ...state,
                    modal: action.payload
                }
            }
            case SET_COMMENTS : {
                return {
                    ...state,
                    comments: action.payload
                }
            }
            case SET_ONOROF : {
                return {
                    ...state,
                    onorof: action.payload
                }
            }
        default :
            return state
    }
}
export default reducer