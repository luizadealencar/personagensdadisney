const inputBusca = document.querySelector('#busca');
const btnBuscar = document.querySelector('#btnBuscar');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formBusca');
const tituloResultados = document.querySelector('#tituloResultados');
const quantidade = document.querySelector('#quantidade');

async function buscarPersonagens(nome = "") {
    resultado.innerHTML = '<p class="mensagem">Carregando personagens magicos...</p>';
    quantidade.textContent = "";
    tituloResultados.textContent = nome
        ? `Resultados para "${nome}"`
        : "Personagens em destaque";
    btnBuscar.disabled = true;
    btnBuscar.textContent = "Buscando...";

    const url = nome
        ? `https://api.disneyapi.dev/character?name=${encodeURIComponent(nome)}`
        : "https://api.disneyapi.dev/character";

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();
        const lista = dados.data
            ? (Array.isArray(dados.data) ? dados.data : [dados.data])
            : [];
        const personagensComImagem = lista.filter((personagem) =>
            personagem && personagem.imageUrl
        );

        resultado.innerHTML = "";
        personagensComImagem.slice(0, 16).forEach((personagem) => {
            const card = document.createElement("div");
            card.className = "card";

            const imagem = document.createElement("img");
            imagem.src = personagem.imageUrl;
            imagem.alt = personagem.name || "Personagem da Disney";

            const texto = document.createElement("p");
            const nomePersonagem = document.createElement("strong");
            nomePersonagem.textContent = personagem.name || "Sem nome";
            texto.appendChild(nomePersonagem);

            card.appendChild(imagem);
            card.appendChild(texto);

            resultado.appendChild(card);
        });

        quantidade.textContent = `${personagensComImagem.length} personagem(ns) encontrado(s)`;

        if (!personagensComImagem.length) {
            resultado.innerHTML = '<p class="mensagem">Nenhum personagem encontrado. Tente outro nome.</p>';
        }
    } catch (erro) {
        resultado.innerHTML = '<p class="mensagem">Nao foi possivel acessar a magia agora. Tente novamente.</p>';
        console.error(erro);
    } finally {
        btnBuscar.disabled = false;
        btnBuscar.textContent = "Buscar personagem";
    }
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    buscarPersonagens(inputBusca.value.trim());
});

buscarPersonagens();