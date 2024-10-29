/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,} from "@google/generative-ai";
const apiKey = 'apiKey';
const genAI = new GoogleGenerativeAI(apiKey);
async function Ia_generete(input : string,text_prompt : string, IA_escolha : string) {
    
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: `application/json`,
    };
    const safetySettings = [
        {category : HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,threshold: HarmBlockThreshold.BLOCK_NONE},
        {category: HarmCategory.HARM_CATEGORY_HARASSMENT,threshold: HarmBlockThreshold.BLOCK_NONE},
        {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,threshold: HarmBlockThreshold.BLOCK_NONE},
        {category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,threshold: HarmBlockThreshold.BLOCK_NONE},
        //    {category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,threshold: HarmBlockThreshold.BLOCK_NONE}7*8
    ]
    let parts = []
    if (IA_escolha === 'ia_1'){
        const parts_1 = [
            {text: text_prompt },
            {text: "input: user : ola quero uma porcao de fritas  model : Olá! 😄 ok então uma porção de fritas? Temos o tamanho Baby, Meia e a porção tradicional. Qual tamanho você prefere? 😉   user : vou querer uma normal e um guarana 2l  model : Perfeito! Uma porção normal de fritas e um guaraná 2L.  Você quer algum outro item? 😋   user : não só isso mesmo  model :  Ok! Então, para confirmar, você quer:    1 Porção de fritas normal    1 Guaraná 2L    Confirma o pedido? 😉   user : sim  model : Ótimo! Para confirmar seu pedido, siga estas etapas:  1. Verifique se todos os itens desejados estão na conversa.  2. Clique no botão \"Confirmar Pedido\" no app, que está disponível na conversa que você está tendo com comigo.  3. Na tela de confirmação, verifique se todos os itens estão corretos e clique em \"Confirmar Pedido\".  4. Após a confirmação, os itens serão adicionados ao carrinho e você poderá finalizar o pedido com a forma de pagamento desejada.  Seu pedido será entregue em 30 minutos a 1 hora. 😊"},
            {text: "output: {itens: true}"},
            {text: "input: user: ola boa noite model : Olá! Boa noite! 😄  O que posso fazer por você hoje? 😋  Estamos com um cardápio delicioso,  tudo fresquinho e feito com muito carinho! 🥰  Que tal darmos uma olhada no que temos para você? 😉"},
            {text: "output: {itens: false}"},
            {text: "input: user : ola quero um suco de laranjamodel : Olá! 😄 ok então um suco de laranja? 😋 Ele pode ser com água ou com leite. Você prefere qual? 😉user : com águamodel : Perfeito! 😄 Suco de laranja com água, anotado! 😋 Você quer adicionar mais algum sabor ao seu suco? Pode escolher até 2 sabores. 😉 user : só isso mesmomodel : Ok! 😄 Então, para confirmar, você quer:1 Suco de laranja com águaConfirma o pedido? 😉 user : isso mesmomodel : Ótimo! 🤩 Para confirmar seu pedido, siga estas etapas:1. Verifique se todos os itens desejados estão na conversa.2. Clique no botão \"Confirmar Pedido\" no app, que está disponível na conversa que você está tendo com comigo.3. Na tela de confirmação, verifique se todos os itens estão corretos e clique em \"Confirmar Pedido\".4. Após a confirmação, os itens serão adicionados ao carrinho e você poderá finalizar o pedido com a forma de pagamento desejada.Seu pedido será entregue em 30 minutos a 1 hora. 😊"},
            {text: "output: {itens: true}"},
            {text: "input: user : ola quero um suco de laranjamodel : Olá! 😄 ok então um suco de laranja? 😋 Ele pode ser com água ou com leite. Você prefere qual? 😉user: com águamodel : Perfeito! 😄 Suco de laranja com água, anotado! 😋 Você quer adicionar mais algum sabor ao seu suco? Pode escolher até 2 sabores. 😉 user : só isso mesmomodel : Ok! 😄 Então, para confirmar, você quer:1 Suco de laranja com águaConfirma o pedido? 😉"},
            {text: "output: {itens: true}"},
            {text: "input: user:ola quero um suco com agua model:Olá! 😄 Que tal um suco com água? 😋 Temos vários sabores, qual você gostaria? 😉  Você pode escolher até 2 sabores. 😉"},
            {text: "output: {itens: false}"},
            {text: "input: user:ola quero um suco com agua model:Olá! 😄 Que tal um suco com água? 😋 Temos vários sabores, qual você gostaria? 😉  Você pode escolher até 2 sabores. 😉 user:quais os sabores? model:😄 Temos abacaxi, abacaxi com hortelã, acerola, caju, goiaba, limão, laranja, maracujá, mamão, melão, morango, pêssego, tamarindo e uva. 😋 Qual te agrada mais? 😉"},
            {text: "output: {itens: false}"},
            {text: "input: user:ola quero um suco com agua model:Olá! 😄 Que tal um suco com água? 😋 Temos vários sabores, qual você gostaria? 😉  Você pode escolher até 2 sabores. 😉 user:quais os sabores? model:😄 Temos abacaxi, abacaxi com hortelã, acerola, caju, goiaba, limão, laranja, maracujá, mamão, melão, morango, pêssego, tamarindo e uva. 😋 Qual te agrada mais? 😉 user:pode ser o de abacaxi"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero uma porcao de calabresa model:Olá! 😄 Que tal uma porção de calabresa? Temos o tamanho Meia porção e a porção tradicional. Qual tamanho você prefere? 😉"},
            {text: "output: {itens: false}"},
            {text: "input: user:quero uma porcao de calabresa model:Olá! 😄 Que tal uma porção de calabresa? Temos o tamanho Meia porção e a porção tradicional. Qual tamanho você prefere? 😉 user:quero a normal mesmo"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero uma porcao de calabresa model:Olá! 😄 Que tal uma porção de calabresa? Temos o tamanho Meia porção e a porção tradicional. Qual tamanho você prefere? 😉 user:quero a normal mesmo model:Perfeito! 😄 Uma porção normal de calabresa, anotado! 😋  Você deseja mais alguma coisa? 😉"},
            {text: "output: {itens: true}"},
            {text: "input: user: quero uma porcao de fritas model: Olá! 😄 Que tal uma porção de fritas? Temos o tamanho Baby, Meia e a porção tradicional. Qual tamanho você prefere? 😉"},
            {text: "output: {itens: false}"},
            {text: "input: user: quero uma porcao de fritas model: Olá! 😄 Que tal uma porção de fritas? Temos o tamanho Baby, Meia e a porção tradicional. Qual tamanho você prefere? 😉 user:quero a maior"},
            {text: "output: {itens: true}"},
            {text: "input: user:eu quero um hotdog grandao model:Olá! 😄  O maior hot dog que temos é o Hot Especial 1,2,3...  Ele leva calabresa, bacon, frango desfiado, duas salsichas, tomate, alface, milho, ervilha, batata palha, ketchup e mostarda. 😋 Que tipo de pão você prefere: Hambúrguer, Francês ou Sírio? (O pão sírio tem um adicional de R$ 4,00) 😉"},
            {text: "output: {itens: false}"},
            {text: "input: user:eu quero um hotdog grandao model:Olá! 😄  O maior hot dog que temos é o Hot Especial 1,2,3...  Ele leva calabresa, bacon, frango desfiado, duas salsichas, tomate, alface, milho, ervilha, batata palha, ketchup e mostarda. 😋 Que tipo de pão você prefere: Hambúrguer, Francês ou Sírio? (O pão sírio tem um adicional de R$ 4,00) 😉 user: pode ser o pão sirio."},
            {text: "output: {itens: true}"},
            {text: "input: user:eu quero um hotdog grandao model:Olá! 😄  O maior hot dog que temos é o Hot Especial 1,2,3...  Ele leva calabresa, bacon, frango desfiado, duas salsichas, tomate, alface, milho, ervilha, batata palha, ketchup e mostarda. 😋 Que tipo de pão você prefere: Hambúrguer, Francês ou Sírio? (O pão sírio tem um adicional de R$ 4,00) 😉 user: pode ser o pão sirio. model: Perfeito! 🤩  Então anotado: 1 Hot Especial 1,2,3... no pão sírio. 😋  Você deseja mais alguma coisa? 😉"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero um drink model: Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉"},
            {text: "output: {itens: false}"},
            {text: "input: user:quero um drink model: Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉 user:uma caipirinha model:Uma caipirinha, ótima pedida! 🤩  Com qual fruta você prefere? Temos limão e maracujá. 😉"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero um drink model: Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉 user:uma caipirinha model:Uma caipirinha, ótima pedida! 🤩  Com qual fruta você prefere? Temos limão e maracujá. 😉 user:quero com maracujá"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero um drink model: Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉 user:quero um drink martini"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero um drink model: Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉 user:quero uma capiroska"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero um drink model: Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉 user:quero uma capiroska model:Uma ótima escolha! 😄 A caipiroska é deliciosa! 😋  Você prefere com limão ou maracujá? 😉"},
            {text: "output: {itens: true}"},
            {text: "input: user:quero um drink model: Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉 user:quero uma capiroska model:Uma ótima escolha! 😄 A caipiroska é deliciosa! 😋  Você prefere com limão ou maracujá? 😉 user:maracuja"},
            {text: "output: {itens: true}"},
            {text: "input: user:ola boa noite model:Olá! Boa noite! 😄  O que posso fazer por você hoje? 😋 Nosso cardápio está recheado de delícias! 😉 Você vai pedir para entrega ou para retirar no balcão?  user:vou querer 3 x-tudo com catupiry, 1 x-salada e uma coca2l. todos com o pao frances model:Que delícia! 🤩  3 X-Tudo com catupiry, 1 X-Salada e uma Coca-Cola 2L, tudo no pão francês! 😋  Anotadinho! 😉  Você gostaria de mais alguma coisa? 😄"},
            {text: "output: {itens: true}"},
            {text: `input: ${input}`},
            {text: "output: "},
        ];
        parts = parts_1;
    }else {
        const parts_2 = [
            {text: text_prompt},
            {text: "input: user:ola quero um drink model:Olá! 😄 Que tipo de drink você está afim? 😋 Temos várias opções, como caipirinha, caipiroska, saquerinha, gin tônica, e outras delícias.  O que você prefere? 😉 user: quero uma gin tonica"},
            {text: "output: [{\"id\":\"96bPY3EohvIljqSYzC5U\",\"quantidade\":1}]"},
            {text: "input: user : ola quero uma porcao de fritas  model : Olá! 😄 ok então uma porção de fritas? Temos o tamanho Baby, Meia e a porção tradicional. Qual tamanho você prefere? 😉   user : vou querer uma normal e um guarana 2l  model : Perfeito! Uma porção normal de fritas e um guaraná 2L.  Você quer algum outro item? 😋   user : não só isso mesmo  model :  Ok! Então, para confirmar, você quer:    1 Porção de fritas normal    1 Guaraná 2L    Confirma o pedido? 😉   user : sim  model : Ótimo! Para confirmar seu pedido, siga estas etapas:  1. Verifique se todos os itens desejados estão na conversa.  2. Clique no botão \"Confirmar Pedido\" no app, que está disponível na conversa que você está tendo com comigo.  3. Na tela de confirmação, verifique se todos os itens estão corretos e clique em \"Confirmar Pedido\".  4. Após a confirmação, os itens serão adicionados ao carrinho e você poderá finalizar o pedido com a forma de pagamento desejada.  Seu pedido será entregue em 30 minutos a 1 hora. 😊"},
            {text: "output: [{\"id\":\"glShmWGBktNneOWgZBL8\",\"quantidade\":1},{\"id\":\"HUoqtBVsYoVqTnll8myl\",\"quantidade\":1}]"},
            {text: "input: user : ola quero um suco de laranjamodel : Olá! 😄 ok então um suco de laranja? 😋 Ele pode ser com água ou com leite. Você prefere qual? 😉user : com águamodel : Perfeito! 😄 Suco de laranja com água, anotado! 😋 Você quer adicionar mais algum sabor ao seu suco? Pode escolher até 2 sabores. 😉 user : só isso mesmomodel : Ok! 😄 Então, para confirmar, você quer:1 Suco de laranja com águaConfirma o pedido? 😉 user : isso mesmomodel : Ótimo! 🤩 Para confirmar seu pedido, siga estas etapas:1. Verifique se todos os itens desejados estão na conversa.2. Clique no botão \"Confirmar Pedido\" no app, que está disponível na conversa que você está tendo com comigo.3. Na tela de confirmação, verifique se todos os itens estão corretos e clique em \"Confirmar Pedido\".4. Após a confirmação, os itens serão adicionados ao carrinho e você poderá finalizar o pedido com a forma de pagamento desejada.Seu pedido será entregue em 30 minutos a 1 hora. 😊"},
            {text: "output: [{\"id\":\"webivg5NOSWWfacYFIMh\",\"adicionar\":\"Laranja\",\"quantidade\":1}]"},
            {text: "input: user : ola quero um suco de laranjamodel : Olá! 😄 ok então um suco de laranja? 😋 Ele pode ser com água ou com leite. Você prefere qual? 😉user: com águamodel : Perfeito! 😄 Suco de laranja com água, anotado! 😋 Você quer adicionar mais algum sabor ao seu suco? Pode escolher até 2 sabores. 😉 user : só isso mesmomodel : Ok! 😄 Então, para confirmar, você quer:1 Suco de laranja com águaConfirma o pedido? 😉"},
            {text: "output: [{\"id\":\"webivg5NOSWWfacYFIMh\",\"adicionar\":\"Laranja\",\"quantidade\":1}]"},
            {text: "input: user:ola quero um suco com agua model:Olá! 😄 Que tal um suco com água? 😋 Temos vários sabores, qual você gostaria? 😉  Você pode escolher até 2 sabores. 😉 user:quais os sabores? model:😄 Temos abacaxi, abacaxi com hortelã, acerola, caju, goiaba, limão, laranja, maracujá, mamão, melão, morango, pêssego, tamarindo e uva. 😋 Qual te agrada mais? 😉 user:pode ser o de abacaxi"},
            {text: "output: [{\"id\":\"webivg5NOSWWfacYFIMh\",\"adicionar\":\" abacaxi\",\"quantidade\":1}]"},
            {text: "input: user:quero uma porcao de calabresa model:Olá! 😄 Que tal uma porção de calabresa? Temos o tamanho Meia porção e a porção tradicional. Qual tamanho você prefere? 😉 user:quero a normal mesmo"},
            {text: "output: [{\"id\":\"JgJSo73SbczeEJM1LvMC\",\"quantidade\":1}]"},
            {text: "input: user:quero uma porcao de calabresa model:Olá! 😄 Que tal uma porção de calabresa? Temos o tamanho Meia porção e a porção tradicional. Qual tamanho você prefere? 😉 user:quero a meia mesmo"},
            {text: "output: [{\"id\":\"Tk6b7ngZ9wBSxhGV0Fg1\",\"quantidade\":1}]"},
            {text: "input: user: quero uma porcao de fritas model: Olá! 😄 Que tal uma porção de fritas? Temos o tamanho Baby, Meia e a porção tradicional. Qual tamanho você prefere? 😉 user:quero a maior"},
            {text: "output: [{\"id\":\"glShmWGBktNneOWgZBL8\",\"quantidade\":1}]"},
            {text: "input: user:ola boa noite model:Olá! Boa noite! 😄  O que posso fazer por você hoje? 😋 Nosso cardápio está recheado de delícias! 😉 Você vai pedir para entrega ou para retirar no balcão?  user:vou querer 3 x-tudo com catupiry, 1 x-salada e uma coca2l. todos com o pao frances model:Que delícia! 🤩  3 X-Tudo com catupiry, 1 X-Salada e uma Coca-Cola 2L, tudo no pão francês! 😋  Anotadinho! 😉  Você gostaria de mais alguma coisa? 😄"},
            {text: "output: [{\"id\":\"7XUua6otb1Uyc7iQhAR0\",\"adicionar\":[\"Catupiry \"],\"quantidade\":3,\"frances\":true},{\"id\":\"wrKnkugMgzIrnjiVRtZr\",\"quantidade\":1,\"frances\":true},{\"id\":\"Jn3eZ2zF2CgXWYfeCVOJ\",\"quantidade\":1}]"},
            {text: "input: user:ola boa noite model:Olá! Boa noite! 😄  O que posso fazer por você hoje? 😋 Nosso cardápio está recheado de delícias! 😉 Você vai pedir para entrega ou para retirar no balcão?  user:vou querer 3 x-tudo com catupiry, 1 x-salada e uma coca2l. todos com o pao frances model:Que delícia! 🤩  3 X-Tudo com catupiry, 1 X-Salada e uma Coca-Cola 2L, tudo no pão francês! 😋  Anotadinho! 😉  Você gostaria de mais alguma coisa? 😄 user:só isso mesmo model:Perfeito! 🤩  Então vamos lá:\n\n* 3 X-Tudo com catupiry no pão francês\n* 1 X-Salada no pão francês\n* 1 Coca-Cola 2L \n\nPara confirmar seu pedido, siga estas etapas:\n\n1. Verifique se todos os itens desejados estão na conversa.\n2. Clique no botão \"Confirmar Pedido\" no app, que está disponível na conversa que você está tendo com comigo.\n3. Na tela de confirmação, verifique se todos os itens estão corretos e clique em \"Confirmar Pedido\".\n4. Após a confirmação, os itens serão adicionados ao carrinho e você poderá finalizar o pedido com a forma de pagamento desejada.\n\nSeu pedido será entregue em 30 minutos a 1 hora. 😊"},
            {text: "output: [{\"id\":\"7XUua6otb1Uyc7iQhAR0\",\"adicionar\":[\"Catupiry \"],\"quantidade\":3,\"frances\":true},{\"id\":\"wrKnkugMgzIrnjiVRtZr\",\"quantidade\":1,\"frances\":true},{\"id\":\"Jn3eZ2zF2CgXWYfeCVOJ\",\"quantidade\":1}]"},
            {text: "input: user:eu quero um hotdog grandao model:Olá! 😄  O maior hot dog que temos é o Hot Especial 1,2,3...  Ele leva calabresa, bacon, frango desfiado, duas salsichas, tomate, alface, milho, ervilha, batata palha, ketchup e mostarda. 😋 Que tipo de pão você prefere: Hambúrguer, Francês ou Sírio? (O pão sírio tem um adicional de R$ 4,00) 😉 user: pode ser o pão sirio."},
            {text: "output: [{\"id\":\"c5iw17YhxaJpoj97u4kT\",\"quantidade\":1,\"sirio\":true}]"},
            {text: `input: ${input}`},
            {text: "output: "},
            ];
        parts = parts_2
    }
    console.log('ate aki foi ',IA_escolha)
    const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings: safetySettings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    });
    // console.log(result.response.text());
    return result.response.text();
}
export default Ia_generete;