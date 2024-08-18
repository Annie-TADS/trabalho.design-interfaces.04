const BRASIL_API = "https://brasilapi.com.br/api";
const MENSAGEM_ERRO_PADRAO = "HOUVE UM ERRO NA PESQUISA";
const MARCAS_CARRO_API = "https://parallelum.com.br/fipe/api/v1/carros/marcas";
const PESSOA_SWAPI = "https://swapi.dev/api/people"
const PLACEHOLDER_API = "https://jsonplaceholder.typicode.com/posts/";

const responseDump = document.getElementById("responseDump");

const buscarBanco001 = async () => {
    const url = `${BRASIL_API}/banks/v1`;
    const inputBanco001 = document.getElementById("banco001");
    
    if (inputBanco001) {
        try {
            const response = await executeFetch(url)

            inputBanco001.value = response[0].name;
            inputBanco001.classList.remove("error-input");
        } catch (error) {
            inputBanco001.value = error.message;
            inputBanco001.classList.add("error-input");
        }
    }
}

const buscarIdRioGrande = async () => {
    const url = `${BRASIL_API}/cptec/v1/cidade/Rio Grande`
    const inputIdRioGrande = document.getElementById("idRioGrande");

    if (inputIdRioGrande) {
        try {
            const response = await executeFetch(url)

            inputIdRioGrande.value = response[0].id;
            inputIdRioGrande.classList.remove("error-input");
        } catch (error) {
            inputIdRioGrande.value = error.message;
            inputIdRioGrande.classList.add("error-input");
        }
    }
}

const buscarCep = async () => {
    let cepPesquisado = getInputCep();
    if (!cepPesquisado) {
        return;
    }

    const url = `${BRASIL_API}/cep/v2/${cepPesquisado}`;
    const inputCep = document.getElementById("cep");

    if (inputCep) {
        try {
            const response = await executeFetch(url)

            if (!response.street) {
                throw new Error("Cep não encontrado");
            }

            responseDump.value = "Rua: " + response.street;
            inputCep.classList.remove("error-input");
        } catch (error) {
            responseDump.value = error.message;
            inputCep.value = "";
            inputCep.classList.add("error-input");
        }
    }
}

const buscarCnpj = async () => {
    let cnpjPesquisado = getInputCnpj();
    if (!cnpjPesquisado) {
        return;
    }

    const url = `${BRASIL_API}/cnpj/v1/${cnpjPesquisado}`;
    const inputCnpj = document.getElementById("cnpj");

    if (inputCnpj) {
        try {
            const response = await executeFetch(url)

            if (!response.razao_social) {
                throw new Error("CNPJ não encontrado");
            }

            responseDump.value = "Razão Social: " + response.razao_social + "\nUF: " +response.uf;
            inputCnpj.classList.remove("error-input");
        } catch (error) {
            responseDump.value = error.message;
            inputCnpj.value = "";
            inputCnpj.classList.add("error-input");
        }
    }
}

const getSwapiUrl = () => {
    const randomId = Math.ceil(Math.random() * 10);
    return `${PESSOA_SWAPI}/${randomId}`;
}

const getCarrosUrl = () => {
    return MARCAS_CARRO_API;
}

const getPlaceholderUrl = () => {
    const randomId = Math.ceil(Math.random() * 50);
    return `${PLACEHOLDER_API}/${randomId}`;
}

const buscarAPIsSimultaneamente = async () => {
    try {
        const responseSwapi = await executeFetch(getSwapiUrl());
        const responseCarros = await executeFetch(getCarrosUrl());
        const responsePlaceholder = await executeFetch(getPlaceholderUrl());

        let mensagemDump = "Personagem de Star Wars aleatório: ";
        if (!responseSwapi.name) {
            mensagemDump += "Pessoa não encontrada\nMarca de carro aleatória: ";
        } else {
            mensagemDump += responseSwapi.name+"\nMarca de carro aleatória: ";
        }
        
        const randomCarroId = Math.floor(Math.random()*responseCarros.length);
        if (!responseCarros[randomCarroId]?.nome) {
            mensagemDump += "Carro não encontrado\nPalavras aleatórias: ";
        } else {
            mensagemDump += responseCarros[randomCarroId].nome+"\nPalavras aleatórias: ";
        }
        if (!responsePlaceholder.title) {
            mensagemDump += "Palavras não encontradas";
        } else {
            mensagemDump += responsePlaceholder.title;
        }

        responseDump.value = mensagemDump;
    } catch (error) {
        responseDump.value = error.message;
    }
}

const buscarAPIsEmCorrida = async () => {
    const urls = [getSwapiUrl(), getCarrosUrl(), getPlaceholderUrl()];
    const response = await executeRace(urls);

    if (Array.isArray(response)) {
        const randomCarroId = Math.floor(Math.random()*response.length);
        if (response[randomCarroId]?.nome) {
            responseDump.value = "API de Carros respondeu primeiro!\nMarca: "+response[randomCarroId].nome;
        } else {
            responseDump.value = "HOUVE ALGUM ERRO NA RESPOSTA";
        }
    } else if (response.name) {
            responseDump.value = "API de Star Wars respondeu primeiro!\nPersonagem: "+response.name;
    } else if (response.title) {
            responseDump.value = "API de Placeholder respondeu primeiro!\nTitulo: "+response.title;
    } else {
            responseDump.value = "HOUVE ALGUM ERRO NA RESPOSTA";
    }
}

const executeFetch = async (url) => {
    return await fetch(url)
        .then(async (response) => {
            return response.json();
        }).catch((err) => {
            console.log(err);
            throw new Error(MENSAGEM_ERRO_PADRAO);
        })
}

const executeRace = async (urls) => {
    const fetches = [];
    urls.forEach(url => {
        fetches.push(
            executeFetch(url)
        )
    });

    return await Promise.race(fetches)
    .then(async (response) => {
        return response;
    }).catch((err) => {
        console.log(err);
        throw new Error(MENSAGEM_ERRO_PADRAO);
    })
}

const getInputCep = () => {
    const inputCep = document.getElementById("cep");
    let cep = inputCep.value;

    if (cep.replace(/\D/gi, "").length != 8) {
        inputCep.classList.add("invalid-input");
        inputCep.value = "";
        return "";
    } else {
        inputCep.classList.remove("invalid-input");
        return cep.replace(/\D/gi, "");
    }
}

const getInputCnpj = () => {
    const inputCnpj = document.getElementById("cnpj");
    let cnpj = inputCnpj.value;

    if (cnpj.replace(/\D/gi, "").length != 14) {
        inputCnpj.classList.add("invalid-input");
        inputCnpj.value = "";
        return "";
    } else {
        inputCnpj.classList.remove("invalid-input");
        return cnpj.replace(/\D/gi, "");
    }
}

buscarBanco001();
buscarIdRioGrande();
