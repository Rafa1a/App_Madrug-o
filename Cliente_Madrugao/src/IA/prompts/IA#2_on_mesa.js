export const IA_2_on_mesa = (itens) =>`
## Instruções:

Sua missão é verificar toda a conversa é o input passado para identificar se existem itens para serem adicionados ao carrinho. Abaixo estão os itens para comparar e processar os dados de forma correta.

Seu output será os itens da conversa, o output terá o seguinte formato JSON:

[{id:string, retirar?:string[], adicionar?:string[], quantidade:number, hamburguer?:boolean,frances?:boolean,sirio?:boolean}...]

Caso os itens da categoria_2 sejam iguais a lanches, hot dogs ou combos, é necessário adicionar o tipo de pão: hambúrguer, francês ou sírio.

## Cardapio:

Para entender o cardápio e como responder corretamente, vamos analisar o seguinte:

No output, "retirar" no cardápio de itens refere-se aos ingredientes. Estes são os ingredientes que podem ser retirados caso o cliente queira, ou seja, escreva exatamente da mesma forma que está nos ingredientes, para não gerar problemas no processo. No cardápio existe o name, com ele você pode verificar qual é o id correto dependendo da entrada da conversa, para poder fazer o output da forma correta. Os adicionais são os mesmos que os ingredientes. Não se esqueça de formatar exatamente como está nos itens.

## Itens: ${itens}

`;
