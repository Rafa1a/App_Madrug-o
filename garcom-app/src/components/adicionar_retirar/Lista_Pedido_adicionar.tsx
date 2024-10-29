import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Item_pedido from '../pedidos/Item_pedido';
import { fetchExcluir_item, setTotal_Valor } from '../../store/action/pedidos';
import { lista_pedido_adicionar } from '../../interface/inter_adicionar';
import { setAdicionar_pedido } from '../../store/action/adicionar_pedido';
import { SafeAreaView } from 'react-native-safe-area-context';

const Lista = ({ adicionar_pedido, onFitchTotal_valor, onFitchExcluir_Item, onAdicionar_pedido }) => {
  //////////////calcular valor total da conta ///////////////////////
  useEffect(() => {
    let total = 0;
    if (adicionar_pedido) {
      adicionar_pedido.forEach((item) => {
        const quantidade = parseFloat(item.quantidade) || 0; // Converta para número e trate valores ausentes
        const valor_p = parseFloat(item.valor_p) || 0; // Converta para número e trate valores ausentes
        total += quantidade * valor_p;
      });
      // Chame a função onFitchTotal_valor para atualizar o total
      onFitchTotal_valor(parseFloat((total).toFixed(2)));
    }
  }, [adicionar_pedido, onFitchTotal_valor]);

  // Flat list de itens do Pedido: 1 PEDIDO
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        scrollEnabled={false}
        style={styles.flat}
        data={adicionar_pedido}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => <Item_pedido {...item}
          //funcoes para deletar um item
          adicionar_pedido={adicionar_pedido}
          onAdicionar_pedido={onAdicionar_pedido}
          deleteitem />}
        // ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  }, divider: {
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
    adicionar_pedido: pedidos.adicionar_pedido
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onFitchTotal_valor: (total: number) => dispatch(setTotal_Valor(total)),
    onFitchExcluir_Item: (id: any, item: any) => dispatch(fetchExcluir_item(id, item)),
    onAdicionar_pedido: (pedido: []) => dispatch(setAdicionar_pedido(pedido)),
  };
};

export default connect(mapStateProps, mapDispatchProps)(Lista);
