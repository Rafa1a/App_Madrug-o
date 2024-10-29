import { actions } from "../../interface/inter_actions"
import { SET_MESSAGE } from "../action/actionTypes"

const initialState = {
    title: '',
    text : ''
}

const reducer = (state = initialState, action:actions) =>{
    switch (action.type) {
        case SET_MESSAGE :{
            return {
                ...state,
                title:action.payload.title,
                text:action.payload.text
            }
        }
        default :
            return state
    }
}


export default reducer