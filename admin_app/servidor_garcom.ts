const functions = require('@google-cloud/functions-framework');
const protobuf = require('protobufjs');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk')
admin.initializeApp();

functions.cloudEvent('helloFirestore', async cloudEvent => {
  // console.log(`Function triggered by event on: ${cloudEvent.source}`);
  // console.log(`Event type: ${cloudEvent.type}`);
  
  // console.log('\nOld value:');
  // console.log(JSON.stringify(firestoreReceived.oldValue, null, 2));
 
  // console.log('\nNew value:');
  // console.log(JSON.stringify(firestoreReceived.value, null, 2));

  /////////////////////////////////////////////////////////////////////user func
  //user_func
  const doc_ref_user_func = admin.firestore().collection('user_func')
  const snapshot_func = await doc_ref_user_func.get();
  let tokens = [];
  snapshot_func.docs.forEach((doc) => {
    const user = doc.data();
    if (user.token) {
      tokens.push(user.token);
    }
  });
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
  if(Nome_banco === 'mesas'){
    const doc_ref_mesas = admin.firestore().collection('mesas').doc(IdItem)
    const doc_mesas = await doc_ref_mesas.get();
    const data_mesas = doc_mesas.data();
    console.log('status_call:', data_mesas.status_call);
    
    if(data_mesas.status_call === true && data_mesas.status_user_call === false){
      // console.log('Mesa chamada');
      // Create a new Expo SDK client
      // optionally providing an access token if you have enabled push security
      let expo = new Expo({
        // accessToken: process.env.EXPO_ACCESS_TOKEN,
        useFcmV1: true // this can be set to true in order to use the FCM v1 API
      });
      let messages = [];
      for (let pushToken of tokens) {

        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(`Push token ${pushToken} is not a valid Expo push token`);
          continue;
        }
        messages.push({
          to: pushToken,
          sound: 'default',
          title: `Mesa ${data_mesas.numero_mesa} chamando`,
          body:  `Não esqueça de atender a mesa ${data_mesas.numero_mesa}`,
          data: { withSome: 'data' },
        })
      }
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

  }else if (Nome_banco === 'pedidos'){
    //pedidos
    const doc_ref_pedidos = admin.firestore().collection('pedidos').doc(IdItem)
    const doc_pedidos = await doc_ref_pedidos.get();
    const data_pedidos = doc_pedidos.data();
    
    // console.log('Status:', data_pedidos.status);
    ////////////////////////////////acessando itens
    const itens = data_pedidos.itens;
    let item_chapeiro = false;
    let item_porcoes = false;
    let item_bar = false;
    let item_bebidas = false;

    itens.forEach((item) => {
      if(item.categoria === 'comidas' && (item.categoria_2 === 'hotdogs' || item.categoria_2 === 'lanches' || item.categoria_2 === 'combos')){
        // console.log('Comida:', item.name_p);  
        item_chapeiro = true;
      }else if(item.categoria === 'comidas' && item.categoria_2 === 'porcoes'){
        // console.log(' porcoes:', item.name_p);
        item_porcoes = true;
      }else if(item.categoria === 'bar'){
        // console.log('Bebida:', item.name_p);
        item_bar = true;
      }else if(item.categoria === 'bebidas'){
        // console.log('Bebida:', item.name_p);
        item_bebidas = true;
      }
    });
    let existe_chapeiro = false;
    let existe_porcoes = false;
    let existe_bar = false;
    let existe_bebidas = false;
    
    snapshot_func.forEach((doc) => {
      const user = doc.data();
      user.chapeiro?.forEach((chapeiro) => {
        if(chapeiro === IdItem){
          existe_chapeiro = true;
        }
      });
      
      user.porcoes?.forEach((porcoes) => {
        if(porcoes === IdItem){
          existe_porcoes = true;
        }
      });

      user.bar?.forEach((bar) => {
        if(bar === IdItem){
          existe_bar = true;
        }
      });

      user.bebidas?.forEach((bebidas) => {
        if(bebidas === IdItem){
          existe_bebidas = true;
        }
      });
      
    });
    if(data_pedidos.localidade === 'MESA'){
      if(item_chapeiro && data_pedidos.status_chapeiro === false && existe_chapeiro === false){
        let expo = new Expo({
          // accessToken: process.env.EXPO_ACCESS_TOKEN,
          useFcmV1: true // this can be set to true in order to use the FCM v1 API
        });
        let messages = [];
        for (let pushToken of tokens) {
  
          if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
          }
          messages.push({
            to: pushToken,
            sound: 'default',
            title: `Entregar item CHAPEIRO`,
            body:  `MESA : ${data_pedidos.numero_mesa}`,
            data: { withSome: 'data' },
          })
        }
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
      if(item_porcoes && data_pedidos.status_porcoes === false && existe_porcoes === false){
        let expo = new Expo({
          // accessToken: process.env.EXPO_ACCESS_TOKEN,
          useFcmV1: true // this can be set to true in order to use the FCM v1 API
        });
        let messages = [];
        for (let pushToken of tokens) {
  
          if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
          }
          messages.push({
            to: pushToken,
            sound: 'default',
            title: `Entregar item PORÇÕES `,
            body:  `MESA : ${data_pedidos.numero_mesa}`,
            data: { withSome: 'data' },
          })
        }
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
      if(item_bar && data_pedidos.status_bar === false && existe_bar === false){
        let expo = new Expo({
          // accessToken: process.env.EXPO_ACCESS_TOKEN,
          useFcmV1: true // this can be set to true in order to use the FCM v1 API
        });
        let messages = [];
        for (let pushToken of tokens) {
  
          if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
          }
          messages.push({
            to: pushToken,
            sound: 'default',
            title: `Entregar item BAR `,
            body:  `MESA : ${data_pedidos.numero_mesa}`,
            data: { withSome: 'data' },
          })
        }
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
      if(item_bebidas && data_pedidos.array_bebidas && existe_bebidas === false){
        let expo = new Expo({
          // accessToken: process.env.EXPO_ACCESS_TOKEN,
          useFcmV1: true // this can be set to true in order to use the FCM v1 API
        });
        let messages = [];
        for (let pushToken of tokens) {
  
          if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
          }
          messages.push({
            to: pushToken,
            sound: 'default',
            title: `Entregar item BAR bebidas `,
            body:  `MESA : ${data_pedidos.numero_mesa}`,
            data: { withSome: 'data' },
          })
        }
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

});
