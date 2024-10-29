import { actions} from "../../interface/inter_actions"
import { SET_PAES } from "../action/actionTypes"
const initialstate = {
    paes:undefined
}
const reducer = (state = initialstate, action:actions) =>{
    switch (action.type) {
            case SET_PAES : {
                return {
                    ...state,
                    paes: action.payload
                }
            }
        default :
            return state
    }
}
export default reducer