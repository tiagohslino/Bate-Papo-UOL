const participants = [
    { name: "okjaojao", age: 11 },
    { name: "ok", age: 22 },
  ];

  participants.forEach(participant => {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants/a9c569cf-b76f-4a31-88b1-fb7da3f1e93f/', participant)
      .then(response => {
        // Lide com a resposta da API para este participante
      })
      .catch(error => {
        // Lide com erros para este participante
      });
  });
