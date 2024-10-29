
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Indice from "./routes/index"
import { message } from './interface/inter_actions';
import { connect } from 'react-redux';
import {setMessage} from './store/action/message'

//iNTERFACE //// rafa esta aki 
interface props extends message {
  clearMessage:()=>void
}

// app central indice para o index do navegation
 class App extends React.Component<props>{
  
  componentDidUpdate = () => {
      if(this.props.text && this.props.text.toString().trim()){
          Alert.alert(this.props.title.toString() || "Mensagem", this.props.text.toString())
          this.props.clearMessage()
      }
  }
  render() {return(
        <Indice/>
  );}
}

// tratamento de excecoes global!
const mapStateToProps = ({message}:{message:message}) =>{
  return {
      title : message.title,
      text : message.text
  }
}
// tratamento de excecoes global!
const mapDispatchProps = (dispatch :any) => {
    return {
        clearMessage: () =>dispatch(setMessage({title:'',text:''}))
    }
}
export default connect(mapStateToProps,mapDispatchProps)(App)