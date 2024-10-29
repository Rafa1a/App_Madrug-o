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
    referencia:0,

}
export const initialState_cardapio:any = {
    cardapio:undefined,
    url:'',
    paes:undefined,
}
export interface message {
    title:string;
    text:string
}
export interface inicial_state_outros  {
    localidade: string,
    status: boolean,
    ordem: number,
    itens: adicionar_comp[],
    rua: string,
    numero: number,
    pegar_local: boolean,
}
export const inicial_state_outros:any = {
    state_outros: {
        localidade: 'OUTROS',
        status: false,
        ordem:  0,
        itens: [],
        rua: '',
        numero: 0,
        pegar_local: false,
    },
    state_mesas: {
        localidade: 'MESA',
        numero_mesa:0,
        status: false,
        ordem:  0,
        itens: [],
    }
   
   
}