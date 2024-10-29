import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { Alert, Linking, Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  loading: boolean;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    }),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    let showAlert = false;
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        showAlert=true;
        console.log("Permissão nao concedida");

        Alert.alert(
            'Permissão de notificação não concedida',
            'Por favor, habilite as notificações para melhor funcionamento do aplicativo, podemos te alertar sobre novidades e promoções além de te informar sobre o status do seu pedido.',
            [
                { text: 'Cancelar', style: 'cancel', onPress: () => setLoading(true)},
                { text: 'Configurações', onPress: () => {
                  Linking.openSettings()
                  setLoading(true);
                } },
            ]
        );
        return;
      }
      setLoading(true)
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return {token,showAlert};
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(({ token, showAlert }) => {
      setExpoPushToken(token); 
      if(showAlert === false) setLoading(true); // Use a variável local em vez do estado
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);

      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
    loading
  };
};