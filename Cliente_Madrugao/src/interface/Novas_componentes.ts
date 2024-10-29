import { NavigationProp } from '@react-navigation/native';
import { Item, Mesas, pedido_inter, user_on } from './inter';
import { cardapio,comments } from './inter_cardapio';

export interface Principal {
    navigation ?: NavigationProp<any,any>;
    route?: any;
    cardapio: cardapio[];
    isModalOpen: boolean;
    user_info?: user_on;
    onorof?: string;
    comments?: string;
    onUpdate_theme: (id:string,theme: boolean) => void;

    //localidade
    onUser_localidade?: (status_mesa:boolean, mesa:number, id_user:string) => void
    //carrinho de compras
    adicionar_itens?: Item[];

    //verificar se tem item 
    pedidos?: pedido_inter[];
    mesas?: Mesas[];


    onRua_numero_celular?: (rua:string,numero:string,celular:string,id:string) => void;

    Resetstate?: () => void;

    //status_call
    onMesa_status_call?: (mesa:number) => void;

    onLogout: (state_logout:boolean) => void;
    //tutorials
    onTutorial_inicial?: (id:string) => void;
    onTutorial : (value:string,status: boolean, id_user: string) => void;
    onTutorial_status : (status:boolean,id_user:string) => void;
    //carrinho pedido para controle dos modais
    alerta?: boolean;
    onSet_carrinho_aviso: (alerta:boolean) => void;

    modal_fechado_aberto?: boolean;
    SetModal_fechado_aberto?: (modal:boolean) => void;
    data_fechado_aberto?: number;
    fechado_aberto?: string;

    expotoken?: string;
    onAtualizar_token: (token:string,id:string) => void;

    user_on?: user_on;
}

export interface Principal_card{
    item: cardapio;
    user_info?: user_on;
    users?: user_on[];
    selectedItem?:number
    index?:number
    styles_dark0rligth?: any;
    isModalOpen: boolean;
    fechado_aberto?: string;

    Update_curtidas: (id:string,curtidas: number) => void;
    Update_curtidas_user: (id:string,curtidas: string,curtidas_array:string[]) => void;
    AddComment: (id:string,comments: commentss2) => void;
    Setmodal: (boolean:boolean) => void;

    SetModal_fechado_aberto?: (modal:boolean) => void;
    //adicionar itens
    adicionar_itens?: Item[];
    Set_add_itens: (itens:Item[]) => void;

    pedido_online?: pedido_inter[];
}
export interface commentss2{
    uid: string;
    comment: string;
    date: Date;
}
export interface Subcategoria{
    user_info?: user_on;
    filters?: string[];
    toggleFilter:(name:string)=>void;
    loading_categoria?:boolean;
    loading_categoria2?:boolean;
}
export interface Principal_card_ultimo_pedido{
    item: pedido_inter;
    user_info?: user_on;
    onSetAdicionar_itens: (itens:Item[]) => void;
    pedido_online?: pedido_inter[];

    SetModal_fechado_aberto?: (modal:boolean) => void;
    fechado_aberto?: string;

    cardapio?: cardapio[];
    
    
}