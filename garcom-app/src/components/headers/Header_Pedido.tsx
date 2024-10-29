import { Avatar, FAB, Icon } from '@rneui/themed';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  SafeAreaView
} from 'react-native';
import Number from '../Number';
import { HeaderPedidoProps } from '../../interface/inter';
import { createAndOpenPDF } from '../../store/action/html_pdf';
import { connect } from 'react-redux';

const Header_pedido = (props: HeaderPedidoProps) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async (pedido_itens, array_pdf) => {
    try {
      setLoading(true);

      // Sua lógica de impressão e compartilhamento aqui
      await createAndOpenPDF(pedido_itens, array_pdf);

      // Simulando uma operação assíncrona
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Após a conclusão bem-sucedida, você pode redefinir o estado de carregamento
      setLoading(false);
    } catch (error) {
      // Lida com erros, se houver
      setLoading(false);
    }
  };

  // condicao para definir avatar ou numero da mesa para mostrar no header
  const userormesa = props.numero_mesa ? (
    <Number number={props.numero_mesa} pedido_tamanho />
  ) : (
    <Avatar
      size={250}
      rounded
      source={props.image_on ? { uri: props.image_on } : undefined}
      icon={
        !props.image_on
          ? { name: 'account-circle', type: 'material-icons', color: '#E8F0FE' }
          : undefined
      }
      containerStyle={{
        width: 150,
        height: 150,
        margin: 10,
      }}
    />
  );

  //funcao para retornar id e ids de pedidos 
  const id_pedido = () => {
    const itens: any = props.pedidos.find(item => item.id === props.id);
    return itens.itens;
  };

  const ids_pedido = () => {
    const filteredPedidos = props.pedidos.filter((item: any) => {
      return props.ids?.includes(item.id);
    });

    // Mapear apenas os itens da lista filtrada
    const allItens = filteredPedidos.flatMap((item) => item.itens);

    return allItens;
  };

  //retorna lista de pedidos tanto de mesa com varios pedidos em um unico numero de mesa ou um pedido de outros ou online
  const pedido_itens = props.adicionar ? null : props.numero_mesa ? ids_pedido() : id_pedido();

  //array para uso no pdf html
  const array_pdf = [props.numero_mesa, props.pegar_local, props.rua, props.numero, props.dinheiro, props.cartao, props.pix,props.name_on];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.textuser}>User :</Text>
        {props.adicionar ? null : props.chapeiro_bar_porcoes ? null :
          <FAB
            loading={loading}
            onPress={() => handlePress(pedido_itens, array_pdf)}
            visible={true}
            icon={{ name: 'print', color: '#d6cecd' }}
            size="large"
            color='#3C4043'
            style={{ borderColor: 'tomato', borderWidth: 1, elevation: 15, shadowColor: 'tomato' }}
          />}
      </View>
      {userormesa}
      <Text style={styles.text}>{props.name_on}</Text>
      <View style={styles.container_info}>

        {props.rua || props.numero || props.pegar_local ?
          <>
            <Text style={styles.highlightText}>Entrega :</Text>
          </>
          : null}
        {props.rua ? (
          <Text style={styles.text_pagamento}>Rua: {props.rua}</Text>
        ) : null}

        {props.numero ? (
          <Text style={styles.text_pagamento}>Numero: {props.numero}</Text>
        ) : null}

        {props.pegar_local ? (
          <Text style={styles.text_pagamento}>Pegar no Local</Text>
        ) : null}

        {/* forma de pagamento */}
        {props.dinheiro || props.cartao || props.pix ?
          <>
            <View style={styles.divider} />
            <Text style={styles.highlightText}>Forma de Pagamento :</Text>
          </>
          : null}

        {/* dinheiro */}
        {props.dinheiro ? (
          <Text style={styles.text_pagamento}>Dinheiro: ${props.dinheiro}</Text>
        ) : null}

        {/* cartao */}
        {props.cartao ?
          <>
            {props.cartao.visa ?
              <Text style={styles.text_pagamento}>Cartão: Visa</Text> : null}
            {props.cartao.mastercard ? <Text style={styles.text_pagamento}>Cartão: Mastercard</Text> : null}
            {props.cartao.elo ? <Text style={styles.text_pagamento}>Cartão: Elo</Text> : null}
          </>
          : null}

        {/* PIX */}
        {props.pix ? (
          <Text style={styles.text_pagamento}>Pix</Text>
        ) : null}
      </View>

      <View style={styles.divider} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  textuser: {
    fontFamily: 'OpenSans-Bold',
    color: '#F4F7FC',
    fontSize: 35,
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC',
    fontSize: 20,
  },
  text1: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC',
    fontSize: 20,
  },
  text2: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC',
    fontSize: 20,
    textAlign: 'right',
  },
  divider: {
    width: '100%',
    borderBottomColor: '#F4F7FC',
    borderBottomWidth: 2,
  },
  highlightText: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC', // ou qualquer outra cor de destaque desejada
    fontSize: 25,
  },
  text_pagamento: {
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC', // ou qualquer outra cor de destaque desejada
    fontSize: 20,
  },
  container_info: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
const mapStateProps = ({ pedidos }: { pedidos: any }) => {
  return {
    pedidos: pedidos.pedidos
  };
};

export default connect(mapStateProps)(Header_pedido);
