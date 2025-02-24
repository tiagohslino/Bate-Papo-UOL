const allUsers =     
    {name: "fazer o queeee", age: "22"};

const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants/cfa360a9-8b93-4bd9-b601-debbb28197a4", allUsers);
console.log(promise);