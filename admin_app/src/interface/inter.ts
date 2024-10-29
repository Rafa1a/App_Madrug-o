import { cardapio } from './inter_cardapio';
import { NavigationProp } from "@react-navigation/native";
export interface HeaderPedidoProps {
  numero_mesa?: number;
  image_on?: string;
  name_on?: string;
  rua?:string;
  numero?:string,
  pegar_local?:boolean
  dinheiro?:number;
  pix?:boolean;
  cartao?:cartao;
  pedidos:pedido_inter[]
  id?:string
  ids?:string[]
  adicionar?:boolean
  on_get_notafiscal?:()=>void
  referencia?:any
  on_up_ref:(id:any,ref:number)=>void
  celular?:string
  observacao?:string

}
export interface HeaderPedidosProps {
  outros?: boolean;
  online?: boolean;
  mesa?: boolean;
  navigation ?: NavigationProp<any,any>;
  mesas:[],
  onFetchMesas:()=>void
  onDelete_all:()=>void
  onAtualizar_is_pedidos_cardapio:()=>void
  onAtualizar_user_Limpeza:()=>void

  users?:user_on[]
  

}
export interface ItemProps {
  categoria?: string;
  categoria_2?: string;
  adicionar_p?: any[];
  retirar_p?: any[];
  name_p?: string;
  quantidade?:number,
  valor_p?:number,
  mesa?:boolean
  objeto_lista_ids?:(a:any)=>void
  deleteitem:boolean
  adicionar_pedido:Item[]
  id?:string
  onAdicionar_pedido:(a:any)=>void
  //estoque
  onAtualizar_estoque:(id:string,estoque:number)=>void
  cardapio: any[]

  //list_ids para listagem de itens
  list_ids_boolean?:boolean

}

export interface NumeroProps {
    styles ?: boolean
    number: number;
    pedido_tamanho ?: boolean
  }
export interface pedido_props {
    styles ?: boolean
    id      : string;
    ids      ?:string[]
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
    status?:boolean
    status_chapeiro?:boolean
    status_porcoes?:boolean
    status_bar?:boolean
    onFetchPedidos_Excluir:(id:string)=>void
    onFetchPedidos_Excluir_Mesa:(id:string[])=>void
    //estoque
    pedidos:pedido_inter[]
    cardapio:any[]
    onAtualizar_estoque:(id:string,estoque:number)=>void
    //list_ids para listagem de itens
    list_ids_boolean?:boolean

    celular?:string	
    observacao?:string
  }
export interface user_on{
  id            : string
  image_on      : string
  name_on       : string,
  rua_on         : string,
  numero_on        : number
  token         : string
 
}
 export interface Item {
    id:string
    name_p: string;
    categoria: "comidas" | "bebidas" | "bar";
    categoria_2?: string;
    retirar_p: string[];
    adicionar_p: string[];
    quantidade:number;
    valor_p : number;
    hamburguer?:boolean;
    frances?:boolean;
    sirio?:boolean;
    observacao?:string
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
    celular?:string	
    //
    name_outros?:string
    dinheiro_mesa?:boolean
    pix_mesa?:boolean
    cartao_mesa?:boolean
    status_pao?:boolean
    observacao?:string

  }
 export interface cartao{
    visa:boolean;
    mastercard:boolean;
    elo:boolean
  }
  export interface pedidos_mesa{
    status:false,
    id:string,
    ids:string[],
    numero_mesa:number,
    itens_all: pedido_inter[],
    localidade: "MESA" | "ONLINE" | "OUTROS";

  }

  export interface lista_pedido {
    pedidos_mesa:pedidos_mesa[]
    pedidos_mesa_true:pedidos_mesa[]
    pedidos:pedido_inter[]
    id:string
    ids?:string[]
    numero_mesa:number
    onFitchTotal_valor:(total:number)=>void
    onFitchExcluir_Item:(id:string,item:ItemProps)=>void
    //list_ids para listagem de itens
    list_ids_boolean?:boolean
  }
 
  export interface pedido_itens_comp{
    pedidos:pedido_inter[]
    pedidos_mesa:pedidos_mesa[]
    cardapio:cardapio[]
    users_on:user_on[]
    route: any;
    navigation ?: NavigationProp<any,any>;
    onAtualizarPedido: (id: any) => void;
    onAtualizar_pedido: (id: any) => void;
    onAdicionar_pedido: (id: any) => void;
    onAdicionarPedido: (id: any) => void;
    onAtualizarPedido_Mesa:(ids:string[])=>void
    //pedidos_quantidades
    onPedidos_quantidades: (id:string,number:number) => void,
     //list_ids para listagem de itens
     onAdicionar_list_ids: (ids:string[],id:string) => void,
     //USERS_ON
     onUsers_status_mesa:(id:string)=>void
    
    total:number
    adicionar_pedido:Item[]
    inicial_state_outros:pedido_inter
    inicial_state_mesas:pedido_inter

    onfitch_pedido_mesa_pix_dinheiro_cartao?:(id:string,pix:boolean,dinheiro:boolean,cartao:boolean)=>void
  }