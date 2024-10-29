import { user_fun } from "../../interface/inter"
import { GET_USER, LOGIN_USER } from "../action/actionTypes"

interface actions {
    type :string,
    payload:any
}
const initialState:any = {
    users:undefined,
    user:undefined
}


const reducer = (state = initialState, action:actions) =>{
    switch(action.type) {
        case GET_USER : 
            return {
                ...state,
                users:action.payload
            }
        case LOGIN_USER : 
            return {
                ...state,
                user:action.payload
            }
        default :
            return state
    }
}
export default reducer