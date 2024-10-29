import React, { useEffect } from 'react';
import {
  Alert,
} from 'react-native';
import Indice from "./routes/index"
import { message } from './interface/inter_actions';
import { connect } from 'react-redux';
import { setMessage } from './store/action/message';
import { fetchatualizar_cardapio_estoque_auto } from './store/action/cardapio';
import { pedido_inter } from './interface/inter';
import { cardapio } from './interface/inter_cardapio';
//definindo interface do app base
interface Props extends message {
  clearMessage: () => void;
  onAtualizar_estoque: (id:string,estoque:number,id_pedido:string) => void;
  pedidos:pedido_inter[]
  cardapio:cardapio[];

}

const App = (props:Props) => {
  
//tratamento de excecoes
  useEffect(() => {
    if (props.text && props.text.toString().trim()) {
      Alert.alert(props.title.toString() || "Mensagem", props.text.toString());
      props.clearMessage();
    }
  }, [props.text, props.title]);
 
  //atualizar estoque automaticamente
  useEffect(() => {
    if(props.pedidos!==undefined && props.cardapio!==undefined){
      const pedidosTrue = props.pedidos.filter(item => item.status === true);
  
      const bebidasPedidos_ids = pedidosTrue.map(pedido => {
        const bebidas = pedido.itens.filter(item => item.categoria === 'bebidas');
        const id_pedido = pedido.id;
        return { id_pedido, temBebidas: bebidas.length > 0, ids: bebidas.map(item => item.id), bebida_quantidade: bebidas.map(item => item.quantidade) };
      });
      // console.log(bebidasPedidos_ids)
      bebidasPedidos_ids.forEach((bebida:any) => {
        bebida.ids.forEach( (id:any, index:number) => {
          const cardapioIndex = props.cardapio.findIndex(item => item.id === id);
    
          if (cardapioIndex !== -1) {
            // Verificar se o id_pedido já existe no cardapio.id_pedido
            const id_pedido_existe = props.cardapio[cardapioIndex].id_pedido
            ? props.cardapio[cardapioIndex].id_pedido.some((id_pedido:any) => bebida.id_pedido.includes(id_pedido))
            : null;
           
    
            if (!id_pedido_existe) {
              const newarray = props.cardapio;
              const estoque_cardapio:any = newarray[cardapioIndex].estoque;
              const quantidade_bebida = bebida.bebida_quantidade[index];
              const newEstoque = estoque_cardapio - quantidade_bebida;
              
              // Chame a função para atualizar o estoque no cardápio
              props.onAtualizar_estoque(id, newEstoque, bebida.id_pedido);
            }
          }  
        });    
      }); 
    }
   
  }, [props.pedidos]);
  return <Indice />;
};

const mapStateToProps = ({ message,cardapio,pedidos }: { message: message,cardapio:any,pedidos:any }) => {
  return {
    title: message.title,
    text: message.text,
    cardapio:cardapio.cardapio,
    pedidos:pedidos.pedidos
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearMessage: () => dispatch(setMessage({ title: '', text: '' })),
    onAtualizar_estoque:(id:string,estoque:number,id_pedido:any)=>dispatch(fetchatualizar_cardapio_estoque_auto(id,estoque,id_pedido))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
