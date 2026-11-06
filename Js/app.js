/* =====================================================================
   LÓGICA DO SITE — não é preciso editar este arquivo para um novo cliente.
   Todos os dados vêm de Js/config.js
   ===================================================================== */
(function () {
    "use strict";

    const C = CONFIG;
    const $ = (sel) => document.querySelector(sel);
    const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const CHAVE_CARRINHO = "pedido_" + slug(C.nome);
    const CHAVE_CLIENTE = "cliente_" + slug(C.nome);

    // Mapa id -> { item, categoria }
    const PRODUTOS = {};
    C.cardapio.forEach((cat) => cat.itens.forEach((item) => (PRODUTOS[item.id] = { item, cat })));

    let carrinho = ler(CHAVE_CARRINHO, []).filter((l) => l && l.id && l.qtd > 0);

    /* ------------------------------ Utilidades ------------------------------ */
    function slug(t) { return String(t).toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-"); }
    function esc(t) {
        return String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }
    function brl(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
    function ler(chave, padrao) {
        try { const v = JSON.parse(localStorage.getItem(chave)); return v ?? padrao; } catch { return padrao; }
    }
    function salvar(chave, valor) {
        try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* armazenamento indisponível */ }
    }
    function minutos(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }

    function placeholder(icone, texto) {
        const ic = icone && /\.(png|jpe?g|svg|webp)$/i.test(icone)
            ? `<img src="${esc(icone)}" alt="">`
            : `<i class="bi ${esc(icone || "bi-image")}"></i>`;
        return `<div class="placeholder"><div>${ic}${texto ? `<small>${esc(texto)}</small>` : ""}</div></div>`;
    }
    function midia(item, cat, legenda) {
        return item.img
            ? `<img src="${esc(item.img)}" alt="${esc(item.nome)}" loading="lazy">`
            : placeholder(cat && cat.icone, legenda ? "Foto em breve" : "");
    }

    let toastTimer;
    function toast(msg) {
        const el = $("#toast");
        el.textContent = msg;
        el.classList.add("visivel");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove("visivel"), 2200);
    }

    /* ------------------------- Identidade e textos ------------------------- */
    function aplicarIdentidade() {
        const r = document.documentElement.style;
        if (C.cores) {
            if (C.cores.primaria) r.setProperty("--primary", C.cores.primaria);
            if (C.cores.secundaria) r.setProperty("--secondary", C.cores.secundaria);
            if (C.cores.escura) r.setProperty("--dark", C.cores.escura);
        }
        document.title = C.nome + " | Cardápio e pedidos";
        if (C.icone) $("#favicon").href = C.icone;

        $("#brand").innerHTML = C.logo
            ? `<img class="brand__logo" src="${esc(C.logo)}" alt="${esc(C.nome)}">`
            : `${C.icone ? `<img class="brand__icone" src="${esc(C.icone)}" alt="">` : ""}<span>${esc(C.nome)}</span>`;

        // Hero
        $("#heroTitulo").textContent = C.hero.titulo;
        $("#heroSubtitulo").textContent = C.hero.subtitulo;
        if (C.hero.imagem) $("#hero").style.backgroundImage = `url("${encodeURI(C.hero.imagem)}")`;

        // Sobre
        $("#sobreTitulo").textContent = C.sobre.titulo;
        $("#sobreParagrafos").innerHTML = C.sobre.paragrafos.map((p) => `<p>${esc(p)}</p>`).join("");
        const img = $("#sobreImg");
        if (C.sobre.imagem) { img.src = C.sobre.imagem; img.alt = C.nome; } else img.parentElement.remove();
        $("#sobreDestaques").innerHTML = (C.sobre.destaques || [])
            .map((d) => `<li><i class="bi ${esc(d.icone)}"></i>${esc(d.texto)}</li>`).join("");

        // Contato
        const mapa = C.linkMapa || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.endereco);
        const linhas = [
            C.endereco && { i: "bi-geo-alt", t: "Endereço", v: `<a href="${esc(mapa)}" target="_blank" rel="noopener">${esc(C.endereco)}</a>` },
            C.whatsapp && { i: "bi-whatsapp", t: "WhatsApp", v: `<a href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">${esc(formatarFone(C.whatsapp))}</a>` },
            C.telefone && { i: "bi-telephone", t: "Telefone", v: `<a href="tel:${esc(C.telefone.replace(/\D/g, ""))}">${esc(C.telefone)}</a>` },
            C.instagram && { i: "bi-instagram", t: "Instagram", v: `<a href="https://instagram.com/${esc(C.instagram)}" target="_blank" rel="noopener">@${esc(C.instagram)}</a>` },
        ].filter(Boolean);
        $("#contatoLista").innerHTML = linhas.map((l) => `<li><i class="bi ${l.i}"></i><div><small>${l.t}</small>${l.v}</div></li>`).join("");

        // Rodapé
        $("#rodapeNome").textContent = `© ${new Date().getFullYear()} ${C.nome}. Todos os direitos reservados.`;
        $("#rodapeCredito").textContent = C.creditoDesenvolvedor ? `Site desenvolvido por ${C.creditoDesenvolvedor}` : "";
    }

    function formatarFone(num) {
        const d = String(num).replace(/\D/g, "").replace(/^55/, "");
        if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
        if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        return num;
    }

    /* ------------------------------- Horários ------------------------------- */
    function intervalo(dia) {
        const h = C.horarios[dia];
        if (!h) return null;
        const a = minutos(h.abre);
        let f = minutos(h.fecha);
        if (f <= a) f += 1440; // fecha depois da meia-noite
        return { a, f, h };
    }

    function statusAgora() {
        const agora = new Date();
        const dia = agora.getDay();
        const m = agora.getHours() * 60 + agora.getMinutes();
        const hoje = intervalo(dia);
        const ontem = intervalo((dia + 6) % 7);

        if (hoje && m >= hoje.a && m < hoje.f) return { aberto: true, ate: hoje.h.fecha };
        if (ontem && m + 1440 < ontem.f) return { aberto: true, ate: ontem.h.fecha };

        if (hoje && m < hoje.a) return { aberto: false, texto: `abre hoje às ${hoje.h.abre}` };
        for (let i = 1; i <= 7; i++) {
            const d = (dia + i) % 7;
            const prox = intervalo(d);
            if (prox) return { aberto: false, texto: `abre ${i === 1 ? "amanhã" : DIAS[d].toLowerCase()} às ${prox.h.abre}` };
        }
        return { aberto: false, texto: "" };
    }

    function renderHorarios() {
        const s = statusAgora();
        const badge = $("#statusAberto");
        badge.className = "status " + (s.aberto ? "aberto" : "fechado");
        badge.textContent = s.aberto ? "Aberto" : "Fechado";
        $("#heroHorario").textContent = s.aberto ? `Aberto agora · até ${s.ate}` : `Fechado no momento${s.texto ? " · " + s.texto : ""}`;

        const hoje = new Date().getDay();
        const ordem = [1, 2, 3, 4, 5, 6, 0];
        $("#tabelaHorarios").innerHTML = ordem.map((d) => {
            const h = C.horarios[d];
            return `<tr class="${d === hoje ? "hoje" : ""}"><td>${DIAS[d]}</td><td>${h ? `${h.abre} – ${h.fecha}` : "Fechado"}</td></tr>`;
        }).join("");
    }

    /* ------------------------------- Cardápio ------------------------------- */
    function renderTabs() {
        const tabs = $("#tabs");
        tabs.innerHTML = C.cardapio.map((cat, i) =>
            `<button class="tab" role="tab" data-cat="${esc(cat.id)}" aria-selected="${i === 0}">${esc(cat.categoria)}</button>`
        ).join("");
        tabs.addEventListener("click", (e) => {
            const btn = e.target.closest(".tab");
            if (!btn) return;
            tabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", t === btn));
            renderProdutos(btn.dataset.cat);
        });
        renderProdutos(C.cardapio[0].id);
    }

    function renderProdutos(catId) {
        const cat = C.cardapio.find((c) => c.id === catId);
        $("#gradeProdutos").innerHTML = cat.itens.map((item, i) => `
            <article class="card" style="animation-delay:${i * 40}ms">
                <div class="card__media">
                    ${midia(item, cat, true)}
                    ${item.destaque ? `<span class="card__badge">Mais pedida</span>` : ""}
                </div>
                <div class="card__body">
                    <h3>${esc(item.nome)}</h3>
                    <p class="card__desc">${esc(item.descricao)}</p>
                    <div class="card__foot">
                        <div class="card__preco">
                            <strong>${brl(item.preco)}</strong>
                            ${item.detalhe ? `<small>${esc(item.detalhe)}</small>` : ""}
                        </div>
                        <button class="add-btn" data-add="${esc(item.id)}" aria-label="Adicionar ${esc(item.nome)}">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </article>`).join("");
    }

    /* ------------------------------ Monte a sua ------------------------------ */
    let saboresEscolhidos = [];

    function iniciarMonte() {
        const cfg = C.montarPizza;
        const pizzas = (C.cardapio.find((c) => c.id === "pizzas") || C.cardapio[0]).itens;
        if (!cfg || !cfg.ativo || !pizzas.length) {
            ["#monte", "#navMonte", "#heroMonte"].forEach((s) => $(s) && $(s).remove());
            return;
        }

        $("#monteRegra").textContent =
            `Escolha até ${cfg.maxSabores} sabores na mesma pizza. ` +
            (cfg.regraPreco === "media" ? "O valor é a média dos sabores escolhidos." : "O valor é o do sabor mais caro.");

        const box = $("#monteSabores");
        box.innerHTML = pizzas.map((p) =>
            `<button class="chip" data-sabor="${esc(p.id)}" aria-pressed="false">${esc(p.nome)}</button>`
        ).join("");

        box.addEventListener("click", (e) => {
            const chip = e.target.closest(".chip");
            if (!chip) return;
            const id = chip.dataset.sabor;
            if (saboresEscolhidos.includes(id)) saboresEscolhidos = saboresEscolhidos.filter((s) => s !== id);
            else if (saboresEscolhidos.length < cfg.maxSabores) saboresEscolhidos.push(id);
            atualizarMonte();
        });

        $("#btnMonteAdicionar").addEventListener("click", () => {
            const itens = saboresEscolhidos.map((id) => PRODUTOS[id].item);
            const nomes = itens.map((i) => i.nome);
            const id = "monte:" + [...saboresEscolhidos].sort().join("+");
            adicionar({
                id,
                nome: itens.length === 1 ? nomes[0] : `${itens.length} sabores (${nomes.join(" / ")})`,
                preco: precoMonte(itens),
                prefixo: "Pizza",
                img: itens.find((i) => i.img)?.img || "",
                icone: (C.cardapio.find((c) => c.id === "pizzas") || {}).icone,
            });
            saboresEscolhidos = [];
            atualizarMonte();
        });
        atualizarMonte();
    }

    function precoMonte(itens) {
        if (!itens.length) return 0;
        const precos = itens.map((i) => i.preco);
        if (C.montarPizza.regraPreco === "media") return Math.round((precos.reduce((a, b) => a + b, 0) / precos.length) * 100) / 100;
        return Math.max(...precos);
    }

    function atualizarMonte() {
        const max = C.montarPizza.maxSabores;
        document.querySelectorAll("#monteSabores .chip").forEach((chip) => {
            const sel = saboresEscolhidos.includes(chip.dataset.sabor);
            chip.setAttribute("aria-pressed", sel);
            chip.disabled = !sel && saboresEscolhidos.length >= max;
        });
        const n = saboresEscolhidos.length;
        $("#monteContagem").textContent = n ? `${n} de ${max} sabores` : "Nenhum sabor escolhido";
        $("#montePreco").textContent = brl(precoMonte(saboresEscolhidos.map((id) => PRODUTOS[id].item)));
        $("#btnMonteAdicionar").disabled = n === 0;
    }

    /* ------------------------------- Carrinho ------------------------------- */
    function adicionar(linha) {
        const existente = carrinho.find((l) => l.id === linha.id);
        if (existente) existente.qtd++;
        else carrinho.push({ ...linha, qtd: 1 });
        persistir();
        toast(`✓ ${linha.prefixo ? linha.prefixo + " " : ""}${linha.nome} no seu pedido`);
        const btn = $("#btnAbrirCarrinho");
        btn.classList.remove("pulse"); void btn.offsetWidth; btn.classList.add("pulse");
    }

    function adicionarProduto(id) {
        const p = PRODUTOS[id];
        if (!p) return;
        adicionar({ id, nome: p.item.nome, preco: p.item.preco, prefixo: p.cat.prefixo || "", img: p.item.img || "", icone: p.cat.icone });
    }

    function alterarQtd(id, delta) {
        const l = carrinho.find((x) => x.id === id);
        if (!l) return;
        l.qtd += delta;
        if (l.qtd <= 0) carrinho = carrinho.filter((x) => x.id !== id);
        persistir();
    }

    function persistir() {
        salvar(CHAVE_CARRINHO, carrinho);
        renderCarrinho();
    }

    function tipoEntrega() {
        const r = document.querySelector('input[name="tipo"]:checked');
        return r ? r.value : "entrega";
    }

    function totais() {
        const subtotal = carrinho.reduce((s, l) => s + l.preco * l.qtd, 0);
        const taxa = tipoEntrega() === "entrega" ? Number(C.taxaEntrega) || 0 : 0;
        return { subtotal, taxa, total: subtotal + taxa };
    }

    function renderCarrinho() {
        const qtdTotal = carrinho.reduce((s, l) => s + l.qtd, 0);
        const vazio = carrinho.length === 0;

        $("#listaCarrinho").innerHTML = carrinho.map((l) => `
            <div class="item">
                <div class="item__thumb">${l.img ? `<img src="${esc(l.img)}" alt="">` : placeholder(l.icone)}</div>
                <div>
                    <div class="item__nome">${esc((l.prefixo ? l.prefixo + " " : "") + l.nome)}</div>
                    <div class="item__preco">${brl(l.preco * l.qtd)}</div>
                </div>
                <div class="qtd">
                    <button data-qtd="-1" data-id="${esc(l.id)}" aria-label="Diminuir"><i class="bi ${l.qtd === 1 ? "bi-trash3" : "bi-dash"}"></i></button>
                    <span>${l.qtd}</span>
                    <button data-qtd="1" data-id="${esc(l.id)}" aria-label="Aumentar"><i class="bi bi-plus"></i></button>
                </div>
            </div>`).join("");

        $("#carrinhoVazio").hidden = !vazio;
        $("#checkout").hidden = vazio;
        $("#btnFinalizar").disabled = vazio;

        const contador = $("#contadorCarrinho");
        contador.hidden = vazio;
        contador.textContent = qtdTotal;

        const t = totais();
        $("#resumoSubtotal").textContent = brl(t.subtotal);
        $("#resumoTaxa").textContent = t.taxa ? brl(t.taxa) : "Grátis";
        $("#linhaTaxa").hidden = tipoEntrega() !== "entrega";
        $("#resumoTotal").textContent = brl(t.total);

        $("#cartBar").hidden = vazio || $("#drawer").classList.contains("aberto");
        $("#cartBarQtd").textContent = `${qtdTotal} ${qtdTotal === 1 ? "item" : "itens"}`;
        $("#cartBarTotal").textContent = brl(t.subtotal);
    }

    function abrirCarrinho() {
        $("#drawer").classList.add("aberto");
        $("#drawer").setAttribute("aria-hidden", "false");
        $("#overlay").hidden = false;
        $("#cartBar").hidden = true;
        document.body.classList.add("travado");
    }
    function fecharCarrinho() {
        $("#drawer").classList.remove("aberto");
        $("#drawer").setAttribute("aria-hidden", "true");
        $("#overlay").hidden = true;
        document.body.classList.remove("travado");
        renderCarrinho();
    }

    /* ------------------------------- Checkout ------------------------------- */
    function iniciarCheckout() {
        const form = $("#checkout");

        $("#selectPagamento").innerHTML =
            `<option value="">Selecione...</option>` +
            C.formasPagamento.map((f) => `<option>${esc(f)}</option>`).join("");

        if (!C.permitirRetirada) $("#opcaoRetirada").hidden = true;

        // Recupera dados do cliente da última compra
        const salvo = ler(CHAVE_CLIENTE, {});
        ["nome", "rua", "numero", "bairro", "complemento", "referencia"].forEach((k) => {
            if (salvo[k]) form.elements[k].value = salvo[k];
        });

        form.addEventListener("change", (e) => {
            if (e.target.name === "tipo") {
                $("#camposEndereco").hidden = tipoEntrega() !== "entrega";
                renderCarrinho();
            }
            if (e.target.name === "pagamento") $("#campoTroco").hidden = !/dinheiro/i.test(e.target.value);
        });
        form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalido"));
        form.addEventListener("submit", (e) => { e.preventDefault(); finalizar(); });
    }

    function validar() {
        const form = $("#checkout");
        const obrig = ["nome", "pagamento"];
        if (tipoEntrega() === "entrega") obrig.push("rua", "numero", "bairro");
        let primeiro = null;
        obrig.forEach((k) => {
            const el = form.elements[k];
            const ok = el.value.trim() !== "";
            el.closest(".field").classList.toggle("invalido", !ok);
            if (!ok && !primeiro) primeiro = el;
        });
        if (primeiro) { primeiro.focus(); toast("Preencha os campos destacados"); return false; }
        return true;
    }

    function saudacao() {
        const h = new Date().getHours();
        return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
    }

    function montarMensagem() {
        const f = $("#checkout").elements;
        const v = (k) => f[k].value.trim();
        const t = totais();
        const entrega = tipoEntrega() === "entrega";

        const linhas = [`${saudacao()}! Gostaria de fazer um pedido:`, ""];
        carrinho.forEach((l) => {
            linhas.push(`${l.qtd}x ${(l.prefixo ? l.prefixo + " " : "") + l.nome} - ${brl(l.preco * l.qtd)}`);
        });
        linhas.push("");

        if (entrega) {
            linhas.push("*Endereço de entrega:*");
            linhas.push(`${v("rua")}, ${v("numero")}${v("complemento") ? " - " + v("complemento") : ""}`);
            linhas.push(v("bairro"));
            if (v("referencia")) linhas.push(`Referência: ${v("referencia")}`);
        } else {
            linhas.push("*Vou retirar no local.*");
        }
        linhas.push("");

        linhas.push(`*Nome:* ${v("nome")}`);
        let pag = v("pagamento");
        if (/dinheiro/i.test(pag) && v("troco")) pag += ` (troco para R$ ${v("troco")})`;
        linhas.push(`*Pagamento:* ${pag}`);
        if (v("obs")) linhas.push(`*Observações:* ${v("obs")}`);
        linhas.push("");

        if (t.taxa) {
            linhas.push(`Subtotal: ${brl(t.subtotal)}`);
            linhas.push(`Taxa de entrega: ${brl(t.taxa)}`);
        }
        linhas.push(`*Valor total: ${brl(t.total)}*`);
        return linhas.join("\n");
    }

    function finalizar() {
        if (!carrinho.length || !validar()) return;

        const f = $("#checkout").elements;
        const cliente = {};
        ["nome", "rua", "numero", "bairro", "complemento", "referencia"].forEach((k) => (cliente[k] = f[k].value.trim()));
        salvar(CHAVE_CLIENTE, cliente);

        const url = `https://wa.me/${String(C.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(montarMensagem())}`;
        const janela = window.open(url, "_blank");
        if (!janela) window.location.href = url;

        carrinho = [];
        persistir();
        fecharCarrinho();
        toast("Pedido enviado! Confirme o envio no WhatsApp.");
    }

    /* ------------------------------- Eventos ------------------------------- */
    function ligarEventos() {
        document.addEventListener("click", (e) => {
            const add = e.target.closest("[data-add]");
            if (add) return adicionarProduto(add.dataset.add);
            const q = e.target.closest("[data-qtd]");
            if (q) return alterarQtd(q.dataset.id, Number(q.dataset.qtd));
        });

        $("#btnAbrirCarrinho").addEventListener("click", abrirCarrinho);
        $("#cartBar").addEventListener("click", abrirCarrinho);
        $("#btnFecharCarrinho").addEventListener("click", fecharCarrinho);
        $("#overlay").addEventListener("click", fecharCarrinho);
        $("#btnFinalizar").addEventListener("click", finalizar);
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharCarrinho(); });

        const nav = $("#nav");
        const toggle = $("#menuToggle");
        toggle.addEventListener("click", () => {
            const aberto = nav.classList.toggle("aberto");
            toggle.setAttribute("aria-expanded", aberto);
            toggle.innerHTML = `<i class="bi ${aberto ? "bi-x-lg" : "bi-list"}"></i>`;
        });
        nav.addEventListener("click", (e) => {
            if (e.target.closest("a")) { nav.classList.remove("aberto"); toggle.innerHTML = `<i class="bi bi-list"></i>`; }
        });

        // Mantém o carrinho igual entre abas abertas
        window.addEventListener("storage", (e) => {
            if (e.key === CHAVE_CARRINHO) { carrinho = ler(CHAVE_CARRINHO, []); renderCarrinho(); }
        });
    }

    /* -------------------------------- Início -------------------------------- */
    aplicarIdentidade();
    renderHorarios();
    setInterval(renderHorarios, 60 * 1000);
    renderTabs();
    iniciarMonte();
    iniciarCheckout();
    ligarEventos();
    renderCarrinho();
})();
