import { user_on } from "../../interface/inter"
import { GET_USER, GET_USER_FUNC } from "../action/actionTypes"

interface actions {
    type :string,
    payload:any
}
const initialState:any = {
    users:[],
    users_func:[]
}


const reducer = (state = initialState, action:actions) =>{
    switch(action.type) {
        case GET_USER : 
            return {
                ...state,
                users:action.payload
            }
        case GET_USER_FUNC : 
            return {
                ...state,
                users_func:action.payload
            }
        default :
            return state
    }
}
export default reducer