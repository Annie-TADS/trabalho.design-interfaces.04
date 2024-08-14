const BRASIL_API = "https://brasilapi.com.br/api";
const MENSAGEM_ERRO_PADRAO = "HOUVE UM ERRO NA PESQUISA";
const MARCAS_CARRO_API = "https://parallelum.com.br/fipe/api/v1/carros/marcas";
const PESSOA_SWAPI = "https://swapi.dev/api/people/"

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
            new Promise(executeFetch(url))
        )
    });

    return await Promise.race(fetches)
    .then(async (response) => {
        return response.json();
    }).catch((err) => {
        console.log(err);
        throw new Error(MENSAGEM_ERRO_PADRAO);
    })
}

buscarBanco001();
buscarIdRioGrande();