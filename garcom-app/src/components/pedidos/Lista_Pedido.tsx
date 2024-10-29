import React from 'react';
import { FlatList,  StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Item_pedido from './Item_pedido';
import { ItemProps, lista_pedido } from '../../interface/inter';
import { fetchExcluir_item, setTotal_Valor } from '../../store/action/pedidos';
import { SafeAreaView } from 'react-native-safe-area-context';

class Lista extends React.Component<lista_pedido> {
  //procurar e excluir 1 item da lista de pedidos ids de MESA 
  ///////////////////////////DESUSO///////////////////////////
  // objeto_lista_ids = (item:ItemProps) => {
  //   // console.log(item.adicionar_p)
  //   const ids = this.props.ids || [];
  //   for (const id of ids) {
  //     const pedido_ = this.props.pedidos.find((pedido: any) => pedido.id === id);
  //     // console.log(pedido_.itens)
      
  //       const ite:any = pedido_?.itens.find((pedidoItem: any,i) => {
       
  //         return (
  //           item.adicionar_p? pedidoItem.adicionar_p === item.adicionar_p :true &&
  //           item.retirar_p? pedidoItem.retirar_p === item.retirar_p :true &&
  //           pedidoItem.name_p === item.name_p &&
  //           pedidoItem.quantidade === item.quantidade &&
  //           pedidoItem.valor_p === item.valor_p
  //         );
          
  //       });
        
  //       if (ite) {
  //         // console.log(ite)
  //         this.props.onFitchExcluir_Item(id,ite)

  //         break; // interrompe o loop assim que um correspondente for encontrado
  //     }
     
  //   }
  // }
  // funcaotest = (a:any) =>{console.log(a)}
  render() {
    // itens pedido online e outros
    const objeto_pedido = this.props.pedidos.find((item: any) => item.id === this.props.id);

    // Itens do pedido da mesa
    const itensPorMesa: { [keys: string]: any[] } = {};

    if (this.props.pedidos_mesa || this.props.pedidos_mesa_true) {
        this.props.list_ids_bolean?
        this.props.pedidos_mesa_true.forEach((obj: any) => {
          const numeroMesa = obj.ids.join('');
          const itens = obj.itens_all.flatMap((innerObj: any) => innerObj.itens).reduce((acc: any, cur: any) => acc.concat(cur), []);
            itensPorMesa[numeroMesa] = itens;
        }
        ):
        this.props.pedidos_mesa.forEach((obj: any) => {
            const numeroMesa = obj.numero_mesa;
            const itens = obj.itens_all.flatMap((innerObj: any) => innerObj.itens).reduce((acc: any, cur: any) => acc.concat(cur), []);

            if (itensPorMesa[numeroMesa]) {
                itensPorMesa[numeroMesa].push(itens);
            } else {
                itensPorMesa[numeroMesa] = itens;
            }
        }
        );
    }
    //list_ids para localizar os itens da mesa quando status === true
    const list_ids = this.props.pedidos_mesa_true
      .find((pedido: any) => pedido.numero_mesa === this.props.numero_mesa && pedido.ids === this.props.ids)?.ids.join('');

    // console.log(list_ids)
    // Pedidos para entrega 
    // const pedidos_entrega = this.props.pedidos.filter(itens => {
    //   return this.props.ids.some(id => itens.id === id);
    // });
    
    // Usando flatMap para obter um único array de itens
    const itens_entrega = this.props.chapeiro_bar_porcoes_itens?.flatMap(itens => itens.itens);
    
    // console.log(itens_entrega);
    // console.log(itens_entrega)
    // console.log(itensPorMesa[this.props.numero_mesa]);
    
    //passando os dados correto caso seja mesa
    const mesa_outros_dada = (this.props.numero_mesa? 
    (this.props.chapeiro_bar_porcoes ? itens_entrega : 
      (this.props.list_ids_bolean?itensPorMesa[list_ids]:itensPorMesa[this.props.numero_mesa])
      )
    :objeto_pedido?.itens)
    //passando a informacao correta caso seja mesa
    const mesa_outros_excluir = this.props.numero_mesa? true : false

   //////////////calcular valor total da conta ///////////////////////
    let total = 0;
    if (mesa_outros_dada) {
      mesa_outros_dada.forEach((item: any) => {
        const quantidade = parseFloat(item.quantidade) || 0; // Converta para número e trate valores ausentes
        const valor_p = parseFloat(item.valor_p) || 0; // Converta para número e trate valores ausentes
        total += quantidade * valor_p;
      });
    // Chame a função onFitchTotal_valor para atualizar o total
      this.props.onFitchTotal_valor(parseFloat((total).toFixed(2)));

    }  
    // console.log(total)
    // console.log(this.props.pedidos_mesa)
    // console.log(this.props.ids)

    // Flat list de itens do Pedido :  1 PEDIDO
    return (
      <SafeAreaView style={styles.container}>
        
        <FlatList
          scrollEnabled={false}
          style={styles.flat}
          data={mesa_outros_dada}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) =><Item_pedido {...item}  mesa={mesa_outros_excluir} />}
          // ItemSeparatorComponent={() => <View style={styles.divider}/>}
        />
      
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    width:"100%"
    
  },divider: {
    borderBottomColor: '#2D2F31',
    borderBottomWidth: 5,
    width: '100%',
},
flat :{
  width:"100%"
}
});

const mapStateProps = ({ pedidos }: { pedidos: any}) => {
  return {
    pedidos: pedidos.pedidos,
    pedidos_mesa:pedidos.pedidos_mesa,
    pedidos_mesa_true:pedidos.pedidos_mesa_true
  };
};
const mapDispatchProps = (dispatch :any) => {
  return {
      onFitchTotal_valor: (total:number) =>dispatch(setTotal_Valor(total)),
      onFitchExcluir_Item: (id:any,item:any) => dispatch(fetchExcluir_item(id,item))
  }
}
export default connect(mapStateProps,mapDispatchProps)(Lista);
