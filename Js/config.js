/* =====================================================================
   CONFIGURAÇÃO DA PIZZARIA
   ---------------------------------------------------------------------
   Para adaptar o site a um novo cliente, edite APENAS este arquivo.
   Textos, telefone, endereço, horários, cores e cardápio ficam aqui.
   ===================================================================== */

const CONFIG = {
    // ------------------------------ Identidade ------------------------------
    nome: "Sua Pizzaria",
    slogan: "Pizzas e esfihas artesanais, quentinhas na sua porta.",
    logo: "",                       // ex.: "Img/Logo/logo.png" (vazio = logo em texto)
    icone: "Img/Logo/Icon.png",     // ícone da aba e do logo em texto

    cores: {
        primaria: "#c8102e",        // botões, destaques
        secundaria: "#1f7a3d",      // botão de finalizar / WhatsApp
        escura: "#1c1917",          // cabeçalho, rodapé
    },

    // ------------------------------- Contato --------------------------------
    // Somente números, com DDI + DDD. Ex.: 5511999998888
    whatsapp: "5511999999999",
    telefone: "(11) 9999-9999",
    instagram: "",                  // ex.: "suapizzaria" (sem @). Vazio = oculta
    endereco: "Rua Exemplo, 123 - Centro, Sua Cidade - SP",
    linkMapa: "",                   // link do Google Maps. Vazio = gerado pelo endereço

    // Horários de funcionamento (0 = domingo ... 6 = sábado). null = fechado
    horarios: {
        0: { abre: "18:00", fecha: "23:30" },
        1: null,
        2: { abre: "18:00", fecha: "23:00" },
        3: { abre: "18:00", fecha: "23:00" },
        4: { abre: "18:00", fecha: "23:00" },
        5: { abre: "18:00", fecha: "00:00" },
        6: { abre: "18:00", fecha: "00:00" },
    },

    // ------------------------------- Pedidos --------------------------------
    taxaEntrega: 5.00,              // 0 = entrega grátis
    permitirRetirada: true,         // mostra a opção "Retirar no local"
    formasPagamento: ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"],

    // "Monte sua pizza": cliente escolhe sabores do cardápio de pizzas
    montarPizza: {
        ativo: true,
        maxSabores: 4,
        regraPreco: "maior",        // "maior" = cobra o sabor mais caro | "media" = média dos sabores
    },

    // -------------------------------- Textos --------------------------------
    hero: {
        titulo: "Deixe sua noite mais saborosa",
        subtitulo: "Escolha no cardápio, monte do seu jeito e finalize o pedido direto pelo WhatsApp.",
        imagem: "Img/hero.jpg",
    },

    sobre: {
        titulo: "Feito com carinho, servido quentinho",
        paragrafos: [
            "Massa de fermentação natural, molho de tomate preparado na casa e ingredientes selecionados todos os dias.",
            "Nossa equipe trabalha para que cada pedido chegue do jeito que você gosta: rápido, bem embalado e cheio de sabor.",
        ],
        imagem: "Img/Cardápio/Pizzas/calabresa.jpg",
        destaques: [
            { icone: "bi-fire", texto: "Forno a lenha" },
            { icone: "bi-bicycle", texto: "Entrega rápida" },
            { icone: "bi-whatsapp", texto: "Pedido pelo WhatsApp" },
        ],
    },

    // ------------------------------- Cardápio -------------------------------
    // Cada categoria vira uma aba. "img" vazio mostra uma imagem provisória.
    // "id" deve ser único (sem espaços).
    // "prefixo" aparece antes do nome na mensagem do WhatsApp (ex.: "Pizza Calabresa").
    // "destaque: true" coloca o selo "Mais pedida" no card.
    cardapio: [
        {
            categoria: "Pizzas",
            id: "pizzas",
            prefixo: "Pizza",
            icone: "Img/loading.png",   // ícone da imagem provisória (classe bootstrap-icons ou caminho de imagem)
            itens: [
                { id: "pz-mussarela",  nome: "Mussarela",      descricao: "Molho de tomate, mussarela e orégano.",               detalhe: "8 fatias", preco: 45.00, img: "Img/Cardápio/Pizzas/mussarela.jpg" },
                { id: "pz-calabresa",  nome: "Calabresa",      descricao: "Calabresa fatiada, cebola, mussarela e orégano.",     detalhe: "8 fatias", preco: 48.00, img: "Img/Cardápio/Pizzas/calabresa.jpg", destaque: true },
                { id: "pz-margherita", nome: "Margherita",     descricao: "Mussarela, tomate, manjericão fresco e parmesão.",    detalhe: "8 fatias", preco: 52.00, img: "Img/Cardápio/Pizzas/margherita.jpg" },
                { id: "pz-4queijos",   nome: "Quatro Queijos", descricao: "Mussarela, provolone, parmesão e catupiry.",           detalhe: "8 fatias", preco: 55.00, img: "Img/Cardápio/Pizzas/quatro-queijos.jpg", destaque: true },
                { id: "pz-portuguesa", nome: "Portuguesa",     descricao: "Presunto, ovos, cebola, ervilha, azeitona e mussarela.", detalhe: "8 fatias", preco: 54.00, img: "Img/Cardápio/Pizzas/portuguesa.jpg" },
                { id: "pz-frango",     nome: "Frango c/ Catupiry", descricao: "Frango desfiado temperado com catupiry.",          detalhe: "8 fatias", preco: 52.00, img: "Img/Cardápio/Pizzas/frango-catupiry.jpg" },
            ],
        },
        {
            categoria: "Esfihas",
            id: "esfihas",
            prefixo: "Esfiha",
            icone: "bi-hexagon",
            itens: [
                { id: "es-carne",   nome: "Carne",              descricao: "Carne moída temperada, tomate e cebola.", detalhe: "1 unidade", preco: 4.50, img: "Img/Cardápio/Esfihas/carne.jpg" },
                { id: "es-frango",  nome: "Frango c/ Catupiry", descricao: "Frango desfiado com catupiry.",           detalhe: "1 unidade", preco: 5.00, img: "Img/Cardápio/Esfihas/frango-catupiry.jpg" },
                { id: "es-queijo",  nome: "Queijo",             descricao: "Mussarela gratinada com orégano.",        detalhe: "1 unidade", preco: 4.50, img: "Img/Cardápio/Esfihas/queijo.jpg" },
                { id: "es-margherita", nome: "Margherita",       descricao: "Molho de tomate, mussarela e manjericão.", detalhe: "1 unidade", preco: 5.00, img: "Img/Cardápio/Esfihas/margherita.jpg" },
                { id: "es-calabresa", nome: "Calabresa",        descricao: "Calabresa moída com mussarela.",          detalhe: "1 unidade", preco: 5.00, img: "Img/Cardápio/Esfihas/calabresa.jpg" },
            ],
        },
        {
            categoria: "Porções",
            id: "porcoes",
            prefixo: "Porção",
            icone: "bi-basket",
            itens: [
                { id: "po-batata",    nome: "Batata Frita",          descricao: "Batata crocante temperada com ervas e sal.", detalhe: "Serve 2", preco: 28.00, img: "Img/Cardápio/Porções/batata-frita.jpg" },
                { id: "po-calabresa", nome: "Calabresa Acebolada",   descricao: "Calabresa na chapa com cebola e limão.", detalhe: "Serve 2", preco: 35.00, img: "Img/Cardápio/Porções/calabresa-acebolada.jpg" },
            ],
        },
        {
            categoria: "Bebidas",
            id: "bebidas",
            prefixo: "",
            icone: "bi-cup-straw",
            itens: [
                { id: "be-refri2l", nome: "Refrigerante 2L",  descricao: "Consulte os sabores disponíveis.", detalhe: "2 litros", preco: 14.00, img: "Img/Cardápio/Bebidas/refrigerante.jpg" },
                { id: "be-lata",    nome: "Refrigerante Lata", descricao: "Consulte os sabores disponíveis.", detalhe: "350 ml",  preco: 6.00,  img: "Img/Cardápio/Bebidas/refrigerante-lata.jpg" },
                { id: "be-suco",    nome: "Suco Natural",     descricao: "Laranja, limão ou maracujá.",      detalhe: "500 ml",  preco: 10.00, img: "Img/Cardápio/Bebidas/suco.jpg" },
            ],
        },
    ],

    // Crédito do desenvolvedor no rodapé (vazio = oculta)
    creditoDesenvolvedor: "Nicolas de Almeida Sousa",
};
