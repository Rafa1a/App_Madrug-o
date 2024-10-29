import React, { useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Indice from './routes/index';
import { message } from './interface/inter_actions';
import { connect } from 'react-redux';
import { setMessage } from './store/action/message';

// Interface
interface Props extends message {
  clearMessage: () => void;
}

// App central índice para o index do navigation
const App: React.FC<Props> = (props) => {
  const { text, title, clearMessage } = props;

  useEffect(() => {
    if (text && text.toString().trim()) {
      Alert.alert(title?.toString() || 'Mensagem', text.toString());
      clearMessage();
    }
  }, [text, title, clearMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Indice />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252A32',
  },
});

const mapStateToProps = ({ message }: { message: message }) => {
  return {
    title: message.title,
    text: message.text,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearMessage: () => dispatch(setMessage({ title: '', text: '' })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
