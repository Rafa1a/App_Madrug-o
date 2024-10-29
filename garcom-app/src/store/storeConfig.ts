import { createStore,combineReducers, compose, applyMiddleware } from "redux";

import thunk from "redux-thunk";
// import  userReducer  from "./reducers/user";
// import postsReducer from './reducers/posts'
// import messageReducer from './reducers/message'
import pedidosReducer from './reducers/pedidos'
import userReducer from './reducers/user'
import messageReducer from './reducers/message'
import cardapioReducer from './reducers/cardapio'
import stateReducer from './reducers/adicionar'
import statepaes from './reducers/paes'
const reducers = combineReducers({
    pedidos : pedidosReducer,
    user : userReducer,
    message: messageReducer,
    cardapio:cardapioReducer,
    state : stateReducer,
    paes:statepaes

})
const storeConfig = () => {
    return createStore(reducers, compose(applyMiddleware(thunk)))
}

export default storeConfig