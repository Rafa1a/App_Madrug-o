import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Alert,
  ActivityIndicator,
  Button,
  Linking
} from 'react-native';
//necessarios para fazer login
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import {
GoogleAuthProvider,
onAuthStateChanged,
signInWithCredential,
signOut
} from 'firebase/auth'
import { auth } from '../store/auth';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { add_Func, fetchuser_get, setUser_login } from '../store/action/user';


WebBrowser.maybeCompleteAuthSession();

const LoginScreen = (props: any) => {
  const [userInfo, setUserInfo] = React.useState<any>()
  //users get do banco de dados
  const [users_func, setUsers_func] = React.useState<any>()
  //definir 1 user para adicionar
  const [add_func, setAdd_func] = React.useState<any>()
  //loading de get users
  const [loading_user, setLoading_user] = React.useState<any>(false)
  const [Loadign_icon, setLoadign_icon] = React.useState<any>(true)

////////////google auth //////////////////////////////////
  const [request,response,promptAsync] = Google.useAuthRequest({
    iosClientId:"iosClientId",
    androidClientId:"androidClientId"
  })
// caso nao esteja logado essa funcao cria ou loga o usuario
  React.useEffect(()=>{
    const fetch_all = async () =>{
      setLoadign_icon(true)
      if(response?.type == "success"){
     
        // console.log(response)
        const {id_token} = response.params;
      
        const credential = GoogleAuthProvider.credential(id_token);
        // console.log(credential)
        //login do user 
        await signInWithCredential(auth,credential)
        .catch(()=>{
          setLoadign_icon(false)
          Alert.alert('Error ao fazer o Login, Contate o suporte')
        });
        /////////////////////// GET USERS 
        const fetchData = async () => {
          try {
            await props.onFetch_user();
            setLoadign_icon(true)
            setLoading_user(true);
            // console.log('get users = ok');
          } catch (error) {
            setLoadign_icon(false)
            Alert.alert('Error ao Buscar Users no banco de dados, Contate o suporte')
            console.error('Erro ao buscar usuários:', error);
          }
        };
      
        if (!loading_user) {
          fetchData();
        }
        ///////////////////////////
      }
    }
    fetch_all();
  },[response])
//////////////////////////////////////////////////////////////
//Definir usuario quando ja estiver logado && chamar usuarios
  React.useEffect(()=>{
    // console.log("users", props.user_func)
    const unsub = async () => {
      try {
        setLoadign_icon(true)
        await onAuthStateChanged(auth,async (user:any) =>{
          if(user){
            ////////////////definir user 
            setUserInfo(user);
            props.onSetUser_login(user)
            // console.log(JSON.stringify(user,null,2))
            /////////////// Add_user
            const new_user = {
              uid:user.uid,
              name_func : user.displayName,
              image_fun : user.photoURL,
            }
            setAdd_func(new_user)
            /////////////////////// GET USERS 
            const fetchData = async () => {
              try {
                await props.onFetch_user();
                setLoadign_icon(true)
                setLoading_user(true);
                // console.log('get users = ok');
              } catch (error) {
                setLoadign_icon(false)
                Alert.alert('Error ao Buscar Users no banco de dados, Contate o suporte')
                console.error('Erro ao buscar usuários:', error);
              }
            };
          
            if (!loading_user) {
              fetchData();
            }
          ///////////////////////////
          }else {
            setLoadign_icon(false)
            console.log('sem user')
          }
        })
      } catch (error) {
        setLoadign_icon(false)
        Alert.alert('Error ao averiguar users, contate o suport')
      }finally{
        setLoadign_icon(false)
      }
     }
    unsub();
  },[]);

  //////definir user /////
  React.useEffect(()=>{
    if(loading_user){
      // console.log(props.user_func)
      setUsers_func(props.user_func) 
      // console.log('set users:ok')
    }
  },[loading_user])
  
  //login user tratamento e logica para funcionamento do LOGIN
  React.useEffect(() => {
    const login_users = async () => {
      if (userInfo && users_func !== undefined) {
        setLoadign_icon(true)
        const array_func: any[] = props.user_func;
        // console.log(array_func[1].uid);
        // console.log(userInfo);
    
        // Utilizando array_func.some para verificar se algum objeto possui a propriedade uid igual ao userInfo.uid
    
        const uid_func = array_func.some((i) => i.uid === userInfo.uid);
        const opcoes_user = array_func.find(i=> i.opcoes === true)
        // console.log(opcoes_user)
        
          if(uid_func){
            props.navigation?.replace("Splash");
            console.log('login');
          }else if (array_func.length <= opcoes_user.quantidade) {
            await props.onAdd_User(add_func);
            props.navigation?.replace("Splash");
            // console.log('add');
          }else {  
            setLoadign_icon(false)
            Alert.alert('Você não tem permissão')
          }
      }
    }
    login_users()
  }, [userInfo, users_func]);

  if(Loadign_icon){
    return <View style={{flex:1, alignItems:'center',justifyContent:"center", backgroundColor:"#2d2f31"}}>
      <ActivityIndicator size={"large"}/>
    </View>
  }

  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Bem Vindo Garçom</Text>
      <TouchableOpacity style={styles.button} onPress={()=>promptAsync()}>
      <FontAwesome name="google-plus-square" size={35} color="#f4f7fc" />
        <Text style={styles.buttonText}>Google</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor:'#2d2f31'
  },
  button: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-around',
    backgroundColor: '#4285F4', // Cor do Google
    padding: 15,
    margin: 10,
    borderRadius: 15,
    width: 200,
  },
  buttonText: {
    color: '#f4f7fc',
    fontWeight: 'bold',
  },
  text :{
    color: '#f4f7fc',
    fontSize:30,
    fontFamily:"OpenSans-Bold"
  }
});



const mapStateProps = ({  user }: {  user: any}) => {
  return {
    user_func:user.users
  };
};


const mapDispatchProps = (dispatch: any) => {
  return {
    onAdd_User: (user:any) => dispatch(add_Func(user)),
    onFetch_user: () => dispatch(fetchuser_get()),
    onSetUser_login: (user:any) => dispatch(setUser_login(user)),

  };
};

export default connect(mapStateProps,mapDispatchProps )(LoginScreen);
