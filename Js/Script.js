// ----------------------------- HOME E WHATSAPP -----------------------------

// Redireciona para a página principal (index.html)
function redirecionarHome(){
    window.location.replace("index.html");
}

// Abre uma nova aba com link direto para o WhatsApp do número informado
function redirecionarWhatsApps(){
    window.open("https://api.whatsapp.com/send?phone=1191377733");
}

// -------------------------- VER MAIS / VER MENOS ---------------------------

// Exibe detalhes das pizzas
function clickVerMaisPizza(){
    document.querySelector('.verMaisPizza').style.display = 'none';

    function ativarDetails() {
        var meusDetalhes = document.getElementById("detailsCardapio1");
        meusDetalhes.open = true;
    }

    setTimeout(ativarDetails, 300);
    document.querySelector('.verMenosPizza').style.display = 'block';
}

// Esconde detalhes das pizzas
function clickVerMenosPizza(){
    document.querySelector('.verMenosPizza').style.display = 'none';

    function ativarDetails() {
        var meusDetalhes = document.getElementById("detailsCardapio1");
        meusDetalhes.open = false;
    }

    setTimeout(ativarDetails, 300);
    document.querySelector('.verMaisPizza').style.display = 'block';
}

// Exibe detalhes das esfihas
function clickVerMaisEsfihas(){
    document.querySelector('.verMaisEsfihas').style.display = 'none';

    function ativarDetails() {
        var meusDetalhes = document.getElementById("detailsCardapio2");
        meusDetalhes.open = true;
    }

    setTimeout(ativarDetails, 300);
    document.querySelector('.verMenosEsfihas').style.display = 'block';
}

// Esconde detalhes das esfihas
function clickVerMenosEsfihas(){
    document.querySelector('.verMenosEsfihas').style.display = 'none';

    function ativarDetails() {
        var meusDetalhes = document.getElementById("detailsCardapio2");
        meusDetalhes.open = false;
    }

    setTimeout(ativarDetails, 300);
    document.querySelector('.verMaisEsfihas').style.display = 'block';
}

// Exibe detalhes das porções
function clickVerMaisPorcoes(){
    document.querySelector('.verMaisPorcoes').style.display = 'none';

    function ativarDetails() {
        var meusDetalhes = document.getElementById("detailsCardapio3");
        meusDetalhes.open = true;
    }

    setTimeout(ativarDetails, 300);
    document.querySelector('.verMenosPorcoes').style.display = 'block';
}

// Esconde detalhes das porções
function clickVerMenosPorcoes(){
    document.querySelector('.verMenosPorcoes').style.display = 'none';

    function ativarDetails() {
        var meusDetalhes = document.getElementById("detailsCardapio3");
        meusDetalhes.open = false;
    }

    setTimeout(ativarDetails, 300);
    document.querySelector('.verMaisPorcoes').style.display = 'block';
}

// ------------------------------ MENU MOBILE --------------------------------

// Alterna visibilidade do menu de navegação em telas pequenas
function toggleMenu() {
    const menu = document.getElementById('menuNav');
    menu.classList.toggle('active');
}

// ------------------------------ POPUP PEDIDO -------------------------------

// Exibe o modal para digitar sabores
function abrirPopup() {
    document.getElementById('popupModal').style.display = 'flex';
}

// Fecha o modal de sabores
function fecharPopup() {
    document.getElementById('popupModal').style.display = 'none';
}

// Lógica simples para simular inclusão de sabores
function incluirNoCarrinho() {
    const sabores = document.querySelector('.inputSabores').value;
    if (sabores.trim() === "") {
        alert("Por favor, digite os sabores desejados.");
        return;
    }

    alert("Pedido incluído com os sabores: " + sabores);
    fecharPopup();
}

// ------------------------ CARRINHO LATERAL FIXO ----------------------------

let carrinhoAberto = false;

// Abre ou fecha o carrinho lateral com base no estado atual
function abrirFecharKart() {
    const mini = document.getElementById('miniCart');
    const side = document.getElementById('sideCart');

    if (!carrinhoAberto) {
        mini.style.display = 'none';
        side.classList.add('active');
    } else {
        mini.style.display = 'flex';
        side.classList.remove('active');
    }

    carrinhoAberto = !carrinhoAberto;
}

// Fecha o carrinho lateral e mostra o mini carrinho
function fecharCarrinho() {
    document.getElementById('miniCart').style.display = 'flex';
    document.getElementById('sideCart').classList.remove('active');
    carrinhoAberto = false;
}

// -------------------------- CARRINHO SIMPLES -------------------------------

