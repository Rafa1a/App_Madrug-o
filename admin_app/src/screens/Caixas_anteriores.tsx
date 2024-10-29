import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
    FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { controle_caixa_get } from '../store/action/message_fechado_aberto';
import { NavigationProp } from '@react-navigation/native';
import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';

interface caixas_anteriores {
        id              : string,
        data_abertura   : number,
        data_fechamento : number,
        abertura        : number,
        total           : number,
        lucro           : number,
        dinheiro_caixa  : boolean,
        cartao_caixa    : boolean,
        pix_caixa       : boolean,
        pedidos : []
}
interface Props {
    navigation: NavigationProp<any>;
    route: any;
    abertura_valor:number;
    caixas_anteriores:caixas_anteriores[];
    onControle_caixa_get:()=>void;

}
 const Caixas_anteriores = (props: Props) => {
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        const asynccaixas = async () => {
            setLoading(true)
            await props.onControle_caixa_get()
            setLoading(false)
        }
        asynccaixas()
    },[]);

    if (loading) {
        return <Text  style={{color:'white'}}>Loading...</Text>;
    }
  //pdf dos caixas 
  const createAndOpenPDF = async (html:any) => {
    try {
    const { uri } = await Print.printToFileAsync({ html: html });

      // Opção para compartilhar o PDF
      const options = { UTI: '.pdf', mimeType: 'application/pdf' };
      await shareAsync(uri, options);
    } catch (error) {
      Alert.alert('Erro ao criar ou compartilhar o PDF. Entre em contato com o suporte');
    }
  };
  const Html_caixas_anteriores = () => {
    const caixa = props.caixas_anteriores.map((item) => {
      return `
        <tr>
          <td>${new Date(item.data_abertura).toLocaleString()}</td>
          <td>${new Date(item.data_fechamento).toLocaleString()}</td>
          <td>${item.abertura}</td>
          <td>${item.cartao_caixa}</td>
          <td>${item.pix_caixa}</td>
          <td>${item.dinheiro_caixa}</td>
          <td>${item.lucro}</td> 
          <td>${item.total}</td>
        </tr>`
    });
  return `
  <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Relatório de Caixas Anteriores</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
              }
              th {
                  background-color: #f2f2f2;
              }
          </style>
      </head>
      <body>

      <h2>Relatório de Caixas Anteriores</h2>

      <table>
          <thead>
              <tr>
                  <th>Data de Abertura</th>
                  <th>Data de Fechamento</th>
                  <th>Abertura</th>
                  <th>Cartão no Caixa</th>
                  <th>PIX no Caixa</th>
                  <th>Dinheiro no Caixa</th>
                  <th>Lucro</th>
                  <th>Total</th>
              </tr>
          </thead>
          <tbody>
              ${caixa}
          </tbody>
      </table>

      </body>
      </html>
      `
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* button de imprimir pdf de caixas anteriores */}
      <TouchableOpacity
        onPress={() => createAndOpenPDF(Html_caixas_anteriores())}
        style={{backgroundColor:'#F4F7FC', padding:10, width:'45%', borderRadius:5}}
      >
        <Text style={{color:'#252A32', fontSize:20, textAlign:'center'}}>Imprimir PDF</Text>
      </TouchableOpacity>
      
        <FlatList
            data={props.caixas_anteriores.sort((a, b) => new Date(b.data_fechamento).getTime() - new Date(a.data_fechamento).getTime())}
            renderItem={({ item }) => (
                <TouchableOpacity style={{flexDirection:'column', justifyContent: 'space-between', backgroundColor: '#333', padding: 10, marginVertical: 5, borderRadius: 5}}
                    onPress={() => props.navigation.navigate('Caixa',{
                        data_abertura:item.data_abertura,
                        data_fechamento:item.data_fechamento,
                        abertura:item.abertura,
                        total:item.total,
                        lucro:item.lucro,
                        dinheiro_caixa:item.dinheiro_caixa,
                        cartao_caixa:item.cartao_caixa,
                        pix_caixa:item.pix_caixa,
                        pedidos:item.pedidos
                    })}
                >
                    <Text style={{color:'white', fontSize: 16}}>Abertura : {new Date(item.data_abertura).toLocaleString()}</Text>
                    <Text style={{color:'white', fontSize: 16}}>Fechamento : {new Date(item.data_fechamento).toLocaleString()}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
        />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#202124',
      },
});

const mapStateProps = ({pedidos,message ,fechado_abertura}: {pedidos:any,message:any,fechado_abertura:any }) => {
    return {
      abertura_valor: fechado_abertura.abertura_valor,
      caixas_anteriores: fechado_abertura.caixas_anteriores

    };
  };
  const mapDispatchProps = (dispatch: any) => {
    return {
        onControle_caixa_get:()=>dispatch(controle_caixa_get())
    };
  };
  
export default connect(mapStateProps,mapDispatchProps)(Caixas_anteriores);