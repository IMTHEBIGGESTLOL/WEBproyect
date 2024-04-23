// Obtener referencias a elementos del DOM
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

// Evento para enviar un mensaje cuando se envíe el formulario
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener el contenido del mensaje
    const content = messageInput.value.trim();

    if (content !== '') {
        // Agregar el mensaje al chat localmente
        addMessageToChat({ user: 'Tú', content: content });

        // Limpiar el campo de entrada de mensajes
        messageInput.value = '';
    }
});

// Función para agregar un mensaje al chat
function addMessageToChat(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.user}: ${message.content}`;
    chatMessages.appendChild(messageElement);
}

// Simulación de recepción de mensajes cada 3 segundos
function receiveMessage() {
    const messages = [
        { user: 'Usuario1', content: '¡Hola! ¿Cómo estás?' },
        { user: 'Usuario2', content: '¡Hola! Bien, gracias. ¿Y tú?' },
        { user: 'Usuario1', content: 'Muy bien, gracias.' }
    ];

    // Obtener un mensaje aleatorio de la lista de mensajes
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];

    // Agregar el mensaje al chat localmente
    addMessageToChat(randomMessage);
}

// Llamada para recibir mensajes del servidor (simulado aquí cada 3 segundos)setInterval(receiveMessage, 3000);