// Adiciona item diretamente ao carrinho na tela
function adicionarProduto(nome, preco, imagem) {
    const container = document.getElementById('cartItems');
    const item = document.createElement('div');
    item.className = 'cartItem';
    item.innerHTML = `
        <img src="${imagem}" alt="${nome}">
        <span>${nome}</span>
        <span>R$ ${preco.toFixed(2)}</span>
        <button onclick="removerProduto(this, ${preco})">X</button>
    `;
    container.appendChild(item);

    atualizarTotal(preco);
}

// Remove produto visualmente
function removerProduto(botao, preco) {
    botao.parentElement.remove();
    atualizarTotal(-preco);
}

// Atualiza o total do carrinho simples
let total = 0;
function atualizarTotal(valor) {
    total += valor;
    document.getElementById('totalCart').innerText = total.toFixed(2);
}

// -------------------- CARRINHO COM LOCALSTORAGE ----------------------------

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Abre o carrinho lateral e carrega os dados do localStorage
function abrirFecharKart() {
    document.querySelector('.minBoxCarrinho').style.display = 'none';
    document.getElementById('sideCart').style.right = '0';
    carregarCarrinho();
}

// Fecha o carrinho lateral
function fecharCarrinho() {
    document.getElementById('sideCart').style.right = '-100%';
    document.querySelector('.minBoxCarrinho').style.display = 'flex';
}

// Adiciona produto ao carrinho persistente (localStorage)
function adicionarAoCarrinho(button) {
    const card = button.closest('.cardProduto');
    const info = card.querySelector('.info');
    const nome = info.querySelector('h3').innerText;
    const precoText = info.querySelector('h4 span').innerText.replace('R$', '').replace(',', '.').trim();
    const preco = parseFloat(precoText);
    const img = card.querySelector('img').src;

    const itemExistente = carrinho.find(item => item.nome === nome);
    if (!itemExistente) {
        carrinho.push({ nome, preco, img });
        mostrarNotificacao(`${nome} adicionado ao pedido!`);
    } else {
        mostrarNotificacao(`${nome} já está no pedido!`);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarPrecoTotal();
    atualizarContadorCarrinho();
}

// Remove item do carrinho persistente
function removerItem(button) {
    const divProduto = button.closest('.cartItem');
    const nomeProduto = divProduto.querySelector('h4').innerText;

    carrinho = carrinho.filter(item => item.nome !== nomeProduto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    divProduto.remove();
    atualizarPrecoTotal();
    atualizarContadorCarrinho();
}

// Carrega os itens salvos no carrinho
function carregarCarrinho() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cartItem';

        const precoFormatado = item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        itemDiv.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <div style="flex: 1">
                <h4>${item.nome}</h4>
                <p>${precoFormatado}</p>
            </div>
            <button class="remover" onclick="removerItem(this)">Remover</button>
        `;

        container.appendChild(itemDiv);
        total += item.preco;
    });

    atualizarPrecoTotal(total);
}

// Atualiza o valor total do carrinho
function atualizarPrecoTotal(total = 0) {
    if (!total) {
        total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    }
    document.getElementById('totalCart').innerText = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Atualiza o contador de itens visível no ícone do carrinho
function atualizarContadorCarrinho() {
    const contador = document.querySelector('.contadorCarrinho');
    const bola = document.querySelector('.bola');

    if (contador) {
        contador.innerText = carrinho.length;
        contador.style.display = carrinho.length > 0 ? 'block' : 'none';
    }

    if (bola) {
        bola.style.display = carrinho.length > 0 ? 'block' : 'none';
    }
}

// Mostra uma notificação flutuante por 2,5 segundos
function mostrarNotificacao(mensagem) {
    let notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.innerText = mensagem;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 2500);
}

// -------------------- INICIALIZAÇÃO DO CARRINHO ----------------------------

carregarCarrinho();
atualizarContadorCarrinho();

// -------------------- INCLUINDO MAIS PEDIDOS NO CARRINHO ----------------------------

function incluirNoCarrinho() {
    const sabores = document.querySelector('.inputSabores').value.trim();

    if (sabores === "") {
        alert("Por favor, digite os sabores desejados.");
        return;
    }

    const nome = `À moda do cliente - ${sabores}`;
    const preco = 50.00;
    const img = "https://jorgeaudy.com/wp-content/uploads/2018/07/pizzaiolo.png";

    const itemExistente = carrinho.find(item => item.nome === nome);
    if (!itemExistente) {
        carrinho.push({ nome, preco, img });
        mostrarNotificacao(`${nome} adicionado ao pedido!`);
    } else {
        mostrarNotificacao(`Você já adicionou este sabor personalizado!`);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarPrecoTotal();
    atualizarContadorCarrinho();
    fecharPopup();
}
