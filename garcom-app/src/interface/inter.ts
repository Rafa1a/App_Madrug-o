import { NavigationProp } from "@react-navigation/native";
import { cardapio } from "./inter_cardapio";
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
  chapeiro_bar_porcoes?:boolean

}
export interface HeaderPedidosProps {
  mesa?: boolean;
  call?:boolean;
  entrega?:boolean;
  navigation ?: NavigationProp<any,any>;
  mesas:[],
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

  //entrega
  chapeiro_bar_porcoes?:boolean

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
    onFetchPedidos_Excluir_Mesa?:(id:string[])=>void
    //call funcoes
    user_call?:boolean
    users?:user_fun[];
    onUpMesa_user_call?:(id:string)=>void
    onUpUser_call?:(id:string,number:number)=>void
    setIdstate?:(state:string)=>void
    user_login?:user_fun
    //entrega funcoes
    chapeiro?:boolean
    porcoes?:boolean
    drinks?:boolean
    state_click?:string[]
    setState_click?:(state_click:string[])=>void
    state_all_array?: pedido_inter[];
    //estoque
    pedidos?:pedido_inter[]
    cardapio?:any[]
    onAtualizar_estoque?:(id:string,estoque:number)=>void

    //list_ids para listagem de itens
    list_ids_bolean?:boolean


    
  }
export interface user_fun{
  id:string;
  opcoes?:boolean;
  quantidade?:number;
  image_fun?:string;
  name_func:string;
  uid?:string;
  call:number;
  chapeiro?:string[]
  bar?:string[]
  bebidas?:string[]
  porcoes?:string[]
  entregando?:string[]

  token?:string
}
 export interface Item {
    id:string
    name_p: string;
    categoria: "comidas" | "bebidas" | "bar";
    categoria_2?: "lanches" | "hotdogs" | "porcoes" | "combos" ;
    retirar_p: string[];
    adicionar_p: string[];
    quantidade:number;
    valor_p : number;
    hamburguer?:boolean
    frances?:boolean
    sirio?:boolean
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
    //lista de ids
    list_ids:string[]
    //solucao para bebidas
    array_bebidas?:String[]
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
    id?:string
    ids?:string[]
    numero_mesa:number
    onFitchTotal_valor:(total:number)=>void
    onFitchExcluir_Item:(id:string,item:ItemProps)=>void
    //entrega de pedido
    chapeiro_bar_porcoes?:boolean
    chapeiro_bar_porcoes_itens?:pedido_inter[]
    //list_ids para listagem de itens
    list_ids_bolean?:boolean
  }
 
  export interface pedido_itens_comp{
    pedidos:pedido_inter[]
    cardapio:cardapio[]
    pedidos_mesa:pedidos_mesa[]
    route: any;
    navigation ?: NavigationProp<any,any>;
    onAtualizarPedido: (id: any) => void;
    onAtualizar_pedido: (id: any) => void;
    onAdicionar_pedido: (id: any) => void;
    onAdicionarPedido: (id: any) => void;
    onPedidos_ordem: () => void;
    onAtualizarPedido_Mesa:(ids:string[])=>void
    onPedidos_quantidades: (id:string,number:number) => void;
    //atualziar mesa
    onUsers_status_mesa: (numero_mesa:number) => void;
    //list_ids para listagem de itens
    onAdicionar_list_ids: (ids:string[],id:string) => void,

    total:number
    adicionar_pedido:Item[]
    inicial_state_mesas:pedido_inter

    maior_ordem:number


  }

  export interface Mesas {
    id:string;
    numero_mesa:number;
    status_call:boolean
    status_user_call:boolean
  }