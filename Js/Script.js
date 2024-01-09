// Ver +/- pizza
function clickVerMaisPizza(){
    document.querySelector('.verMaisPizza').style.display = 'none';

    // Função para ativar o elemento Details
    function ativarDetails() {
        // Seleciona o elemento details pelo ID
        var meusDetalhes = document.getElementById("detailsCardapio1");

        // Define a propriedade open como true para ativar o details
        meusDetalhes.open = true;
    }

    // Chama a função para ativar após um breve intervalo (opcional)
    setTimeout(ativarDetails, 300);

document.querySelector('.verMenosPizza').style.display = 'block';
}

function clickVerMenosPizza(){
    document.querySelector('.verMenosPizza').style.display = 'none';

            function ativarDetails() {
                var meusDetalhes = document.getElementById("detailsCardapio1");
                meusDetalhes.open = false;
            }
            setTimeout(ativarDetails, 300);

    document.querySelector('.verMaisPizza').style.display = 'block';
}


// Ver +/- Esfiha
function clickVerMaisEsfihas(){
    document.querySelector('.verMaisEsfihas').style.display = 'none';

    // Função para ativar o elemento Details
    function ativarDetails() {
        // Seleciona o elemento details pelo ID
        var meusDetalhes = document.getElementById("detailsCardapio2");

        // Define a propriedade open como true para ativar o details
        meusDetalhes.open = true;
    }

    // Chama a função para ativar após um breve intervalo (opcional)
    setTimeout(ativarDetails, 300);

document.querySelector('.verMenosEsfihas').style.display = 'block';
}

function clickVerMenosEsfihas(){
    document.querySelector('.verMenosEsfihas').style.display = 'none';

            function ativarDetails() {
                var meusDetalhes = document.getElementById("detailsCardapio2");
                meusDetalhes.open = false;
            }
            setTimeout(ativarDetails, 300);

    document.querySelector('.verMaisEsfihas').style.display = 'block';
}

// Ver +/- Porcoes
function clickVerMaisPorcoes(){
    document.querySelector('.verMaisPorcoes').style.display = 'none';

    // Função para ativar o elemento Details
    function ativarDetails() {
        // Seleciona o elemento details pelo ID
        var meusDetalhes = document.getElementById("detailsCardapio3");

        // Define a propriedade open como true para ativar o details
        meusDetalhes.open = true;
    }

    // Chama a função para ativar após um breve intervalo (opcional)
    setTimeout(ativarDetails, 300);

document.querySelector('.verMenosPorcoes').style.display = 'block';
}

function clickVerMenosPorcoes(){
    document.querySelector('.verMenosPorcoes').style.display = 'none';

            function ativarDetails() {
                var meusDetalhes = document.getElementById("detailsCardapio3");
                meusDetalhes.open = false;
            }
            setTimeout(ativarDetails, 300);

    document.querySelector('.verMaisPorcoes').style.display = 'block';
}