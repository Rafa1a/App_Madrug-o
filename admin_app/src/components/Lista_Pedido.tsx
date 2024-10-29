import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Item_pedido from './Item_pedido';
import { ItemProps, lista_pedido } from '../interface/inter';
import { fetchExcluir_item, setTotal_Valor } from '../store/action/pedidos';
import { SafeAreaView } from 'react-native-safe-area-context';

const Lista = ({ pedidos, pedidos_mesa, pedidos_mesa_true, id, numero_mesa, ids, list_ids_boolean, onFitchTotal_valor, onFitchExcluir_Item }: lista_pedido) => {

  //procurar e excluir 1 item da lista de pedidos ids de MESA
  const objeto_lista_ids = (item: ItemProps) => {
    const idsArray = ids || [];
    for (const id of idsArray) {
      const pedido_ = pedidos.find((pedido: any) => pedido.id === id);
      const ite: any = pedido_?.itens.find((pedidoItem: any) => {
        return (
          (item.adicionar_p ? pedidoItem.adicionar_p === item.adicionar_p : true) &&
          (item.retirar_p ? pedidoItem.retirar_p === item.retirar_p : true) &&
          pedidoItem.name_p === item.name_p &&
          pedidoItem.quantidade === item.quantidade &&
          pedidoItem.valor_p === item.valor_p
        );
      });
      if (ite) {
        onFitchExcluir_Item(id, ite);
        break; // interrompe o loop assim que um correspondente for encontrado
      }
    }
  };

  // itens pedido online e outros
  const objeto_pedido = pedidos.find((item: any) => item.id === id);

  if (!objeto_pedido || !objeto_pedido.itens) {
    return null; // retorna null se os pedidos nao existir 
  }

  // Itens do pedido da mesa
  const itensPorMesa: { [keys: string]: any[] } = {};

  if (pedidos_mesa || pedidos_mesa_true) {
    if (list_ids_boolean) {
      pedidos_mesa_true.forEach((obj: any) => {
        const numeroMesa = obj.ids.join('');
        const itens = obj.itens_all.flatMap((innerObj: any) => innerObj.itens).reduce((acc: any, cur: any) => acc.concat(cur), []);
        itensPorMesa[numeroMesa] = itens;
      });
    } else {
      pedidos_mesa.forEach((obj: any) => {
        const numeroMesa = obj.numero_mesa;
        const itens = obj.itens_all.flatMap((innerObj: any) => innerObj.itens).reduce((acc: any, cur: any) => acc.concat(cur), []);
        if (itensPorMesa[numeroMesa]) {
          itensPorMesa[numeroMesa].push(itens);
        } else {
          itensPorMesa[numeroMesa] = itens;
        }
      });
    }
  }

  //list_ids para localizar os itens da mesa quando status === true
  const list_ids = pedidos_mesa_true
    .find((pedido: any) => pedido.numero_mesa === numero_mesa && pedido.ids === ids)?.ids.join('');

  //passando os dados correto caso seja mesa
  const mesa_outros_dada = numero_mesa ? (list_ids_boolean ? itensPorMesa[list_ids] : itensPorMesa[numero_mesa]) : objeto_pedido.itens;
  //passando a informacao correta caso seja mesa
  const mesa_outros_excluir = numero_mesa ? true : false;

  //////////////calcular valor total da conta ///////////////////////
  useEffect(() => {
    let total = 0;
    if (mesa_outros_dada) {
      mesa_outros_dada.forEach((item: any) => {
        const quantidade = parseFloat(item.quantidade) || 0; // Converta para número e trate valores ausentes
        const valor_p = parseFloat(item.valor_p) || 0; // Converta para número e trate valores ausentes
        total += quantidade * valor_p;
      });
      // Chame a função onFitchTotal_valor para atualizar o total
      onFitchTotal_valor(parseFloat((total).toFixed(2)));
    }
  }, [mesa_outros_dada, onFitchTotal_valor]);

  // Flat list de itens do Pedido :  1 PEDIDO
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        scrollEnabled={false}
        style={styles.flat}
        data={mesa_outros_dada}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => <Item_pedido {...item} objeto_lista_ids={objeto_lista_ids} mesa={mesa_outros_excluir} list_ids_boolean={list_ids_boolean} />}
        // ItemSeparatorComponent={() => <View style={styles.divider}/>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  divider: {
    borderBottomColor: '#2D2F31',
    borderBottomWidth: 5,
    width: '100%',
  },
  flat: {
    width: "100%"
  }
});

const mapStateProps = ({ pedidos }: { pedidos: any }) => {
  return {
    pedidos: pedidos.pedidos,
    pedidos_mesa: pedidos.pedidos_mesa,
    pedidos_mesa_true: pedidos.pedidos_mesa_true
  };
};

const mapDispatchProps = (dispatch: any) => {
  return {
    onFitchTotal_valor: (total: number) => dispatch(setTotal_Valor(total)),
    onFitchExcluir_Item: (id: any, item: any) => dispatch(fetchExcluir_item(id, item))
  }
}

export default connect(mapStateProps, mapDispatchProps)(Lista);
