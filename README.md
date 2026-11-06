# Site de Pizzaria com pedido pelo WhatsApp

Cardápio online: o cliente escolhe os itens, informa o endereço e a forma de pagamento,
e o pedido chega pronto no WhatsApp da pizzaria. Não precisa de servidor nem banco de dados:
é só hospedar os arquivos (GitHub Pages, Netlify, Vercel, Hostinger etc.).

## Como adaptar para uma nova pizzaria

Edite **somente** o arquivo [Js/config.js](Js/config.js):

| O quê | Campo |
|---|---|
| Nome, slogan, logo | `nome`, `slogan`, `logo`, `icone` |
| Cores da marca | `cores.primaria`, `cores.secundaria`, `cores.escura` |
| WhatsApp que recebe os pedidos | `whatsapp` (só números, com 55 + DDD) |
| Telefone, Instagram, endereço, mapa | `telefone`, `instagram`, `endereco`, `linkMapa` |
| Horário de funcionamento | `horarios` (mostra "Aberto/Fechado" automaticamente) |
| Taxa de entrega, retirada, pagamentos | `taxaEntrega`, `permitirRetirada`, `formasPagamento` |
| Pizza com vários sabores | `montarPizza` (máx. de sabores e regra de preço) |
| Textos do topo e do "Sobre" | `hero`, `sobre` |
| Cardápio (categorias, itens, preços, fotos) | `cardapio` |

Fotos dos produtos ficam em `Img/Cardápio/...`. Item sem foto (`img: ""`) mostra uma imagem provisória.

## Mensagem enviada no WhatsApp

```
Boa noite! Gostaria de fazer um pedido:

2x Pizza Calabresa - R$ 96,00
1x Pizza Quatro Queijos - R$ 55,00

*Endereço de entrega:*
Rua das Flores, 45
Centro

*Nome:* Maria
*Pagamento:* Dinheiro (troco para R$ 200)

Subtotal: R$ 151,00
Taxa de entrega: R$ 5,00
*Valor total: R$ 156,00*
```

## Estrutura

```
index.html        estrutura da página
Styles/style.css  visual
Js/config.js      dados da pizzaria (editar aqui)
Js/app.js         lógica do cardápio, carrinho e WhatsApp
```
