import { Avatar, FAB, Icon } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  Alert
} from 'react-native';
import Number from './Number'
import { HeaderPedidoProps } from '../interface/inter';
import { createAndOpenPDF } from '../store/action/html_pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { connect } from 'react-redux';
import { fetchNota_fiscal, fetchaumentar_ref } from '../store/action/pedidos';
const Header_pedido = ({ 
  adicionar, 
  numero_mesa, 
  image_on, 
  pegar_local, 
  rua, 
  numero, 
  dinheiro, 
  cartao, 
  pix, 
  name_on, 
  id, 
  pedidos,
  ids ,
  on_get_notafiscal,
  referencia,
  on_up_ref
}: HeaderPedidoProps) => {
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
  const userormesa = numero_mesa ? (
    <Number number={numero_mesa} pedido_tamanho />
  ) : (
    <Avatar
      size={250}
      rounded
      source={image_on ? { uri: image_on } : undefined}
      icon={
        !image_on
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
    const itens: any = pedidos.find(item => item.id === id)
    return itens.itens
  }

  const ids_pedido = () => {
    const filteredPedidos = pedidos.filter((item: any) => {
      // console.log(item.ids?.includes(id))
      return ids?.includes(item.id);
    });

    // Mapear apenas os itens da lista filtrada
    const allItens = filteredPedidos.flatMap((item) => item.itens);

    return allItens;
  };

  //retorna lista de pedidos tanto de mesa com varios pedidos em um unico numero de mesa ou um pedido de outros ou online
  const [pedido_itens, setPedidoItens] = useState([] as any);

  useEffect(() => {

    const pedido_itens: any = adicionar ? null : numero_mesa ? ids_pedido() : id_pedido();
    setPedidoItens(pedido_itens);

  }, [ids]);

  //array para uso no pdf html
  const array_pdf = [numero_mesa, pegar_local, rua, numero, dinheiro, cartao, pix];

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  
  const current_date = new Date();
  current_date.setHours(current_date.getHours() + 3); // Ajuste o valor conforme necessário

  const nota_fiscal_base:any = {
    cnpj_emitente: "48674355000192",
    data_emissao: current_date.toISOString(),
    natureza_operacao: "VENDA AO CONSUMIDOR",
    presenca_comprador: "1",
    modalidade_frete: "9",
    local_destino: "1",

  }
  const [visible, setVisible] = useState(false);
  const [cpf, setCpf] = useState('');
  const [nota_fiscal, setNotaFiscal] = useState({} as any)
  const [itens, setItens] = useState([] as any)
  const [forma_pagamento, setFormaPagamento] = useState([] as any)
  // forma de pagamento mesa
  const [dinheiro_mesa, setDinheiroMesa] = useState('')
  const [cartao_mesa, setCartaoMesa] = useState({ visa: false, mastercard: false, elo: false })
  const [dinheiro_mesa_icon, setDinheiroMesa_icon] = useState(false)
  const [cartao_mesa_icon, setCartaoMesa_icon] = useState(false)
  const [pix_mesa_icon, setPixMesa_icon] = useState(false)

  useEffect(() => {
    const total = pedido_itens?.reduce((acc: number, item: any) => {
      return acc + item.valor_p * item.quantidade;
    }, 0);

    if(numero_mesa){
      if(dinheiro_mesa_icon){
        setFormaPagamento([
          {  
            forma_pagamento: "01",
            valor_pagamento: parseFloat(dinheiro_mesa) || total
          }
        ])
      }else if(cartao_mesa_icon){
        setFormaPagamento([
          {  
            forma_pagamento: "04",
            valor_pagamento: total,
            bandeira_operadora: cartao_mesa.visa ? "01" : cartao_mesa.mastercard ? "02" : "99"
          }
        ])
      }else {
        setFormaPagamento([
          {  
            forma_pagamento: "01",
            valor_pagamento: total
          }
        ])
      }
      
    }
  }, [dinheiro_mesa,cartao_mesa,pix_mesa_icon])
  // forma de pagamento mesa 
  
  // forma de pagamento outros e online
  useEffect(() => {
    const total = pedido_itens?.reduce((acc: number, item: any) => {
      return acc + item.valor_p * item.quantidade;
    }, 0);
   
      
    if(pedido_itens){  
      ////////////////////////////////////////////////////////////////////////// online e outros
      if(numero_mesa === undefined){ 
        if(dinheiro > 0 || pix){
          setFormaPagamento([
            {  
              forma_pagamento: "01",
              valor_pagamento: pix ? total : dinheiro
            }
          ])
        }else {
          setFormaPagamento([
            {  
              forma_pagamento: "04",
              valor_pagamento: total,
              bandeira_operadora: cartao.visa ? "01" : cartao.mastercard ? "02" : "99"
            }
          ])
        }
      }
      //////////////////////////////////////////////////////////////////////////
      setItens(pedido_itens.map((item: any,index:number) => {

        if(item.categoria_2 === 'lanches' || item.categoria_2 === 'hotdogs'){
          return {
            numero_item: index + 1 ,

            codigo_ncm: "19059090",
  
            codigo_produto: item.id,
            descricao: item.name_p,
  
            quantidade_comercial: item.quantidade, 
            quantidade_tributavel: item.quantidade,
   
            cfop: "5101",
  
            valor_unitario_tributavel: item.valor_p,
            valor_unitario_comercial: item.valor_p,
  
            valor_bruto: item.valor_p * item.quantidade,
  
            unidade_comercial: "un",
            unidade_tributavel: "un",
   
            icms_origem: "0",
            icms_situacao_tributaria: "102",
           
          }
        }
        else if( item.categoria_2 === 'porcoes'){
          return {
            numero_item: index + 1 ,

            codigo_ncm: "21069090", 
  
            codigo_produto: item.id,
            descricao: item.name_p,
  
            quantidade_comercial: item.quantidade, 
            quantidade_tributavel: item.quantidade,
  
            cfop: "5101",
  
            valor_unitario_tributavel: item.valor_p,
            valor_unitario_comercial: item.valor_p,
  
            valor_bruto: item.valor_p * item.quantidade,
  
            unidade_comercial: "un",
            unidade_tributavel: "un",
   
            icms_origem: "0",
            icms_situacao_tributaria: "102",
          }
        }
        else if( item.categoria_2 === 'sucos'){
          return {
            numero_item: index + 1 ,

            codigo_ncm: "20098913", 
  
            codigo_produto: item.id,
            descricao: item.name_p, 
  
            quantidade_comercial: item.quantidade, 
            quantidade_tributavel: item.quantidade,
  
            cfop: "5101",
  
            valor_unitario_tributavel: item.valor_p,
            valor_unitario_comercial: item.valor_p,
  
            valor_bruto: item.valor_p * item.quantidade,
  
            unidade_comercial: "un",
            unidade_tributavel: "un",
   
            icms_origem: "0",
            icms_situacao_tributaria: "102",
          }
        }
        else if( item.categoria_2 === 'drinks'){
          return {
            numero_item: index + 1 ,

            codigo_ncm: "22089000", 
  
            codigo_produto: item.id,
            descricao: item.name_p,
  
            quantidade_comercial: item.quantidade, 
            quantidade_tributavel: item.quantidade,
  
            cfop: "5101",
  
            valor_unitario_tributavel: item.valor_p,
            valor_unitario_comercial: item.valor_p,
  
            valor_bruto: item.valor_p * item.quantidade,
  
            unidade_comercial: "un",
            unidade_tributavel: "un",
   
            icms_origem: "0",
            icms_situacao_tributaria: "102",
          }
        }
        else if( item.categoria_2 === 'alcool'){
          return {
            numero_item: index + 1 ,

            codigo_ncm: "22030000 ", 
  
            codigo_produto: item.id,
            descricao: item.name_p,
  
            quantidade_comercial: item.quantidade, 
            quantidade_tributavel: item.quantidade,
  
            cfop: "5101",
  
            valor_unitario_tributavel: item.valor_p,
            valor_unitario_comercial: item.valor_p,
  
            valor_bruto: item.valor_p * item.quantidade,
  
            unidade_comercial: "un",
            unidade_tributavel: "un",
   
            icms_origem: "0",
            icms_situacao_tributaria: "102",
          }
        }
        else if( item.categoria_2 === 'no-alcool'){
          return {
            numero_item: index + 1 ,

            codigo_ncm: "22021000 ", 
  
            codigo_produto: item.id,
            descricao: item.name_p,
  
            quantidade_comercial: item.quantidade, 
            quantidade_tributavel: item.quantidade,
  
            cfop: "5101",
  
            valor_unitario_tributavel: item.valor_p,
            valor_unitario_comercial: item.valor_p,
  
            valor_bruto: item.valor_p * item.quantidade,
  
            unidade_comercial: "un",
            unidade_tributavel: "un",
   
            icms_origem: "0",
            icms_situacao_tributaria: "102",
          }
        }
      
      }));
    }
  }, [pedido_itens])
  //definir nota fiscal
  useEffect(() => {
    // console.log('forma_pagamento',forma_pagamento)         
    setNotaFiscal({...nota_fiscal_base, itens : itens, formas_pagamento: forma_pagamento})
  }, [itens,forma_pagamento])

  //funcao abrir html pdf
  const createAndOpenPDF_notafiscal = async (html: any) => {
    try {
      const { uri } = await Print.printToFileAsync({ html: html });
  
      // Opção para compartilhar o PDF
      const options = { UTI: '.pdf', mimeType: 'application/pdf' };
      await shareAsync(uri, options);
    } catch (error) {
      Alert.alert('Erro ao criar ou compartilhar o PDF. Entre em contato com o suporte');
    }
  };
  ////////////////////////////////////ENVIO DE NOTA FISCAL COM AXIOS////////////////////////////////////////
  const [loading_nota, setLoadingNota] = useState(false);
  //funcao para salvar cpf na nota fiscal
  const handleSave = () => {
    setVisible(false);
    // Adicione o CPF na nota fiscal
    if(cpf){
      setNotaFiscal({...nota_fiscal, cpf_destinatario: cpf});
    } 
    // enviar nota fiscal com Axios usando autenticacao basic
    // console.log(nota_fiscal)

    // console.log('ref',referencia[0].ref + 1)

    setLoadingNota(true);
    axios.post(`https://api.focusnfe.com.br/v2/nfce?ref=${referencia[0].ref + 1}&token=token`, nota_fiscal, {
      headers: {
        'Content-Type': 'application/json'  
      }
    }).then((response) => {
      // console.log(response.data);
      if(response.data.status === 'erro_autorizacao'){
        setLoadingNota(false);
        Alert.alert('Nota fiscal Enviada, porém deu o erro :', response.data.mensagem_sefaz);
        // createAndOpenPDF_notafiscal(``);
      }else {
        // Alert.alert('Nota fiscal Enviada', response.data.status);
        axios.get(`https://api.focusnfe.com.br${response.data.caminho_danfe}`, {
          headers: {
            'Content-Type': 'application/json'
          }
          }).then(async(response) => {
            // console.log(response.data);
            createAndOpenPDF_notafiscal(response.data);
            await on_up_ref(referencia[0].id, referencia[0].ref)
            setLoadingNota(false);


          }).catch((error) => {
            // console.log(error);
            setLoadingNota(false);
            Alert.alert('Erro ao fazer a busca no sefaz da nota', error.message);
          });
      }
    }).catch((error) => {
      // console.log(error);
      setLoadingNota(false);
      Alert.alert('Erro ao emitir a nota fiscal', error.message);
    });
 
  }
   
  useEffect(() => {
    const fetchNota_fiscal = async () => {
      // console.log('rafael')
      await on_get_notafiscal();
    }
    fetchNota_fiscal();  
  }, [])

  useEffect(() => {
    // console.log('ref',referencia[0].ref)
  }, [referencia])

  ///////////////////////////////////////////////////////////////////////////////////////
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.textuser}>User :</Text>
        {adicionar ? null :
          <FAB
            loading={loading}
            onPress={() => handlePress(pedido_itens, array_pdf)}
            visible={true}
            icon={{ name: 'print', color: '#d6cecd' }}
            size="large"
            color='#3C4043'
            style={{ borderColor: '#7FD4F5', borderWidth: 1, elevation: 15, shadowColor: 'tomato' }}
          />}
          {adicionar ? null :
          <FAB
            loading={loading_nota}
            onPress={() => setVisible(true)}
            visible={true}
            icon={<MaterialCommunityIcons name="cloud-print-outline" size={24} color="white" />}
            size="large"
            color='#3C4043'
            style={{ borderColor: 'tomato', borderWidth: 1, elevation: 15, shadowColor: 'tomato' }}
          />}
      </View>
      {userormesa}
      <Text style={styles.text}>{name_on}</Text> 
      <View style={styles.container_info}>

        {rua || numero || pegar_local ?
          <>
            <Text style={styles.highlightText}>Entrega :</Text>
          </>
          : null}
        {rua ? (
          <Text style={styles.text_pagamento}>Rua: {rua}</Text>
        ) : null}

        {numero ? (
          <Text style={styles.text_pagamento}>Numero: {numero}</Text>
        ) : null}

        {pegar_local ? (
          <Text style={styles.text_pagamento}>Pegar no Local</Text>
        ) : null}

        {/* forma de pagamento */}
        {dinheiro || cartao || pix ?
          <>
            <View style={styles.divider} />
            <Text style={styles.highlightText}>Forma de Pagamento :</Text>
          </>
          : null}

        {/* dinheiro */}
        {dinheiro ? (
          <Text style={styles.text_pagamento}>Dinheiro: ${dinheiro}</Text>
        ) : null}

        {/* cartao */}
        {cartao ?
          <>
            {cartao.visa ?
              <Text style={styles.text_pagamento}>Cartão: Visa</Text> : null}
            {cartao.mastercard ? <Text style={styles.text_pagamento}>Cartão: Mastercard</Text> : null}
            {cartao.elo ? <Text style={styles.text_pagamento}>Cartão: Elo</Text> : null}
          </>
          : null}

        {/* PIX */}
        {pix ? (
          <Text style={styles.text_pagamento}>Pix</Text>
        ) : null}
      </View>

      <View style={styles.divider} />
      
      {/* modal nota fical input cpf na nota? e 2 buttons de salvar e cancelar */}
        <Modal 
          visible={visible} 
          onRequestClose={() => setVisible(false)} 
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Deseja adicionar CPF na Nota Fiscal?</Text>
              <TextInput
                style={styles.input}
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                maxLength={11}
              />
              {numero_mesa ?
              <>
                <Text style={styles.modalText}>Forma de Pagamento</Text>
                
                <View style={[styles.modalButtons,{marginTop:20,marginBottom:20}]}>

                  <FontAwesome5 name="money-bill-wave" size={dinheiro_mesa_icon?25:20} color={dinheiro_mesa_icon?'green':'black'}
                    onPress={() => {
                        setDinheiroMesa_icon(true)
                        setCartaoMesa_icon(false)
                        setPixMesa_icon(false)
                      }} 
                  />
                  <AntDesign name="creditcard" size={cartao_mesa_icon?28:20} color={cartao_mesa_icon?'green':'black'} 
                    onPress={() => {
                      setDinheiroMesa_icon(false)
                      setCartaoMesa_icon(true)
                      setPixMesa_icon(false)
                    }}
                  />
                  <MaterialCommunityIcons name="bank-transfer" size={pix_mesa_icon?30:20} color={pix_mesa_icon?'green':'black'}
                    onPress={() => {
                      setDinheiroMesa_icon(false)
                      setCartaoMesa_icon(false)
                      setPixMesa_icon(true)
                    
                    }}
                  />
                  
                
                </View>
                <View style={styles.modalButtons}>
                
                {dinheiro_mesa_icon?
                  <TextInput
                    style={styles.input}
                    placeholder="Dinheiro"
                    value={dinheiro_mesa}
                    onChangeText={(value) => setDinheiroMesa(value)}
                    keyboardType="numeric"
                    maxLength={11}
                  />:
                  cartao_mesa_icon?
                  <View style={styles.modalButtons}>
                      <TouchableOpacity 
                          style={[
                              { margin: 10, padding: 10, borderRadius: 5 },
                              cartao_mesa.visa ? { backgroundColor: 'blue' } : { backgroundColor: 'lightgray' }
                          ]}
                          onPress={() => setCartaoMesa({visa: true, mastercard: false, elo: false})}
                      >
                          <Text style={{ fontSize: 18, color: 'white' }}>Visa</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                          style={[
                              { margin: 10, padding: 10, borderRadius: 5 },
                              cartao_mesa.mastercard ? { backgroundColor: 'red' } : { backgroundColor: 'lightgray' }
                          ]}
                          onPress={() => setCartaoMesa({visa: false, mastercard: true, elo: false})}
                      >
                          <Text style={{ fontSize: 18, color: 'white' }}>Mastercard</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                          style={[
                              { margin: 10, padding: 10, borderRadius: 5 },
                              cartao_mesa.elo ? { backgroundColor: 'green' } : { backgroundColor: 'lightgray' }
                          ]}
                          onPress={() => setCartaoMesa({visa: false, mastercard: false, elo: true})}
                      >
                          <Text style={{ fontSize: 18, color: 'white' }}>Elo</Text>
                      </TouchableOpacity>
                  </View>:
                  null}

                </View>
              </>:null}

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setVisible(false)} />
                <Button title="Salvar" onPress={handleSave} />
              </View>
            </View>
          </View>
        </Modal>
          
    </SafeAreaView>
  );
}

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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#F4F7FC',
    borderRadius: 10,
  },
  modalText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#252A32',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#252A32',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  
});

const mapStateProps = ({ pedidos }: { pedidos: any }) => {
  return {
    pedidos: pedidos.pedidos,
    referencia: pedidos.referencia
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    on_get_notafiscal: () => dispatch(fetchNota_fiscal()),
    on_up_ref: (id:any, ref:number) => dispatch(fetchaumentar_ref(id, ref))
  };
}
export default connect(mapStateProps,mapDispatchProps)(Header_pedido);
