import { createStore,combineReducers, compose, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
// import  userReducer  from "./reducers/user";
// import postsReducer from './reducers/posts'
// import messageReducer from './reducers/message'
import pedidosReducer from './reducers/pedidos'
import userReducer from './reducers/user'
import messageReducer from './reducers/message'
import cardapioReducer from './reducers/cardapio'
import stateMesaReducer from './reducers/mesas'
import adicionar_pedidoReducer from './reducers/adicionar_pedido'
import statepaes from './reducers/paes'
const reducers = combineReducers({
    pedidos : pedidosReducer,
    user : userReducer,
    message: messageReducer,
    cardapio:cardapioReducer,
    mesa : stateMesaReducer,
    adicionar_pedido : adicionar_pedidoReducer,
    paes : statepaes
    
})
const storeConfig = () => {
    return createStore(reducers, applyMiddleware(thunk))
}

export default storeConfig
