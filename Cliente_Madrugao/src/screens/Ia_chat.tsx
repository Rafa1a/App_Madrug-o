import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity, 
  
} from 'react-native';
import IaChats from '../IA/codigos/Chat_ia';
import { connect } from 'react-redux';
import { cardapio } from '../interface/inter_cardapio';
import {prompt_ia_on} from '../IA/prompts/prompts_ia_on';
import {prompts_ia_mesa} from '../IA/prompts/prompts_ia_mesa'
import {IA_1_on_mesa} from '../IA/prompts/Ia#1_on_mesa';
import {IA_2_on_mesa} from '../IA/prompts/IA#2_on_mesa';
import Ia_generete from '../IA/codigos/IA_generete';
import { Item, user_on } from '../interface/inter';
import { setAdicionar_itens } from '../store/action/adicionar_pedido';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  cardapio: cardapio[];
  user_info: user_on;
  adicionar_pedido:Item[];
  Set_add_itens:(itens:Item[]) => void;
  navigation: NavigationProp<any>;
}

const IaChat = (props:Props) => {
  const [messages, setMessages] = useState<
    { role: 'user' | 'model'; parts: { text: string }[] }[]
  >([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  // cardapio chat ia
  const [cardapio_chat_ia_on, setcardapio_chat_ia_on] = useState(prompt_ia_on);
  const [cardapio_chat_ia_mesa, setcardapio_chat_ia_mesa] = useState(prompts_ia_mesa);
  const [ia_generate_1, setIa_generate_1] = useState(IA_1_on_mesa);
  const [ia_generate_2, setIa_generate_2] = useState(IA_2_on_mesa);
  // loadings
  const [loading, setLoading] = useState(false);
  // mensagem caso nao tenha finalizado corretamente
  const [mensagem, setMensagem] = useState(false);
  // audio
  const [recording, setRecording] = useState<any>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [urirecording, setUrirecording] = useState('');

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }
  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    setUrirecording(uri);
    
    // console.log('Recording stopped and stored at', uri);
  }

  useEffect( () => {
     // Estrutura base para o cardápio:
    // {
    //   "nome_pai": "String",
    //   "filhos": [
    //     {
    //       "nome": "String",
    //       "valor": "Number",
    //       "ingredientes": "String",
    //       "adicionais": [
    //         {
    //           "nome": "String",
    //           "valor": "Number"
    //         }
    //       ],
    //       "categoria": "String",
    //       "categoria_2": "String"
    //     }
    //   ],
    //   "curtidas": "Number", 
    //   "pedidos_quantidades": "Number"
    // }
  
    const cardapio_pai = props.cardapio.filter(item => !('versao' in item) && item.onorof === true);
    const cardapio_filhos = props.cardapio.filter(item => ('versao' in item) && item.onorof === true);
  
    // Criando a estrutura do cardápio com pais e filhos: 
    const cardapioOrganizado = cardapio_pai.map(item => {
      const filhos = cardapio_filhos.filter(filho => filho.versao === item.id);
      return {
        nome_pai: item.name,
        filhos: filhos.map(filho => ({
          nome: filho.name,
          valor: filho.valor,
          ingredientes: filho.ingredientes,
          adicionais: filho.adicionais,
          categoria: filho.categoria,
          categoria_2: filho.categoria_2
        })),
        curtidas: item.curtidas,
        pedidos_quantidades: item.pedidos_quantidade
      };
    });
  
    // console.log(JSON.stringify(cardapioOrganizado, null, 0));
    // console.log(props.user_info.name_on)
    setcardapio_chat_ia_on(prompt_ia_on(props.user_info.name_on,JSON.stringify(cardapioOrganizado, null, 0)));
    setcardapio_chat_ia_mesa(prompts_ia_mesa(props.user_info.name_on,JSON.stringify(cardapioOrganizado, null, 0)));
    const nomesFilhos = cardapio_filhos.map(item => item.name);
    setIa_generate_1(IA_1_on_mesa(nomesFilhos))
    const cardapio_filhos_2 = cardapio_filhos.map(item => ({
      id: item.id,
      name: item.name,
      ingredientes: item.ingredientes,
      adicionais: item.adicionais,
      categoria: item.categoria,
      categoria_2: item.categoria_2
    }));
    setIa_generate_2(IA_2_on_mesa(JSON.stringify(cardapio_filhos_2, null, 0)))
  }, [props.cardapio])

  const handleSend = async () => {
    if (inputText.trim() === '') return;
    setLoading(true);
    // Add the user's message only once
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', parts: [{ text: inputText }] },
      { role: 'model', parts: [{ text: 'Pensando...' }] }, // Add "Pensando..." placeholder
    ]);
  
    setInputText('');
  
    // Simulate IA response (replace with your actual IA logic)
    const response_text = await IaChats(inputText, messages, cardapio_chat_ia_on);
    console.log('rasponseIa : ', response_text);
  
    // Update the messages array with the IA response, replacing the placeholder
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      const lastMessageIndex = updatedMessages.length - 1;
      updatedMessages[lastMessageIndex] = { role: 'model', parts: [{ text: response_text }] };
      return updatedMessages;
    });
  
    // Scroll to the bottom after sending a message
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setLoading(false);

  };
  
  // confirmar pedido funcao
  const handleSend_2 = async () => {
    setLoading(true);
    // Add the user's message only once

    const formattedConversation = messages.reduce((acc, message, index) => {
      const role = message.role === 'user' ? 'user' : 'model';
      const text = message.parts[0].text;
  
      // Add a line break after each message
      const lineBreak = index !== messages.length - 1 ? ' ' : '';
  
      return `${acc}${role}: ${text}${lineBreak}`; 
    }, '');
  
    // Use formattedConversation for your IA logic or display
    // console.log(formattedConversation);
    const response_ia_1 = await Ia_generete(formattedConversation, ia_generate_1, 'ia_1');
    console.log(response_ia_1);
    const response_in_json = JSON.parse(response_ia_1);
    // console.log(response_in_json);
    if (response_in_json && response_in_json.itens === true) {
      const response_ia_2: string = await Ia_generete(
        formattedConversation,
        ia_generate_2,
        'ia_2' 
      );
      console.log(response_ia_2);
      const response_in_json_2: {
        id: string;
        retirar?: string[];
        adicionar?: string[];
        quantidade: number;
        hamburguer?: boolean;
        frances?: boolean;
        sirio?: boolean;
      }[] = JSON.parse(response_ia_2);
      // console.log(response_in_json_2);
      // realizar o pedido no banco de dados
      if (response_in_json_2 && response_in_json_2.length > 0) {
        // realizar o pedido no banco de dados
        // estrutura do response_in_json_2 : {id:string, retirar?:string[], adicionar?:string[], quantidade:number, hamburguer?:boolean,frances?:boolean,sirio?:boolean}[]
        const cardapio_filhos = props.cardapio.filter(
          (item) => ('versao' in item) && item.onorof === true
        );
    
        const itens_cardapio = cardapio_filhos.filter((item) =>
          response_in_json_2.some((item_2) => item_2.id === item.id)
        );
        // console.log(itens_cardapio);
        const itens_pedido: Item[] = itens_cardapio.map((item) => {
          const item_2 = response_in_json_2.find(
            (item_2) => item_2.id === item.id
          );
          return {
            id: item.id,
            name_p: item.name,
            categoria: item.categoria,
            categoria_2: item.categoria_2,
            ...(item_2?.retirar && { retirar_p: item_2.retirar }), // Adiciona 'retirar_p' apenas se 'retirar' não for null ou undefined
            ...(item_2?.adicionar && { adicionar_p: item_2.adicionar }), // Adiciona 'adicionar_p' apenas se 'adicionar' não for null ou undefined
            quantidade: item_2?.quantidade || 1, // Use o valor de 'quantidade' do response_in_json_2
            valor_p: item.valor * (item_2?.quantidade || 1), // Use o valor de 'valor' do item do cardápio
          };
        });
        
        // console.log(itens_pedido)
        // adicionar os itens ao pedido
        props.Set_add_itens((props.adicionar_pedido || []).concat(itens_pedido));
        
        //navegar de volta para o menu
        props.navigation.goBack();
        
      }
    }else{
      setMensagem(true);
      setTimeout(() => {
        setMensagem(false);
      }, 3000);
    }
    setLoading(false);
  }
  
  useEffect(() => {
    // Rola para o final quando as mensagens mudam
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesparts} // Remove this line
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.role === 'user' ? styles.userMessage : styles.modelMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.parts[0].text}</Text>
          </View>
        ))}
      </ScrollView>
      
    {/* "Confirmar Pedido" button (adjust positioning as needed) */}
    
    <View style={{justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'column',backgroundColor: '#f5f5f5',}}>
      {mensagem?
        <View style={[
          styles.sendButton, 
          { padding: 8 , width: '50%',backgroundColor: '#f1e2e2'}, 
        ]}
        > 
          <Text style={[styles.sendButtonText,{color:'#ff0000'}]}>Finalize o Pedido corretamente</Text>
        </View>
        :null

      }
      {messages.length > 0 ?
        loading?
        <View style={[
          styles.sendButton, 
          { backgroundColor: '#00ff0d', padding: 8 }, 
          loading ? { width: '50%' } : { width: '10%' } 
        ]}
        >
          <Text style={styles.sendButtonText}>...</Text>
        </View>:
        <TouchableOpacity style={[styles.sendButton, { width: '50%', backgroundColor: '#00ff0d',padding:8 }]} onPress={handleSend_2}>
          <Text style={styles.sendButtonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      :null
      }
      
    </View>

    {/* button para confirmar pedido da conversa */}
    <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={inputText}
          onChangeText={setInputText}
        />
        {loading ? (
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Aguarde</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            onLongPress={startRecording}
            onPressOut={recording?stopRecording:null} // Add this line
          >
            {recording ? (
              <MaterialIcons name="keyboard-voice" size={24} color="#000000" />
            ) : (
              <Text style={styles.sendButtonText}>Enviar</Text>
            )}
          </TouchableOpacity>
          
        )}
      </View>
      {/* ... (rest of your component content) */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesparts: {
    padding: 16,
    paddingBottom: 80, // Space for input
  },
  message: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-end',
  },
  modelMessage: {
    backgroundColor: '#d9f0ff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 16,
    backgroundColor: '#fff',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 20,
    
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const mapStateToProps = ({  cardapio,user,adicionar_pedido}: { cardapio:any,user:any,adicionar_pedido:any})=> {
  return {
    cardapio: cardapio.cardapio,
    user_info: user.user_info,
    adicionar_itens: adicionar_pedido.adicionar_itens,
      };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    Set_add_itens: (itens:Item[]) => dispatch(setAdicionar_itens(itens)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(IaChat);

