import { NavigationProp } from "@react-navigation/native";
import { Item, ItemProps } from "./inter";
import { cardapio } from "./inter_cardapio";

export interface adicionar_comp {
    estoque?: number;
    valor : number;
    estoq?: boolean;
    name: string;
    categoria_3?: string;
    categoria_2?: string;
    categoria?: string;
    id: string;
    ingredientes?:string[];
    adicionais?:string[]
    inicial_state_outros?:{}
    onAdicionar_pedido:(pedido:any)=>void
    adicionar_pedido:Item[]
    trueorfalse:boolean
    adicionar_retirar?:boolean
    cardapio:cardapio[];
    paes:{
        frances:number,
        hamburguer:number,
        sirio:number,
    }


}

export interface adicionar_screen{
    cardapio:cardapio[];
    route:any;
    adicionar_pedido:Item[]
    navigation ?: NavigationProp<any,any>;
    inicial_state_outros:any

}
export interface adicionais {
    valor:number,
    name:string
}

export interface lista_pedido_adicionar {
    adicionar_pedido:Item[]

    numero_mesa?:number
    inicial_state_outros?:any
    onFitchTotal_valor:(total:number)=>void
    onFitchExcluir_Item:(id:string,item:ItemProps)=>void
    onAdicionar_pedido:(a:any)=>void
    
  }