const socket = io();

/**
 * Definimos la variable username y disparamos un modal para que el
 * usuario ingrese su nombre de usuario. Una vez ingresado, asignamos
 * el valor a la variable username, y emitimos un evento de tipo "new-user"
 */
let username;
Swal.fire({
  title: "Identifícate",
  input: "text",
  text: "Ingresa tu nombre de usuario",
  inputValidator: (value) => {
    return !value && "Es obligatorio introducir un nombre de usuario";
  },
  allowOutsideClick: false,
}).then((result) => {
  username = result.value;

  socket.emit("new-user", username);
});

/**
 * Definimos un objeto chatInput que representa el elemento del DOM correspondiente,
 * donde se ingresan los mensajes a enviar. Agregamos un event listener para escuchar eventos
 * de tipo "keyup", para poder identificar cuando el usuario pulsa Enter.
 * Si el usuario pulsa enter y el mensaje no está vacio, el mismo será enviado a través de un evento de tipo
 * 'chat-message'
 */
const chatInput = document.getElementById("chat-input");
chatInput.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") {
    const inputMessage = chatInput.value;

    if (inputMessage.trim().length > 0) {
      socket.emit("chat-message", { username, message: inputMessage });

      chatInput.value = "";
    }
  }
});

/**
 * Definimos un objeto chatInput que representa el elemento del DOM correspondiente, donde se displayan
 * los mensajes del chat
 * Asignamos un event listener a nuestro socket que, al escuchar eventos de tipo 'messages', escribirá
 * los mensajes al DOM por medio de este elemento
 */
const messagesPanel = document.getElementById("messages-panel");
socket.on("messages", (data) => {
  console.log(data);
  let messages = "";

  data.forEach((m) => {
    messages += `<b>${m.username}:</b> ${m.message}</br>`;
  });

  messagesPanel.innerHTML = messages;
});

/**
 * Disparamos un toast cuando detectamos un evento de tipo 'new-user', que representa que un usuario
 * nuevo se ha unido al chat
 */
socket.on("new-user", (username) => {
  Swal.fire({
    title: `${username} se ha unido al chat`,
    toast: true,
    position: "top-end",
  });
});
