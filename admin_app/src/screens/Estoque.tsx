import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { fetchatualizar_cardapio_estoque, fetchatualizar_cardapio_onoroff } from '../store/action/cardapio';
import { Avatar, Button, Icon, ListItem, Tab, TabView } from '@rneui/themed';
import Estoque_list from '../components/Estoque_list';
import { cardapio, estoque_screen } from '../interface/inter_cardapio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Loja_up } from '../store/action/message_fechado_aberto';
import Estoque_list_pai from '../components/Estoque_list_pai';
import { fetchUpdatePaes, fetchUpdatepedidos_Paes_status } from '../store/action/paes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Estoque(props: estoque_screen) {
  // index da tab 
  const [index, setIndex] = React.useState(0);
  // controle expansão do ListItem.Accordion
  const [expanded, setExpanded] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false); 
  const [expanded3, setExpanded3] = React.useState(false); 
  const [expanded4, setExpanded4] = React.useState(false);
  // estoque automatico
  useEffect(() => {
    const func_estoque =async()=>{
      const cardapio_bebidas = props.cardapio.filter((item:any)=> item.categoria === 'bebidas')
      // console.log(cardapio_bebidas[4].estoque)
      for (let i = 0; i < cardapio_bebidas.length; i++) {
        const item = cardapio_bebidas[i]; 
        // funcao caso o estoque seja 0 atualizar o onorof para false, retiraando o item do ar automaticamente  
        // console.log('nome',item.name)
        // console.log('estoque',item.estoque)
        if (item.estoque <= 0 && item.estoque !== -1) {
          await props.onAtualizar_onorof(item.id, false);
          await props.onAtualizar_estoque(item.id,-1)
          console.log(item.estoque)
        } 
      } 
    }
    func_estoque()  
  
  }, [props.cardapio]);
   
  // retirar categoria repetidas
  const uniqueCategories = [...new Set(props.cardapio.map((item: any) => item.categoria))];
  //////////////////////////////////////BARRA DE BUSCA////////////////////////////////////////
  const [search, setSearch] = useState('');
  //separar e filtrar
   //separar e filtrar
 const bebidas:any = props.cardapio.filter((item:any) =>
    item.categoria === 'bebidas' &&
    (item.versao === undefined ||  item.versao === null) &&
    item.name.toLowerCase().replace(/\s/g, '').startsWith(search.toLowerCase().replace(/\s/g, ''))
  )

  const comidas = props.cardapio.filter((item:any) =>
    item.categoria === 'comidas' &&
    (item.versao === undefined ||  item.versao === null) &&
    item.name.toLowerCase().replace(/\s/g, '').startsWith(search.toLowerCase().replace(/\s/g, ''))
  )

  const bar = props.cardapio.filter((item:any) =>
    item.categoria === 'bar' &&
    (item.versao === undefined ||  item.versao === null) &&
    item.name.toLowerCase().replace(/\s/g, '').startsWith(search.toLowerCase().replace(/\s/g, ''))
  )
  //categoria do flatlist do ListItem.Accordion
  const categoria_Bebidas = ['no-alcool','alcool']
  const categoria_comidas = ['lanches','hotdogs','porcoes','combos']
  const categoria_bar = ['drinks','sucos','outros']
  //return componente
 /////////////////////////////////////////////////////////////
  //atualizar o Item pai caso nao tenha filhos ou os filhos esta com o onorof === false
  useEffect(() => {
    const func_bebidas =async()=>{
      bebidas.map(async(item:any)=>{
        const item_filho = props.cardapio.filter((item2:any)=> item2.versao === item.id)
        if(item_filho.length === 0){
          await props.onAtualizar_onorof(item.id,false)
        }else{
          const item_filho_onorof = item_filho.filter((item3:any)=> item3.onorof === true)
          if(item_filho_onorof.length === 0){
            await props.onAtualizar_onorof(item.id,false)
          }
        }
      })
    }
    const func_comidas =async()=>{
      comidas.map(async(item:any)=>{
        const item_filho = props.cardapio.filter((item2:any)=> item2.versao === item.id)
        if(item_filho.length === 0){
          await props.onAtualizar_onorof(item.id,false)
        }else{
          const item_filho_onorof = item_filho.filter((item3:any)=> item3.onorof === true)
          if(item_filho_onorof.length === 0){
            await props.onAtualizar_onorof(item.id,false)
          }
        }
      })
    }
    const func_bar =async()=>{
      bar.map(async(item:any)=>{
        const item_filho = props.cardapio.filter((item2:any)=> item2.versao === item.id)
        if(item_filho.length === 0){
          await props.onAtualizar_onorof(item.id,false)
        }else{
          const item_filho_onorof = item_filho.filter((item3:any)=> item3.onorof === true)
          if(item_filho_onorof.length === 0){
            await props.onAtualizar_onorof(item.id,false)
          }
        }
      })
    } 
    func_comidas()
    func_bar() 
    func_bebidas() 
  
  }, [props.cardapio]);
  /////////////////////////////////////////paes hamburguer e frances auto estoque////////////////////////////////////////
  useEffect(() => {
      const func_paes = async () => {
          let hamburguer = props.paes.hamburguer;
          let frances = props.paes.frances;
          let sirio = props.paes.sirio;
          for (const item of props.pedidos) {
              if (item.status_pao === true) return;
              for (const item2 of item.itens) {
                  if (item2.categoria_2 === 'lanches' || item2.categoria_2 === 'hotdogs') {
                      if (item2.hamburguer) {
                          hamburguer -= item2.quantidade;
                      } else if (item2.frances) {
                          frances -= item2.quantidade;
                      } else if (item2.sirio) {
                          sirio -= item2.quantidade;
                      }
                  }
              }
              await props.UpdatePaes(hamburguer, frances, sirio, props.paes.id);
              await props.upStatus_paes(item.id);
          }
      } 
      func_paes();
  }, [props.pedidos]); 
  return (
    <SafeAreaView style={styles.container}>
      {/* tab para navegacao entre as 3 pricnipais categorias*/}
      <Tab 
        dense
        value={index} onChange={(e) => setIndex(e)} 
        variant="primary"
        indicatorStyle={{
          backgroundColor: '#E8F0FE',
          height: 3
        }}
        buttonStyle={{
          backgroundColor: '#2D2F31',
        }}
        titleStyle={{
          fontFamily:'OpenSans-Bold',
          color:'#F4F7FC'
        }}
      >
        {uniqueCategories.map((category: any, index: number) => {
          let categoryName = '';
          if (category === 'comidas') {
            categoryName = 'Comidas';
          } else if (category === 'bar') {
            categoryName = 'Bar';
          } else if (category === 'bebidas') {
            categoryName = 'Bebidas';
          }
          return (
            
            <Tab.Item key={index} title={categoryName}  />
          );
        })}
      </Tab>
      {/* barra de busca */}
      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',width:'100%'}}>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar..."
          placeholderTextColor="#F4F7FC"
        />
        {/*apagar busca */}
        <MaterialCommunityIcons name="delete-circle" size={35} color="#ffffff" onPress={() => setSearch('')} />
        {/* <Button
          title="Apagar"
          onPress={() => setSearch('')}
          buttonStyle={{backgroundColor:'#3c4043',borderColor:'tomato'}}
          titleStyle={{fontFamily:'OpenSans-Bold',color:'#F4F7FC'}}
          containerStyle={{marginLeft:50,marginRight:50}}
        /> */}
      </View>
      <TabView value={index} onChange={setIndex} animationType="spring" >
        {uniqueCategories.map((category: any, index: number) => {
          let data = [];
          let categoryName = '';
          if (category === 'comidas') {
            data = categoria_comidas;
            categoryName = 'Comidas';
          } else if (category === 'bar') {
            data = categoria_bar;
            categoryName = 'Bar';
          } else if (category === 'bebidas') {
            data = categoria_Bebidas;
            categoryName = 'Bebidas';
          }
          return (
            <TabView.Item key={index} style={{  width: '100%' }}>
              <FlatList
                data={data}
                keyExtractor={(item,index) => `${index}`}
                renderItem={({ item,index }) =>  {
              
                  if(item === 'lanches'){
                    
                  return (
                  <ListItem.Accordion
                    content={
                      <ListItem.Content>
                        <ListItem.Title style={styles.title}>Lanches</ListItem.Title>
                      </ListItem.Content>
                    }
                    isExpanded={expanded}
                    onPress={() => {
                      setExpanded(!expanded);
                      setExpanded2(false)
                      setExpanded3(false)
                      setExpanded4(false);
                    }}
                    containerStyle={styles.tabaccordion}
                  >
                      {/* flatlist dos itens do cardapio === lanches*/} 
    
                    <FlatList
                      data={comidas.filter((item:any)=> item.categoria_2 === 'lanches')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                    />
                  </ListItem.Accordion>)
                  }else if(item === 'hotdogs'){
                    return (
                    <ListItem.Accordion
                      content={
                        <ListItem.Content>
                          <ListItem.Title style={styles.title}>Hot Dogs</ListItem.Title>
                        </ListItem.Content>
                      }
                      isExpanded={expanded2}
                      onPress={() => {
                        setExpanded2(!expanded2);
                        setExpanded(false)
                        setExpanded3(false)
                        setExpanded4(false);
                      }}
                      containerStyle={styles.tabaccordion}
                    >
                    {/* flatlist dos itens do cardapio === hotdogs*/} 
                    <FlatList
                      data={comidas.filter((item:any)=> item.categoria_2 === 'hotdogs')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                    />
                    </ListItem.Accordion>
                    )
                  }else if (item === 'porcoes'){
                    return (
                    <ListItem.Accordion
                      content={
                        <ListItem.Content>
                          <ListItem.Title style={styles.title}>Porções</ListItem.Title>
                        </ListItem.Content>
                      }
                      isExpanded={expanded3}
                      onPress={() => {
                        setExpanded3(!expanded3);
                        setExpanded(false)
                        setExpanded2(false)
                        setExpanded4(false);
                      }}
                      containerStyle={styles.tabaccordion}
                    >
                    {/* flatlist dos itens do cardapio === porcoes*/} 
                    <FlatList
                      data={comidas.filter((item:any)=> item.categoria_2 === 'porcoes')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                    />
                    </ListItem.Accordion>
                    )
                  } else if(item === 'combos'){
                    return (
                    <ListItem.Accordion
                      content={
                        <ListItem.Content>
                          <ListItem.Title style={styles.title}>Combos</ListItem.Title>
                        </ListItem.Content>
                      }
                      isExpanded={expanded4}
                      onPress={() => {
                        setExpanded4(!expanded4);
                        setExpanded(false)
                        setExpanded2(false)
                        setExpanded3(false);
                      }}
                      containerStyle={styles.tabaccordion}
                    >
                    {/* flatlist dos itens do cardapio === combos*/} 
                    <FlatList
                      data={comidas.filter((item:any)=> item.categoria_2 === 'combos')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                    />
                    </ListItem.Accordion>
                    )
                  }else  if(item === 'no-alcool'){
                    return (
                      <ListItem.Accordion
                        content={
                          <ListItem.Content>
                            <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                            <ListItem.Subtitle style={styles.subtittle}>Refrigerantes</ListItem.Subtitle>
                          </ListItem.Content>
                        }
                        
                        isExpanded={expanded}
                        onPress={() => {
                          setExpanded(!expanded);
                          setExpanded2(false)
                          setExpanded3(false)
                        }}
                        containerStyle={styles.tabaccordion}
                      >
                      {/* flatlist dos itens do cardapio === no-alcool*/} 
                        <FlatList
                          data={bebidas.filter((item:any)=> item.categoria_2 === 'no-alcool')}
                          keyExtractor={(item,index) => `${index}`}
                          renderItem={({ item,index }) =>  (
                          <Estoque_list_pai 
                            onAtualizar_onorof={props.onAtualizar_onorof}
                            onAtualizar_estoque={props.onAtualizar_estoque}
                            {...item} 
                            estoq
                          />)}
                        />
                      </ListItem.Accordion>
                      )
                    
                  }else if(item === 'alcool'){
                    return (
                        
                      <ListItem.Accordion 
                        content={
                          <ListItem.Content >
                            <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                            <ListItem.Subtitle style={styles.subtittle}>Cervejas</ListItem.Subtitle >
                          </ListItem.Content>
                        }
                        isExpanded={expanded2}
                        onPress={() => {
                          setExpanded2(!expanded2);
                          setExpanded(false)
                          setExpanded3(false)
                        }}
                        containerStyle={styles.tabaccordion}
                      >
                        {/* flatlist dos itens do cardapio === alcool*/} 
                        <FlatList
                          data={bebidas.filter((item:any)=> item.categoria_2 === 'alcool')}
                          keyExtractor={(item,index) => `${index}`}
                          renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item} estoq  />}
                        />
                      </ListItem.Accordion>)
                  } else if(item === 'drinks'){
                
                      return (
                      <ListItem.Accordion
                        content={
                          <ListItem.Content>
                            <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                            <ListItem.Subtitle style={styles.subtittle}>Drinks</ListItem.Subtitle>
                          </ListItem.Content>
                        }
                        isExpanded={expanded}
                        onPress={() => {
                          setExpanded(!expanded);
                          setExpanded2(false)
                          setExpanded3(false)
                        }}
                        containerStyle={styles.tabaccordion}
                      >
                      {/* flatlist dos itens do cardapio === drinks*/} 
                      <FlatList
                        data={bar.filter((item:any)=> item.categoria_2 === 'drinks')}
                        keyExtractor={(item,index) => `${index}`}
                        renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                      />
                      </ListItem.Accordion>)
                  }else if(item === 'sucos'){
                        return (
                        <ListItem.Accordion
                          content={
                            <ListItem.Content>
                              <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                              <ListItem.Subtitle style={styles.subtittle}>Sucos</ListItem.Subtitle>
                            </ListItem.Content>
                          }
                          isExpanded={expanded2}
                          onPress={() => {
                            setExpanded2(!expanded2);
                            setExpanded(false)
                            setExpanded3(false)
                          }}
                          containerStyle={styles.tabaccordion}
                        >
                        {/* flatlist dos itens do cardapio === sucos*/} 
        
                        <FlatList
                          data={bar.filter((item:any)=> item.categoria_2 === 'sucos')}
                          keyExtractor={(item,index) => `${index}`}
                          renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                        />
                        </ListItem.Accordion>
                        )
                  }else if(item === 'outros'){
                    return (
                    <ListItem.Accordion
                      content={
                        <ListItem.Content>
                          <ListItem.Title style={styles.title}>Outros</ListItem.Title>
                        </ListItem.Content>
                      }
                      isExpanded={expanded3}
                      onPress={() => {
                        setExpanded3(!expanded3);
                        setExpanded(false)
                        setExpanded2(false)
                      }}
                      containerStyle={styles.tabaccordion}
                    >
                    {/* flatlist dos itens do cardapio === outros*/} 
                    <FlatList
                      data={bar.filter((item:any)=> item.categoria_2 === 'outros')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                    />
                    </ListItem.Accordion>
                    )
                  }
                  else {
                    return  null
                  }
                }}
              />
            </TabView.Item>
          );
        })}
      </TabView>
      {/* versao antiga */}
      {/* <TabView value={index} onChange={setIndex} animationType="spring" >
        criacao da 1 tabview Bebidas
        <TabView.Item style={{  width: '100%' }}>
          flatlist do accordion comidas
          <FlatList
            data={categoria_comidas}
            keyExtractor={(item,index) => `${index}`}
            renderItem={({ item,index }) =>  {
              
              if(item === 'lanches'){
                
              return (
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>Lanches</ListItem.Title>
                  </ListItem.Content>
                }
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                  setExpanded2(false)
                  setExpanded3(false)
                }}
                containerStyle={styles.tabaccordion}
              >
                  flatlist dos itens do cardapio === lanches 

                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'lanches')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
              </ListItem.Accordion>)
              }else if(item === 'hotdogs'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>Hot Dogs</ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expanded2}
                  onPress={() => {
                    setExpanded2(!expanded2);
                    setExpanded(false)
                    setExpanded3(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                flatlist dos itens do cardapio === hotdogs 
                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'hotdogs')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
                </ListItem.Accordion>
                )
              }else if (item === 'porcoes'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>Porções</ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expanded3}
                  onPress={() => {
                    setExpanded3(!expanded3);
                    setExpanded(false)
                    setExpanded2(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                flatlist dos itens do cardapio === porcoes 
                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'porcoes')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
                </ListItem.Accordion>
                )
              }
              return  null
            }}
          />
        </TabView.Item>
        criacao da 2 tabview comidas
        <TabView.Item style={{width: '100%' }}>
          flatlist do accordion Bebidas
          <FlatList
              data={categoria_Bebidas}
              keyExtractor={(item,index) => `${index}`}
              renderItem={({ item,index }) =>  {
                
                if(item === 'no-alcool'){
                  
                return (
                    
                <ListItem.Accordion 
                  content={
                    <ListItem.Content >
                      <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                      <ListItem.Subtitle style={styles.subtittle}>Cervejas</ListItem.Subtitle >
                    </ListItem.Content>
                  }
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                    setExpanded2(false)
                    setExpanded3(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                  flatlist dos itens do cardapio === alcool 
                  <FlatList
                    data={bebidas.filter((item:any)=> item.categoria_2 === 'alcool')}
                    keyExtractor={(item,index) => `${index}`}
                    renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item} estoq/>}
                  />
                </ListItem.Accordion>)
                }else if(item === 'alcool'){
                  return (
                  <ListItem.Accordion
                    content={
                      <ListItem.Content>
                        <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtittle}>Refrigerantes</ListItem.Subtitle>
                      </ListItem.Content>
                    }
                    isExpanded={expanded2}
                    onPress={() => {
                      setExpanded2(!expanded2);
                      setExpanded(false)
                      setExpanded3(false)
                    }}
                    containerStyle={styles.tabaccordion}
                  >
                  flatlist dos itens do cardapio === no-alcool 
                    <FlatList
                      data={bebidas.filter((item:any)=> item.categoria_2 === 'no-alcool')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) =>  (
                      <Estoque_list 
                        onAtualizar_onorof={props.onAtualizar_onorof}
                        onAtualizar_estoque={props.onAtualizar_estoque}
                        {...item} 
                        estoq
                      />)}
                    />
                  </ListItem.Accordion>
                  )
                }
                return  null
              }}
          />
        </TabView.Item>
        criacao da 3 tabview bar
        <TabView.Item style={{width: '100%' }}>
          <FlatList
            data={categoria_bar}
            keyExtractor={(item,index) => `${index}`}
            renderItem={({ item,index }) =>  {
              
              if(item === 'drinks'){
                
              return (
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                    <ListItem.Subtitle style={styles.subtittle}>Drinks</ListItem.Subtitle>
                  </ListItem.Content>
                }
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                  setExpanded2(false)
                  setExpanded3(false)
                }}
                containerStyle={styles.tabaccordion}
              >
              flatlist dos itens do cardapio === drinks 
              <FlatList
                data={bar.filter((item:any)=> item.categoria_2 === 'drinks')}
                keyExtractor={(item,index) => `${index}`}
                renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
              />
              </ListItem.Accordion>)
              }else if(item === 'sucos'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                      <ListItem.Subtitle style={styles.subtittle}>Sucos</ListItem.Subtitle>
                    </ListItem.Content>
                  }
                  isExpanded={expanded2}
                  onPress={() => {
                    setExpanded2(!expanded2);
                    setExpanded(false)
                    setExpanded3(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                flatlist dos itens do cardapio === sucos 

                <FlatList
                  data={bar.filter((item:any)=> item.categoria_2 === 'sucos')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
                </ListItem.Accordion>
                )
              }
              return  null
            }}
          />
        </TabView.Item>
      </TabView> */}
      {/* botoes de adicionar e retirar */}
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        {/* button para levar ao Cardapio_add */}
        <TouchableOpacity
          style={{
            backgroundColor: '#E8F0FE',
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('Cardapio_add')}
        >
          <Icon name="add" color="#2D2F31" size={30} />
        </TouchableOpacity>
        
        {/* controle de caixa */}
        <TouchableOpacity
            style={{
                backgroundColor: '#fff',
                padding: 15,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
            onPress={() => {
                props.navigation.navigate('Controle_caixa')
            }}
        > 
            <Text style={{color:'#2D2F31', fontSize: 18, fontWeight: 'bold'}}>Controle de Caixa</Text>
        </TouchableOpacity>
        {/* controle de caixa */}

        {/* button para levar ao Cardapio_retirar */}
        
        <TouchableOpacity
          style={{
            backgroundColor: '#E8F0FE',
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('Cardapio_retirar')}
        > 
          {/* <Icon name="remove" color="#2D2F31" size={30} /> */}
          <Ionicons name="construct" size={24} color="#2D2F31" />
        </TouchableOpacity>

        {/* button para levar ao Cardapio_retirar */}

      </View>

  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#202124',
  },
  tabaccordion:{
    backgroundColor:'#F4F7FC',
    borderBottomWidth:1, 
    borderRadius:25,
    margin:5
  },
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold'
  },
  subtittle:{
    fontSize: 12,
    fontFamily:'Roboto-Regular'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    margin: 10,
    color: '#F4F7FC',
    width: '80%',
  },
});

const mapStateProps = ({ cardapio,message,paes,pedidos}: { cardapio: any,message:any,paes:any,pedidos}) => {
  return {
    cardapio: cardapio.cardapio,
    fechado_aberto: message.fechado_aberto,
    paes: paes.paes,
    pedidos: pedidos.pedidos
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAtualizar_onorof: (id:any,onorof:any) => dispatch(fetchatualizar_cardapio_onoroff(id,onorof)),
    onAtualizar_estoque: (id:any,estoque:number) => dispatch(fetchatualizar_cardapio_estoque(id,estoque)),
    UpdatePaes : (hamburguer:any,frances:any,sirio:any,id:string) => dispatch(fetchUpdatePaes(hamburguer,frances,sirio,id)),
    upStatus_paes : (id:string) => dispatch(fetchUpdatepedidos_Paes_status(id)),

  };
};

export default connect(mapStateProps,mapDispatchProps)(Estoque);
