import { NavigationProp } from "@react-navigation/native";
import { pedido_inter } from "./inter";

export interface cardapio {
    id:string
    id_pedido:string[]
    adicionais?: string[];
    categoria: string;
    categoria_2: string;
    categoria_3?: string;
    comments: string[];
    curtidas: number;
    image: string;
    ingredientes: string[];
    name: string;
    onorof: boolean;
    valor: number;
    estoque?:number;
}

export interface estoque_screen{
    cardapio:cardapio[];
    onAtualizar_onorof: (id: any, onorof: any) => void;
    onAtualizar_estoque: (id: any, estoque: number) => void;
    navigation ?: NavigationProp<any,any>;
    fechado_aberto?:{
        fechado_aberto: string;
        data_fechado_aberto: number;
        id: string;
    }
    onFechar_abrir?: (id:string,fechado_aberto:any,data_fechado_aberto:any) => void;
    paes?:{
        hamburguer: number;
        frances: number;
        sirio: number;
        id: string;
    }
    UpdatePaes?: (hamburguer: number,frances:number,sirio:number,id:string) => void;
    pedidos?:pedido_inter[];
    upStatus_paes?: (id:string) => void;
}
export interface estoque_comp {
    estoque?: number;
    estoq?: boolean;
    name: string;
    categoria_3?: string;
    onorof: boolean;
    id: any;
    onAtualizar_onorof: (id: any, onorof: boolean) => void;
    onAtualizar_estoque: (id: any, estoque: number) => void;

    cardapio?:cardapio[];
}