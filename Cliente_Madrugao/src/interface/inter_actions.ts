
export interface actions {
    type :string,
    payload:any
}
export const initialState:any = {
    pedidos: undefined,
    pedidos_mesa:[],
    total:0,
}
export const initialState_cardapio:any = {
    cardapio:undefined,
    modal:false,
    comments:undefined,
    onorof:undefined,
}
export interface message {
    title:string;
    text:string
}

export const inicial_state_mesa:any = {
    state_mesas: {
        localidade: 'MESA',
        numero_mesa:0,
        status: false,
        ordem:  0,
        itens: [],
    }
}