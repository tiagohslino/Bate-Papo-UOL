let userName;
let forWho = "Todos";
let type = "message";
let toPeople = "Público";

userName = prompt("Qual seu nome de usuario?");

let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/participants/d15a3dd8-368f-4e2c-abf2-d7200f0a1432/`, { name: userName });

promise.then(loadingMessages).catch(showErrors);

function showErrors(err) {
    console.error("Erro ao registrar usuário:", err);
    if (err.response) {
        const { status, data } = err.response;
        if (userName === "" && status === 400) {
            alert(`Usuário não pode estar em branco! Tente novamente`);
        } else if (status === 400) {
            alert(`Este usuário já existe na sala... digite outro!`);
        } else {
            alert(`Erro ${status}: ${data}`);
        }
    } else {
        alert("Erro desconhecido ao registrar usuário.");
    }
    window.location.reload();
}

function loadingMessages() {
    console.log("loadingMessages chamada");
    getMessages();
    getParticipants();
    showsTheRecipient();

    setInterval(getMessages, 3000);
    setInterval(keepConnected, 5000);
    setInterval(getParticipants, 10000);
}

function keepConnected() {
    let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/status/d15a3dd8-368f-4e2c-abf2-d7200f0a1432/`, { name: userName });

    promise.then(res => {
        console.log("Status mantido:", res.status);
    }).catch(err => {
        console.error("Erro ao manter status:", err);
        if (err.response) {
            const { status } = err.response;
            alert(`Erro ${status}: Usuário desconectado por inatividade`);
        } else {
            alert("Erro desconhecido ao manter status.");
        }
    });
}

function getMessages() {
    console.log("getMessages chamada");
    const promise = axios.get(`https://mock-api.driven.com.br/api/v6/uol/messages/d15a3dd8-368f-4e2c-abf2-d7200f0a1432/`);

    promise.then(res => {
        console.log("Mensagens recebidas:", res.data);
        createsTheMessages(res.data);
        scrollMessages();
    }).catch(err => {
        console.error("Erro ao obter mensagens:", err);
        if (err.response) {
            const { status, data } = err.response;
            alert(`${data} Erro ${status} - Problema ao carregar as mensagens do chat`);
        } else {
            alert("Erro desconhecido ao obter mensagens.");
        }
        window.location.reload();
    });
}

function createsTheMessages(allMessages) {
    console.log("createsTheMessages chamada");
    let divMessages = document.querySelector(".container-messages");
    let messagesHTML = "";

    for (let i = 0; i < allMessages.length; i++) {
        const message = allMessages[i];
        const { from, time, text, to, type } = message;

        if (type === "status") {
            messagesHTML += `
                <li class="display-message status-message">
                    <span class="message">
                        <span class="time">(${time})</span>
                        <span class="users"><b class="bold-text">${from}</b></span>
                        <span class="text">${text}</span>
                    </span>
                </li>
            `;
        } else if (type === "message") {
            messagesHTML += `
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
                messagesHTML += `
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

    console.log("HTML gerado:", messagesHTML);
    divMessages.innerHTML = messagesHTML;
    console.log("innerHTML definido:", divMessages.innerHTML);
}

function scrollMessages() {
    const container = document.querySelector(".container-messages");
    if (container.lastElementChild) {
        container.lastElementChild.scrollIntoView();
    }
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

  let promise = axios.post(`https://mock-api.driven.com.br/api/v6/uol/messages/d15a3dd8-368f-4e2c-abf2-d7200f0a1432/`, body);

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
  const sidebar = document.querySelector(".sidebar"); 

  if (sidebar && sidebar.classList.contains("hidden")) { 
    sidebar.classList.remove("hidden");
  }
}

function disableSidebar() {
  const sidebar = document.querySelector(".sidebar"); 

  if (sidebar) { 
    sidebar.classList.add("hidden");
  }
}

function getParticipants() {
  const promise = axios.get(`https://mock-api.driven.com.br/api/v6/uol/participants/d15a3dd8-368f-4e2c-abf2-d7200f0a1432/`);

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

  const previousSelection = document.querySelector(".users-contacts .selected"); 

  if (previousSelection) { 
    previousSelection.remove(); 
  }

  divParticipant.innerHTML +=
    "<ion-icon class='selected' name='checkmark-outline'></ion-icon>";

  showsTheRecipient();
}

function selectVisibility(divVisibility) {
  toPeople = divVisibility.querySelector(".to").innerHTML;
  const previousSelection = document.querySelector(".select-visibility .selected"); 

  if (toPeople === "Reservadamente") {
    type = "private_message";
  }

  if (previousSelection) { 
    previousSelection.remove(); 
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