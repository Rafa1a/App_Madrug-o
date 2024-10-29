import { NavigationProp } from "@react-navigation/native";

export interface NumeroProps {
    styles ?: boolean
    number: number;
    pedido_tamanho ?: boolean
  }
export interface pedido_props {
    styles ?: boolean
    id      : string;
    numero_mesa   ?: number;
    image_on      ?: string;
    name_on       ?: string;
    navigation ?: NavigationProp<any,any>;
    ordem       ?:number
    rua?:string,
    numero?:string,
    pegar_local?: boolean;
    dinheiro?:number;
    pix?:boolean;
    cartao?:cartao;
    route?: any;

    onPedido_itens?:(pedido_itens:any)=>void

    itens?:Item[]
    observacao?:string
  }
export interface cartao{
    visa:boolean;
    mastercard:boolean;
    elo:boolean
  }
export interface user_on{
  id            : string
  image_on      : string
  name_on       : string,
  rua_on         : string,
  numero_on        : number
 
}
  interface Item {
    name_p: string;
    categoria: "comidas" | "bebidas" | "bar";
    categoria_2?: string;
    retirar_p: string[];
    adicionar_p: string[];
  }
  export interface pedido_inter {
    id?:string,
    localidade: "MESA" | "ONLINE" | "OUTROS";
    status: boolean;
    numero_mesa?: number;
    id_user?: string;
    itens: Item[];
    ordem:number
    status_chapeiro?:boolean
    status_porcoes?:boolean
    status_bar?:boolean
    pegar_local?: boolean;
    rua?: string;
    numero?: string;
    dinheiro:number;
    cartao:cartao;
    pix:boolean;

    name_outros?:string;
  }
  