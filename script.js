const userInfo = {
    name: "Joao",     
};

//Enviando a resposta para o servidor

const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants/5e8669ec-b289-4b8d-b330-604f94b66969", userInfo);
console.log(promise);