let userName;
let forWho = "Todos";
let type = "message";
let toPeople = "Público";

userName = prompt("Qual seu nome de usuario?");

let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants/f35d9f1b-ab28-4890-9ffc-4ba4120b6e8d/`, { name: userName });

promise.then(loadingMessages);
promise.catch(showErrors);

function showErrors(err) {
  let error = err.response.status;

  if (userName === "" && error === 400) {
    alert(`Usuário não pode estar em branco! Tente novamente`);
    window.location.reload();
  } else if (error === 400) {
    alert(`Este usuário já existe na sala... digite outro!`);
    window.location.reload();
  }
}

function loadingMessages() {
  getMessages();
  getParticipants();
  showsTheRecipient();

  setInterval(getMessages, 3000);
  setInterval(keepConnected, 5000);
  setInterval(getParticipants, 10000);
}

function keepConnected() {
  let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/status/f35d9f1b-ab28-4890-9ffc-4ba4120b6e8d/`, { name: userName });

  promise.then(function(res) {
    const { status, statusText } = res;
  });
  promise.catch(function(err) {
    const error = err.response.status;
    alert(`Erro ${error}: Usuário desconectado por inatividade`);
  });
}

function getMessages() {
  const promise = axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages/f35d9f1b-ab28-4890-9ffc-4ba4120b6e8d/`);

  promise.then(function(res) {
    createsTheMessages(res.data);
    scrollMessages();
  });
  promise.catch(function(err) {
    const { status, data } = err.response;
    alert(`${data} Erro ${status} - Problema ao carregar as mensagens do chat`);
    window.location.reload();
  });
}

function createsTheMessages(allMessages) {
  let divMessages = document.querySelector(".container-messages");

  for (let i = 0; i < allMessages.length; i++) {
    const message = allMessages[i];
    const { from, time, text, to, type } = message;

    if (type === "status") {
      divMessages.innerHTML += `
        <li class="display-message status-message">
          <span class="message">
            <span class="time">(${time})</span>
            <span class="users"><b class="bold-text">${from}</b></span>
            <span class="text">${text}</span>
          </span>
        </li>
      `;
    } else if (type === "message") {
      divMessages.innerHTML += `
        <li class="display-message regular-message">
          <span class="message">
            <span class="time">(${time})</span>
            <span class="users">
              <b class="bold-text">${from}</b> para <b class="bold-text">${to}</b>:
            </span>
            <span class="text"> ${text}</span>
          </span>
        </li>
      `;
    } else if (type === "private_message") {
      if (from === userName || to === userName) {
        divMessages.innerHTML += `
          <li class="display-message private-message">
            <span class="message">
              <span class="time">(${time})</span>
              <span class="users">
                <b class="bold-text">${from}</b> reservadamente para 
                <b class="bold-text">${to}</b>:
              </span>
              <span class="text"> ${text}</span>
            </span>
          </li>
        `;
      }
    }
  }
}

function scrollMessages() {
  document.querySelector(".container-messages").lastElementChild.scrollIntoView();
}

function sendMessage() {
  let userMessage = document.querySelector(".send-message-input").value;

  if (userMessage.trim() === "") { 
    alert("A mensagem não pode estar vazia.");
    return; 
  }

  const body = {
    from: userName,
    to: forWho,
    text: userMessage,
    type: type,
  };

  let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages/f35d9f1b-ab28-4890-9ffc-4ba4120b6e8d/`, body);

  promise.then(function(res) {
    scrollMessages();
    const { status, statusText } = res;
    document.querySelector(".send-message-input").value = "";
  });
  promise.catch(function(err) {
    const { status, data } = err.response;
    alert(`${data} Erro ${status}: Não foi possível enviar sua mensagem`);
  });
}

function activeSidebar() {
  const sidebar = document.querySelector(".sidebar"); // Obtém o elemento

  if (sidebar && sidebar.classList.contains("hidden")) { // Verifica se existe e tem a classe "hidden"
    sidebar.classList.remove("hidden");
  }
}

function disableSidebar() {
  const sidebar = document.querySelector(".sidebar"); // Obtém o elemento

  if (sidebar) { // Verifica se o elemento existe
    sidebar.classList.add("hidden");
  }
}

function getParticipants() {
  const promise = axios.get(`https://mock-api.driven.com.br/api/v6/uol/participants/f35d9f1b-ab28-4890-9ffc-4ba4120b6e8d/`);

  promise.then(function(res) {
    renderParticipants(res.data);
  });
  promise.catch(function(err) {
    const { status, data } = err.response;
    alert(
     `${data} Erro ${status}: Não foi possível verificar os participantes`
    );
    window.location.reload();
  });
}

function renderParticipants(participants) {
  let divParticipants = document.querySelector(".select-contacts");
  divParticipants.innerHTML = `
    <li class="users-contacts" onclick="selectRecipient(this)">
      <div class="selection-container">
        <ion-icon class="contact-icon" name="people"></ion-icon>
        <h5 class="to">Todos</h5>
      </div>
    </li>
  `;

  participants.forEach(function(participant) {
    divParticipants.innerHTML += `
      <li class="users-contacts" onclick="selectRecipient(this)">
        <div class="selection-container">
          <ion-icon class="contact-icon" name="person-circle"></ion-icon>
          <h5 class="to">${participant.name}</h5>
        </div>
      </li>
    `;
  });
}

function selectRecipient(divParticipant) {
  forWho = divParticipant.querySelector(".to").innerHTML;

  // Remove o ícone de seleção anterior
  const previousSelection = document.querySelector(".users-contacts .selected"); // Busca o ícone selecionado anteriormente

  if (previousSelection) { // Verifica se ele existe
    previousSelection.remove(); // Remove o ícone
  }

  divParticipant.innerHTML +=
    "<ion-icon class='selected' name='checkmark-outline'></ion-icon>";

  showsTheRecipient();
}

function selectVisibility(divVisibility) {
  toPeople = divVisibility.querySelector(".to").innerHTML;
  const previousSelection = document.querySelector(".select-visibility .selected"); // Busca o ícone selecionado anteriormente

  if (toPeople === "Reservadamente") {
    type = "private_message";
  }

  if (previousSelection) { // Verifica se ele existe
    previousSelection.remove(); // Remove o ícone
  }

  divVisibility.innerHTML +=
    "<ion-icon class='selected' name='checkmark-outline'></ion-icon>";

  showsTheRecipient();
}

function showsTheRecipient() {
  let sectionForWhoIsMsg = document.querySelector(".send-message-container");
  sectionForWhoIsMsg.innerHTML = "";

  sectionForWhoIsMsg.innerHTML += `
    <input class="send-message-input" placeholder="Escreva aqui..." />
    <div class="send-message-to">Enviando para ${forWho} (${toPeople})</div>
  `;
}

function attachEnterKeyListener() { 
  document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
}

attachEnterKeyListener(); 