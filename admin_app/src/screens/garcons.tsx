import React, { useEffect } from 'react';
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
import { NavigationProp } from '@react-navigation/native';
import { fetchuser_func_delete,  fetchuser_func_update } from '../store/action/user';
import { Avatar } from '@rneui/themed';
import { TextInput } from 'react-native';
import { Button } from '@rneui/base';


interface Props {
    users_func: any[];
    navigation: NavigationProp<any>;

    onUsers_funcDelete:(id:string)=>void;

    onUsers_funcUpdate:(id:string,quantidade:number)=>void;
}
 const Garcons = (props: Props) => {
  
    const [id, setId] = React.useState('')
    const [quantidade, setQuantidade] = React.useState(0)
    const [tamanho_lista, setTamanho_lista] = React.useState(0)
    useEffect(() => {
        if(quantidade > props.users_func.length-1){
            setTamanho_lista( quantidade- (props.users_func.length-1))
        }
    },[props.users_func,quantidade]);
    useEffect(() => {
        console.log(props.users_func.length-1 > quantidade)
        console.log(props.users_func.length-1 )
        console.log(quantidade)
        const asyncUsers = async () => {
            if(id === '') return
            if(props.users_func.length-1 > quantidade ){
               await props.onUsers_funcUpdate(id,props.users_func.length-1)
            }
        }
        asyncUsers();
    },[id,quantidade]); 

    return (
        <SafeAreaView style={styles.container}>
        {/*Adicionar user_func */}
        
        {props.users_func.length-1 === quantidade?
        <>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 300, color: 'white' }}
                placeholder='Quantidade de garçons'
                placeholderTextColor='white'
                keyboardType='numeric'
                value={String(tamanho_lista)}
                onChangeText={(text) => {setTamanho_lista(Number(text))}}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: 'blue',
                    padding: 5,
                    borderRadius: 5,
                    marginBottom: 10,
                }}
                onPress={async() => { 
                        await props.onUsers_funcUpdate(id,quantidade + tamanho_lista)
                    }}>
                <Text style={{ color: 'white' }}>Liberar Espaço</Text>

            </TouchableOpacity>
        </>
        :quantidade > props.users_func.length-1 ? 
        <>
            <Text style={{color:'white'}}>Aguardando Preencher + {tamanho_lista}... </Text>
            <Button onPress={async() => { 
                await props.onUsers_funcUpdate(id,props.users_func.length-1)
            }}>Cancelar</Button>
        </>
        :null }

        {/*Adicionar user_func */}

        {/* lista */}
        <FlatList
            data={props.users_func}
            renderItem={({ item }) =>{  
                if(item.quantidade || item.opcoes){
                    setId(item.id)
                    setQuantidade(item.quantidade)
                    return
                }

                return(
                    <View 
                        style={{
                            flex: 1,
                            padding: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: 300,
                        }}>
                        <Avatar size='small' source={{uri:item.image_fun}}/>
                        <Text style={{ color: 'white',fontSize:15,width:100}}>{item.name_func}</Text>
                        {/* button para excluir */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'red',
                                padding: 5,
                                borderRadius: 5,
                            }}
                            onPress={() => Alert.alert('Delete', 'Deseja excluir o garçom?', 
                            [
                                {text: 'Não', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'Sim', onPress: async() => {
                                    await props.onUsers_funcDelete(item.id)
                                    await 
                                    await props.onUsers_funcUpdate(id,props.users_func.length-2)
                                    
                                }},
                            ]
                            )}>
                            <Text style={{ color: 'white' }}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                
            )}}
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

const mapStateProps = ({user}: {user:any}) => {
    return {
        users_func: user.users_func,
    };
  };
  const mapDispatchProps = (dispatch: any) => {
    return {
        onUsers_funcDelete:(id:string)=>dispatch(fetchuser_func_delete(id)),
        onUsers_funcUpdate:(id:string,quantidade:number)=>dispatch(fetchuser_func_update(id,quantidade))
    };
  };
  
export default connect(mapStateProps,mapDispatchProps)(Garcons);