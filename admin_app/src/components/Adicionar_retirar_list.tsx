import { Button, ListItem, Switch } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  FlatList
} from 'react-native';
import Adicionais_itens from './adicionais_retirar_itens';
import { adicionais, adicionar_comp } from '../interface/inter_adicionar';
import { connect } from 'react-redux';
import { setAdicionar_pedido } from '../store/action/adicionar_pedido';
import { Item } from '../interface/inter';

const adicionar_retirar = (props: adicionar_comp) => {
  /////////////////// controle modal/////////////////////////
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  //quantidade de itens no modal 
  const [quantity, setQuantity] = useState(1); 
  /////////////estado inicial de itens CUSTOM///////////////
  const inicial_itens_custom:any = undefined
 
  const [inicial_state_itens_custom, setInicial_state_custom] = useState<Item>(inicial_itens_custom); 
  
  const [itensSelecionados_retirar, setItensSelecionados_retirar] = useState<string[]>([]);
  const [itensSelecionados_adicionar, setItensSelecionados_adicionar] = useState<adicionais[]>([]);

  const [observacao, setObservacao] = useState('');
  /////////controle flatlist/////////////////
  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  
  //funcao soma quantidade de TODOS
  const Soma = () => {
    const somaTotal = props.adicionar_pedido.reduce((soma, item:any) => {
      const item_filhos = props.cardapio.filter((item_cardapio:any) => item_cardapio.versao === props.id)
      
      if (item.id === props.id || item_filhos.some(filho => filho.id === item.id)) {
        soma += item.quantidade;
      }
      return soma;
    }, 0);

    return <>{`x${somaTotal || 0}`}</>;
  }
 ///////////////////////////////////CUSTOM//////////////////////////////////////////////
 ///////////////////////////////////CUSTOM//////////////////////////////////////////////
 ///////////////////////////////////CUSTOM//////////////////////////////////////////////
  // modal adicionar item personalizado
  useEffect(()=>{

    if(modalVisible){
      const objet:any = {
        id:props.id,
        name_p: props.name,
        categoria: props.categoria || undefined,
        categoria_2: props.categoria_2 || undefined,
        quantidade: quantity ,
        valor_p: props.valor,
      };
      setInicial_state_custom(objet)    
      return
 
    }
  },[modalVisible])

  // adicionar ITEM CUSTOM ao SALVAR
const adicionar_custom_salvar = () => {
    // console.log('inicial_state_itens_custom',inicial_state_itens_custom)
    if (inicial_state_itens_custom !== undefined) {
        const valorTotalAdicionais = itensSelecionados_adicionar.reduce(
            (total, item) => total + item.valor,
            0
        );

        let newCustom = {
            ...inicial_state_itens_custom,
            valor_p: parseFloat(((inicial_state_itens_custom.valor_p + valorTotalAdicionais)).toFixed(2))
        };

        if (itensSelecionados_adicionar.length > 0) {
            newCustom.adicionar_p = itensSelecionados_adicionar.map((item) => item.name);
        }

        if (itensSelecionados_retirar.length > 0) {
            newCustom.retirar_p = itensSelecionados_retirar;
        }
        if (hamburguer) {
            newCustom.hamburguer = true;
        }
        if (frances) {
            newCustom.frances = true;
        }
        if (sirio) {
            newCustom.sirio = true;
            // adicionar +4 no valor
            newCustom.valor_p = parseFloat((newCustom.valor_p + 4).toFixed(2));
        }
        if (observacao) {
            newCustom.observacao = observacao;
        }
        if((props.categoria_2 === 'lanches' || props.categoria_2 === 'hotdogs' || props.categoria_2 === 'combos') &&  (hamburguer === false && frances === false && sirio === false)){
          console.log(hamburguer,frances)
          alert('Selecione um pão')          
        } else if(props.categoria === 'bar' && props.categoria_2 === 'sucos' && itensSelecionados_adicionar.length === 0){
          alert('Selecione um adicional, Obrigatório!')
        }else if (props.categoria === 'bar' && props.categoria_2 === 'sucos' && itensSelecionados_adicionar.length > 2){
          alert('Selecione no máximo 2 adicionais')
        }else {
          const newArray = [...props.adicionar_pedido, newCustom];
          props.onAdicionar_pedido(newArray);
          setInicial_state_custom(inicial_itens_custom);
          setItensSelecionados_retirar([]); // Limpe os itens selecionados após salvar
          setItensSelecionados_adicionar([]); // Limpe os itens selecionados após salvar
          setModalVisible(false)
          setModalVisible2(false);
        }
    }
};
  
  // Função para manipular o clique em um item retirado
  const handleItemToggle_retirar = (item:any) => {
    // Verifique se o item já está na lista de itens selecionados
    if (itensSelecionados_retirar.includes(item)) {
      // Se estiver, remova-o
      setItensSelecionados_retirar((prev) => prev.filter((selectedItem) => selectedItem !== item));
    } else {
      // Se não estiver, adicione-o
      setItensSelecionados_retirar((prev:any) => [...prev, item]);
    }
    // console.log(itensSelecionados_retirar)
  }; 

  // Função para manipular o clique em um item adicional
  const handleItemToggleAdicionar = (item: any) => {
    // Verifique se o item já está na lista de itens selecionados
    // console.log(item)
    if (itensSelecionados_adicionar.includes(item)) {
      setItensSelecionados_adicionar((prev) =>
        prev.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setItensSelecionados_adicionar((prev: any) => [...prev, item]);
    }
    // console.log(itensSelecionados_adicionar);
  };
  //Novo
  const [index_check, setIndex_check] = useState(0)

  const [filhoSelecionado, setFilhoSelecionado] = useState(null);

  // console.log(props.adicionar_pedido); 
  //atualizar filhos selecionados
  useEffect(() => {
    // console.log('inicial',inicial_state_itens_custom)
    // console.log('inicial',inicial_state_itens_custom?.id)
    // console.log(quantity)
    // console.log('filhoSelecionado',filhoSelecionado)

    const cardapio_item = props.cardapio.find((item:any) => item.id === inicial_state_itens_custom?.id)
    if(cardapio_item){
      setFilhoSelecionado(cardapio_item)
      // console.log('filhoSelecionado',filhoSelecionado)
    }
  }, [inicial_state_itens_custom,quantity]);

  useEffect(() => {
    // console.log('filhoSelecionado',props.adicionais)
  }, [filhoSelecionado]);

  // adicionar  quantity de CUSTOM MODAL
  const handleIncrement = () => {
    // console.log('quantity',inicial_state_itens_custom)
    if (filhoSelecionado?.estoque) {
      if (quantity < filhoSelecionado.estoque) {
        setQuantity((prevQuantity) => {
          const newQuantity = prevQuantity + 1;
          setInicial_state_custom((prevCustom) => ({
            ...prevCustom,
            quantidade: newQuantity,
          }));
          return newQuantity;
        });
      }
    } else {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      setInicial_state_custom((prevCustom) => ({
        ...prevCustom,
        quantidade: newQuantity,
      }));
      return newQuantity;
    });
  }
  };

  //  retirar quantity de CUSTOM MODAL
  const handleDecrement = () => {
    setQuantity((prevQuantity) => {
      // Garante que a quantidade não seja negativa
      const newQuantity = Math.max(0, prevQuantity - 1); 
      setInicial_state_custom((prevCustom) => ({
        ...prevCustom,
        quantidade: newQuantity,
      }));
      return newQuantity;
    });
  };

  //////////////////////////////////PAES HAMBURGUER , FRANCES e SIRIO//////////////////////////////////////////////
  const [hamburguer, setHamburguer] = useState(false);
  const [frances, setFrances] = useState(false);
  const [sirio, setSirio] = useState(false);
  //////////////////////////////////PAES HAMBURGUER, FRANCES e SIRIO//////////////////////////////////////////////

  return (
     
    <>
      <ListItem 
        containerStyle={{ 
        backgroundColor: '#28292a',    
        borderRadius:25,
        margin:10}} 
        bottomDivider
      >
        {/* <Button  
          size='md'	
          radius='lg' 
          type='outline'
          icon={{
            name: 'remove',
            type: 'ionicons',
            size: 15,
            color: 'white',
          }}
          buttonStyle={{backgroundColor:'#3c4043'}}
              
          onPress={()=>{
            add_retirar <= 0? setAdd_retirar(0):setAdd_retirar(add_retirar - 1)
          }} 
        /> */}

        <ListItem.Content style={{alignItems:'center'}}>
          {/* <ListItem.CheckBox
                checked={checkbox1}
                onPress={() => {
                  setCheckbox1(prevCheckbox => !prevCheckbox);
                }}
                iconType="material-icons"
                checkedIcon="check-box"
                uncheckedIcon='check-box-outline-blank'
                wrapperStyle={{backgroundColor:'#28292a'}}
                containerStyle={{backgroundColor:'#28292a'}}
              /> */}
          <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            // setCheckbox1(prevCheckbox => !prevCheckbox)
            setModalVisible(true)
            }
          }
          >
            <ListItem.Title style={styles.title}>
              {props.name}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtittle}>
              {Soma()}
            </ListItem.Subtitle>
            <Button  
                size='md'	
                radius='lg' 
                type='outline'
                title={'Personalizado'}
                icon={{
                  name: 'add',
                  type: 'ionicons',
                  size: 15,
                  color: 'white',
                }}
                buttonStyle={{borderColor:'tomato',backgroundColor:'#3c4043'}}
                titleStyle={{color:'white'}}  
                onPress={()=> {
                      setModalVisible(true);
                  }
                } 
              />
          </TouchableOpacity>
        </ListItem.Content>
        {/* <Button  
          size='md'	 
          radius='lg' 
          type='outline'
          icon={{
            name: 'add',
            type: 'ionicons',
            size: 15,
            color: 'white',
          }}
          buttonStyle={{borderColor:'tomato',backgroundColor:'#3c4043'}}
          onPress={()=>  {

            const estoque_cardapio:any = props.cardapio.find(item => item.id === props.id)
            if(checkbox1){
              if(estoque_cardapio.estoque){
                // console.log(estoque_cardapio.estoque)
                
                if(add_retirar < estoque_cardapio.estoque){
                  setAdd_retirar(add_retirar + 1)
                  // console.log(add_retirar)
                }
              }else{
                setAdd_retirar(add_retirar + 1)
              }
            }else{
              setCheckbox1(true)
            }
            
            }}
        /> */}

      </ListItem>

      {/*modal para adicionar item personalizado*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>{props.name}</Text>
            <ScrollView style={{ flex: 0.8, width:'95%'}}>
              {/* versoes filhos */}
                <View style={styles.tabaccordion}>
                  <Text style={styles.text2}>Versões : </Text>
                  <FlatList
                    scrollEnabled={false}
                    data={props.cardapio.filter((item:any)=> item.versao === props.id && item.onorof === true)}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item, index }) => <Adicionais_itens handleItemToggleAdicionar={handleItemToggleAdicionar} item={item} versoes setInicial_state_custom={setInicial_state_custom} quantity={quantity} setIndex_check={setIndex_check} index={index} index_check={index_check}/>}
                  />
                </View>
              {/* ListItem de adicionar e retirar */}
              {/* paes hambuer e frances */}
              {props.categoria_2 === 'lanches' || props.categoria_2 === 'hotdogs' || props.categoria_2 === 'combos'?
                props.paes.hamburguer > 0 || props.paes.frances > 0 || props.paes.sirio > 0?
                  <>
                    <Text style={styles.text2}>Pão : </Text>
                    {props.paes.hamburguer > 0 ?
                      <TouchableOpacity
                        style={[styles.button, hamburguer ? { backgroundColor: '#4ada4a' } : null]}
                        onPress={() => {
                          setHamburguer(!hamburguer);
                          setFrances(false);
                          setSirio(false);
                        }}
                      >
                        <Text style={styles.buttonText}>Hamburguer</Text>
                      </TouchableOpacity>
                      : null}
                    {props.paes.frances > 0 ?
                      <TouchableOpacity
                        style={[styles.button, frances ? { backgroundColor: '#4ada4a' } : null]}
                        onPress={() => {
                          setFrances(!frances);
                          setHamburguer(false);
                          setSirio(false);
                        }}
                      >
                        <Text style={styles.buttonText}>Francês</Text>
                      </TouchableOpacity>
                      :null}
                    {props.paes.sirio > 0 ?
                      <TouchableOpacity
                        style={[styles.button, sirio ? { backgroundColor: '#4ada4a' } : null]}
                        onPress={() => {
                          setSirio(!sirio);
                          setHamburguer(false);
                          setFrances(false);
                        }}
                      >
                        <Text style={styles.buttonText}>Sírio + 4</Text>
                      </TouchableOpacity>
                      :null}
                  </>
                  :null
                :null}
              {/* paes hambuer e frances */}
              {filhoSelecionado?.adicionais?.length > 0? 
              <ListItem.Accordion
                content={<Text style={styles.text2}>Adicionar : {itensSelecionados_adicionar.length}</Text>}
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                  setExpanded2(false);
                }}
                containerStyle={styles.tabaccordion}
              >
              <FlatList
                scrollEnabled={false}
                data={filhoSelecionado?.adicionais}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => <Adicionais_itens handleItemToggleAdicionar={handleItemToggleAdicionar} item={item} adicionais itensSelecionados_adicionar={itensSelecionados_adicionar}/>}
              />
            </ListItem.Accordion>:null}
              {filhoSelecionado?.ingredientes?.length > 0?
              <ListItem.Accordion
              content={<Text style={styles.text2}>Retirar : {itensSelecionados_retirar.length}</Text>}
              isExpanded={expanded2}
              onPress={() => {
                setExpanded2(!expanded2);
                setExpanded(false);
              }}
              containerStyle={styles.tabaccordion}
            >
              <FlatList
                scrollEnabled={false}
                data={props.ingredientes?.filter((item:any)=> item === 'pão'?null:item)}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => <Adicionais_itens handleItemToggle_retirar={handleItemToggle_retirar} item={item}  itensSelecionados_retirar={itensSelecionados_retirar}/>}
              />
            </ListItem.Accordion>:null}
            </ScrollView>
            {/* ListItem de adicionar e retirar */}

            {/* Controle de quantidade */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton,{backgroundColor:"#ca3232"}]}
                onPress={handleDecrement}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={quantity.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setQuantity(Number(text))}
              />
              <TouchableOpacity
                style={[styles.quantityButton,{backgroundColor:"#10a549"}]}
                onPress={handleIncrement}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            {/* Botões de adicionar e cancelar */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button,{padding:5,width:'30%'}]} onPress={() => {
                setModalVisible(false)
                setInicial_state_custom(inicial_itens_custom)
                setItensSelecionados_retirar([]); // Limpe os itens selecionados após salvar
                setItensSelecionados_adicionar([]); // Limpe os itens selecionados após salvar
                // console.log(add_retirar)
                // props.adicionar_pedido.length === 0 ?setCheckbox1(false):null
              }}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button,{padding:5,width:'30%'}]} onPress={() => {
                setModalVisible2(true);
                }}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* confirmação do pedido */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmação do Pedido</Text>
            <Text style={styles.modalText}>
              Nome :<Text style={{fontWeight: 'bold'}}>{props.name}</Text>
            </Text>
            <Text style={styles.modalText}>
                Quantidade :<Text style={{fontWeight: 'bold'}}>{quantity}</Text>
            </Text>
            {props.categoria_2 === 'lanches' || props.categoria_2 === 'hotdogs' || props.categoria_2 === 'combos'?<Text style={styles.modalText}>
              Pão: <Text style={{fontWeight: 'bold'}}>{hamburguer ? 'Hamburguer' : (frances ? 'Francês' : (sirio? 'Sírio' : null))}</Text>
            </Text>:null}
            <Text style={styles.modalText}>
              Valor: R$<Text style={{fontWeight: 'bold'}}>{(quantity * inicial_state_itens_custom?.valor_p).toFixed(2)}</Text>
            </Text>
            <Text style={styles.modalText}>
              Adicionais: <Text style={{fontWeight: 'bold'}}>{itensSelecionados_adicionar.length}</Text>
            </Text>
            <Text style={styles.modalText}>
            {itensSelecionados_adicionar.map((item) => item.name).join(', ')}
            </Text>
            <Text style={styles.modalText}>
              Retirar: <Text style={{fontWeight: 'bold'}}>{itensSelecionados_retirar.length}</Text>
            </Text>
            <Text style={styles.modalText}>
            {itensSelecionados_retirar.map((item) => item).join(', ')}
            </Text>
            <TextInput
              style={styles.input2}
              placeholder="Observação do item"
              placeholderTextColor="#fff"
              value={observacao}
              onChangeText={(text) => setObservacao(text)}
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button2} onPress={() => {
                setModalVisible(true);
                setModalVisible2(false);
              }}>
                <Text style={styles.buttonText2}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={() => {
                adicionar_custom_salvar();
              }}> 
                <Text style={styles.buttonText2}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex:1,
    maxHeight:'93%',
    width:'95%',
    backgroundColor: '#F4F7FC',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor:"#F4F7FC"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  input2: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: '#fff',
    backgroundColor: '#3C4043',
  },
  buttonContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#3C4043',
    borderRadius: 10,
    padding: 18,
    margin: 10,
    elevation:4,
    shadowColor:'#F4F7FC',
  },
  buttonText: {
    color: 'white',
    fontFamily:'Roboto-Regular',
    textAlign:'center'

  },
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold',
    color:'#F4F7FC'

  },
  subtittle:{
    fontSize: 12,
    fontFamily:'Roboto-Regular',
    color:'#F4F7FC',
    textAlign:'center',

  },
  estoque:{
    fontSize: 11,
    fontFamily:'Roboto-Regular',
    color:'#F4F7FC'
  },
  tabaccordion:{
    backgroundColor:'#F4F7FC',
    borderBottomWidth:1, 
    borderRadius:25,
    margin:5
  },
  text: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold',
    color:'#3C4043',
  },
  text2: {
    fontSize: 13,
    fontFamily:'Roboto-Regular',
    color:'#3C4043'
  },
  quantityContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom:10
  },
  quantityInput: {
    width: "62%",
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'OpenSans-Bold',
    color: '#3C4043',
    backgroundColor: '#F4F7FC',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: '#3C4043',
    borderRadius: 7,
    padding: 8,
    elevation: 4,
    width: '18%',
  },
  ///////////////////////////////////////////////////////
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
    margin: 10,
  },
  buttonText2: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
const mapStateProps = ({ pedidos,cardapio,paes }: { pedidos: any,cardapio:any,paes:any }) => {
  return {
    adicionar_pedido: pedidos.adicionar_pedido,
    cardapio:cardapio.cardapio,
    paes: paes.paes

  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAdicionar_pedido: (pedido:[]) => dispatch(setAdicionar_pedido(pedido)),
  };
};
export default connect(mapStateProps,mapDispatchProps)(adicionar_retirar)