import { user_on } from "../../interface/inter"
import { GET_USER } from "../action/actionTypes"

interface actions {
    type :string,
    payload:any
}
const initialState:any = {
    users:[]
}


const reducer = (state = initialState, action:actions) =>{
    switch(action.type) {
        case GET_USER : 
            return {
                ...state,
                users:action.payload
            }
        default :
            return state
    }
}
export default reducer