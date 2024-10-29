import { adicionar_comp } from "./inter_adicionar";

export interface actions {
    type :string,
    payload:any
}
export const initialState:any = {
    mesas:[],
    pedidos: undefined,
    pedidos_mesa:[],
    total:0,
    adicionar_pedido:[],
    ordem:0,
}
export const initialState_cardapio:any = {
    cardapio:undefined
}
export interface message {
    title:string;
    text:string
}

export const inicial_state_:any = {
    
    state_mesas: {
        localidade: 'MESA',
        numero_mesa:0,
        status: false,
        ordem:  0,
        itens: [],
    }
   
   
}