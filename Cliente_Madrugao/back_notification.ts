const functions = require('@google-cloud/functions-framework');
const protobuf = require('protobufjs');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk')
admin.initializeApp();

functions.cloudEvent('helloFirestore', async cloudEvent => {
  ///////////////////////////////////////////////////////////////////////loadign protos
  console.log('Loading protos...');
  const root = await protobuf.load('data.proto');
  const DocumentEventData = root.lookupType(
    'google.events.cloud.firestore.v1.DocumentEventData'
  );

  console.log('Decoding data...');
  const firestoreReceived = DocumentEventData.decode(cloudEvent.data);
  /////////////////////////////////////////////////////////////////////// nome do banco e id do documento
  const documentNameParts = firestoreReceived.oldValue?.name.split('/');
  const Nome_banco = documentNameParts[documentNameParts.length - 2]; 
  console.log('Nome_banco ID:', Nome_banco);

  const IdItem = firestoreReceived.oldValue?.name.split('/').pop();
  console.log('Document ID:', IdItem);

  //////////////////////////////////////////////////////////////////////acessando banco
  if(Nome_banco === 'pedidos'){
    const doc_ref_online = admin.firestore().collection('pedidos').doc(IdItem)
    const doc_online = await doc_ref_online.get();
    const data_online = doc_online.data();

    if(data_online && data_online.localidade === 'ONLINE'){
        if(data_online.status === true && data_online.status_porcoes === false && data_online.status_chapeiro === false && data_online.status_bar === false){
            
            if(data_online.id_user){
                const doc_ref_user = admin.firestore().collection('user_on').doc(data_online.id_user)
                const doc_user = await doc_ref_user.get();
                const data_user = doc_user.data();
                
                if(data_user.token){
                    if(data_online.pegar_local){
                        let expo = new Expo({
                            useFcmV1: true 
                        });
                        const pushToken = data_user.token;
                        let messages = [];
                        if (!Expo.isExpoPushToken(pushToken)) {
                            return;
                        }
                        messages.push({
                            to: pushToken,
                            sound: 'default',
                            title: `Pedido Pronto`,
                            body:  `Pedido pronto para retirada`,
                            data: { withSome: 'data' },
                        })
                        let chunks = expo.chunkPushNotifications(messages);
                        let tickets = [];
                        (async () => {
                            for (let chunk of chunks) {
                                try {
                                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                                    console.log(ticketChunk);
                                    tickets.push(...ticketChunk);
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        })();
                    }else {
                        let expo = new Expo({
                            useFcmV1: true 
                        });
                        const pushToken = data_user.token;
                        let messages = [];
                        if (!Expo.isExpoPushToken(pushToken)) {
                            return;
                        }
                        messages.push({
                            to: pushToken,
                            sound: 'default',
                            title: `Pedido Pronto`,
                            body:  `Seu pedido está pronto, aguarde a entrega`,
                            data: { withSome: 'data' },
                        })
                        let chunks = expo.chunkPushNotifications(messages);
                        let tickets = [];
                        (async () => {
                            for (let chunk of chunks) {
                                try {
                                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                                    console.log(ticketChunk);
                                    tickets.push(...ticketChunk);
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        })();
                    }
                    
                }
            }  
        }
        
    }
  }
  ////////////////////////////////////////////////////////////////////enviando notificação
});
