import { Alert } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';


export const createAndOpenPDF = async (item: any, info: any) => {
  const htmlContent = generateHTMLForItems(item, info);

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Opção para compartilhar o PDF
    const options = { UTI: '.pdf', mimeType: 'application/pdf' };
    await shareAsync(uri, options);
  } catch (error) {
    Alert.alert('Erro ao criar ou compartilhar o PDF. Entre em contato com o suporte');
  }
};

// Exemplo de uso em algum componente:
// createAndOpenPDF(itemsData, extraInfoData);

///////////////////////////////////HTML////////////////////////////////////////

const ItemComponent = (props: { item: any }) => {
  const { name_p, quantidade, valor_p, adicionar_p, retirar_p } = props.item;
  // console.log(name_p)
  // Função para gerar a lista de adicionais
  const generateAdicionaisList = (adicionais: any) => {
    if (adicionais && adicionais.length > 0) {
      const adicionaisList = adicionais.map((adicional: any, index: number) => (
        `<li key=${index} style="font-size: 40px; margin-left: 20px;">${adicional}</li>`
      ));

      return `
      <div style="width: 100%; margin-top: 10px;">
        <p style="font-size: 40px; font-weight: bold;">Adicionais:</p>
        <ul>${adicionaisList.join('')}</ul>
      </div>`;
    }

    return '';
  };
  
  const generateRetirarList = (retirar: any) => {
    if (retirar && retirar.length > 0) {
      const adicionaisList = retirar.map((retirar: any, index: number) => (
        
        `<li key=${index} style="font-size: 40px; margin-left: 20px;">${retirar}</li>`
      ));

      return `
      <div style="width: 100%; margin-top: 10px;">
        <p style="font-size: 40px; font-weight: bold;">Retirar:</p>
        <ul>${adicionaisList.join('')}</ul>
      </div>`
      ;
    }

    return '';
  };

  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; border-bottom: 5px dotted  #000; padding: 10px 0;">
      <div style="width: 40%; font-size: 50px; font-weight: bold;">${name_p}</div>
      
      <div style="display: flex; flex-direction: row;justify-content: space-between; align-items: center; width: 50%;">
        <div style="font-size: 45px; margin-right: 20px;">x${quantidade}</div>
        <div style="font-size: 55px; font-weight: bold;">R$ ${valor_p.toFixed(2)}</div>
      </div>
     
    </div>
    ${adicionar_p || retirar_p?`<div style="display: flex; flex-direction: row; justify-content: space-between; border-bottom: 5px dashed  #000;  padding: 10px 0;">
      ${generateAdicionaisList(adicionar_p)}
      ${generateRetirarList(retirar_p)}
    </div>`:''}
  `;
};

export const generateHTMLForItems = (items: any, info: any) => {
  // Calcula o valor total
  const totalValue = items.reduce((total: number, item: any) => total + (item.valor_p*item.quantidade), 0).toFixed(2);

  // Cria os componentes para cada item
  const itemComponents = items.map((item: any, index: number) => (
    `<li key=${index} style="list-style-type: none; margin: 10px 0; padding: 8px; width: 94%;">
      ${ItemComponent({ item })}
    </li>`
  ));

  // Adiciona o total ao final do HTML
  const totalHTML = `<h2 style="text-align: center; font-size: 75px; font-weight: bold; border-bottom: 2px dashed #000;">Total: R$ ${totalValue}</h2>`;

  // Adiciona informações extras ao final do HTML
  const extraInfoHTML = generateExtraInfoHTML(info);

  // Retorna o HTML completo
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 15px;
          }
          h1 {
            text-align: center;
            font-size: 80px; 
          }
          h2 {
            text-align: center;
            font-size: 65px; 
            border-bottom: 2px solid #000;
          }
          ul {
            list-style-type: none;
            padding: 0;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>Madrugão Lanches</h1>
        <h2>Itens do Pedido :</h2>
        <ul>
          ${itemComponents.join('')}
        </ul>
        ${totalHTML}
        ${extraInfoHTML}
      </body>
    </html>
  `;
};


// Função para gerar informações extras
const generateExtraInfoHTML = (info: any) => {
  // Cria uma div para cada informação extra
  const extraInfoDivs = info
    .map((item: any, index: number) => {
      if (item !== undefined && item !== false) {
        if (item === true && index===1) {
          return `
            <div key=${index} style="text-align: left; font-size: 60px;">Entrega :</div>
            <div key=${index} style="text-align: left; font-size: 50px; border-bottom: 2px dashed #000;">Pegar no local</div>
          `;
        }else if(item === true && index===6){
          return `
            <div key=${index} style="text-align: left; font-size: 60px; border-bottom: 2px dashed #000;">Forma de Pagamento :</div>
            <div key=${index} style="text-align: left; font-size: 50px;">Pix</div>
          `;
        } else {
          if (index === 0) {
            return `<div key=${index} style="text-align: left; font-size: 50px;">Numero da Mesa: ${item}</div>`;
          } else if (index === 2 && info[1] === false && item !== '') {
            return `
            <div key=${index} style="text-align: left; font-size: 60px;">Entrega :</div>
            <div key=${index} style="text-align: left; font-size: 48px;">Rua: ${item}</div>`;
          } else if (index === 3 && info[1] === false && item !== '') {
            return `
            <div key=${index} style="text-align: left; font-size: 48px; border-bottom: 2px dashed #000;">Numero: ${item}</div>`; 
          }else if (index === 4 && item > 0){
            return `
            <div key=${index} style="text-align: left; font-size: 60px; ">Forma de Pagamento :</div>
            <div key=${index} style="text-align: left; font-size: 50px; border-bottom: 2px dashed #000;">Dinheiro: ${item}</div>`; 
          }else if (index === 5){
              if(item.visa){
                return `
                <div key=${index} style="text-align: left; font-size: 60px; ">Forma de Pagamento :</div>
                <div key=${index} style="text-align: left; font-size: 50px; border-bottom: 2px dashed #000;">Cartão: Visa</div>
                `
              }else if(item.mastercard){
                return `
                <div key=${index} style="text-align: left; font-size: 60px; ">Forma de Pagamento :</div>
                <div key=${index} style="text-align: left; font-size: 50px; border-bottom: 2px dashed #000;">Cartão: Mastercard</div>
                `
              }else if(item.elo){
                return `
                <div key=${index} style="text-align: left; font-size: 60px; ">Forma de Pagamento :</div>
                <div key=${index} style="text-align: left; font-size: 50px; border-bottom: 2px dashed #000;">Cartão: elo</div>
                `
              }
          }
        }
      }
      return ''; // Retorna uma string vazia para os casos em que item é undefined ou false
    });

  // Retorna as divs como uma string
  return extraInfoDivs.join('');
};





// const array = ['rafa','renan','rafa','renan','rafa','renan','rafa','renan']
// const te = generateHTMLForItems(array)