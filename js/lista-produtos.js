let listagemDeProdutos = [];
const titulo = document.querySelector('.titulo_bloco');
const divListagem = document.getElementById('listagem');
const listaGenero = document.getElementById('genero');
const listaOrdem = document.getElementById('ordem');
const filtro = document.getElementById('search');
const btnBuscar = document.getElementById('btn-search');

btnBuscar.addEventListener('click', () => {
    filtrar(filtro.value.toUpperCase());
    preencheListaDeProdutos();
});

listaGenero.addEventListener('change', async(event) => {
    let genero = event.target.value;
    filtro.value = '';
    listaOrdem.value = 'relevancia';
    await buscaProdutos(genero);
    preencheListaDeProdutos();
});

listaOrdem.addEventListener('change', (event) => {
    ordenaPorPreco(event.target.value);
});

const listaProduto = (id, titulo, preco, img) => {
    const infoProduto = document.createElement('div');
    const imagem = document.createElement('img');
    const tituloProduto = document.createElement('h3');
    const precoProduto = document.createElement('div');

    infoProduto.className = 'col-md-3';
    preco = Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(preco)
    imagem.src = img;
    imagem.classList.add('rounded');
    imagem.classList.add('img_produto')
    tituloProduto.innerHTML = truncate(titulo, 30);
    tituloProduto.className = "desc_produto";
    precoProduto.innerText = preco;
    precoProduto.className = 'preco_produto';

    infoProduto.appendChild(imagem);
    infoProduto.appendChild(tituloProduto);
    infoProduto.appendChild(precoProduto);

    divListagem.appendChild(infoProduto);

}

const preencheListaDeProdutos = () => {
    divListagem.innerHTML = '';
    listagemDeProdutos.forEach(({ id, title, price, thumbnail }) => {
        listaProduto(id, title, price, thumbnail);
    });
    titulo.innerText = `${listagemDeProdutos.length} - Produtos`;
}

function truncate(str, n, useWordBoundary) {
    if (str.length <= n) { return str; }
    const subString = str.substr(0, n - 1);
    return (useWordBoundary ?
        subString.substr(0, subString.lastIndexOf(" ")) :
        subString) + "&hellip;";
};

const ordenaPorPreco = async(ordem) => {
    if (ordem === 'menor-preco') {
        listagemDeProdutos.sort(function(a, b) { return a.price - b.price });
    };
    if (ordem === 'maior-preco') {
        listagemDeProdutos.sort(function(a, b) { return b.price - a.price });
    };
    if (ordem === 'relevancia') {
        await buscaProdutos(listaGenero.value);
        if (filtro.value) {
            filtrar(filtro.value.toUpperCase());
        }
    };
    preencheListaDeProdutos();
};

const filtrar = async(texto) => {
    divListagem.innerHTML = '';
    listagemDeProdutos = listagemDeProdutos
        .filter(({ title }) => title.toUpperCase().includes(texto));
};


const buscaProdutos = async(modelo) => {
    listagemDeProdutos = [];
    try {
        let listaDeProdutos = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${modelo}`);
        let listaProdutosJson = await listaDeProdutos.json();
        listagemDeProdutos = listaProdutosJson.results;
    } catch (error) {
        console.log(error);
    }
}

window.onload = async() => {
    await buscaProdutos('camisas');
    preencheListaDeProdutos();
};