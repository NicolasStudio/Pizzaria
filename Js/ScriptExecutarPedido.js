// Garante que o DOM está carregado antes de chamar funções
document.addEventListener("DOMContentLoaded", () => {
    carregarCarrinho();
    atualizarContadorCarrinho();
});

function confirmarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de confirmar.");
        return;
    }

    const confirmar = confirm("Deseja realmente enviar seu pedido?");
    if (confirmar) {
        enviarPedidoWhatsApp();
    }
}

function enviarPedidoWhatsApp() {
    if (carrinho.length === 0) return;

    let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";

    carrinho.forEach((item, index) => {
        mensagem += `${index + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    });

    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    mensagem += `\nTotal: R$ ${total.toFixed(2)}\n`;

    const numero = "5511";
    const textoCodificado = encodeURIComponent(mensagem);
    
    // Use o link com api.whatsapp.com (compatibilidade melhor em alguns navegadores)
    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${textoCodificado}`;

    window.open(url, "_blank");
}



function carregarCarrinho() {
    const container = document.getElementById('cartItems');
    if (!container) {
        console.warn("Elemento #cartItems não encontrado.");
        return;
    }

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

function atualizarPrecoTotal(total = 0) {
    if (!total) {
        total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    }
    const totalEl = document.getElementById('totalCart');
    if (totalEl) {
        totalEl.innerText = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

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
