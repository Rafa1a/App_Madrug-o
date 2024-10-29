import { Timestamp } from "firebase/firestore";

export interface cardapio {
    id:string
    id_pedido:string[]
    adicionais?: adicionais[];
    categoria: string;
    categoria_2: string;
    categoria_3?: string;
    comments: comments[];

    curtidas: number;
    pedidos_quantidade: number;
    
    image: string;
    ingredientes: string[];
    name: string;
    onorof: boolean;
    valor: number;
    estoque?:number;

    versao?:string
}
interface adicionais {
    name: string;
    valor: number;
}
export interface comments{
    uid: string;
    comment: string;
    date: Timestamp;
}
export interface estoque_screen{
    cardapio:cardapio[];
    onAtualizar_onorof: (id: any, onorof: any) => void;
    onAtualizar_estoque: (id: any, estoque: number) => void;
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
}