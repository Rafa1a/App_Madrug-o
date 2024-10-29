
export interface actions {
    type :string,
    payload:any
}
export const initialState:any = {
    pedidos: undefined,
    pedidos_itens: undefined,
  
    
}

export interface message {
    title:string;
    text:string
}