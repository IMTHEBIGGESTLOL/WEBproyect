const mongoose = require('mongoose');

// Schema para los mensajes del chat
const messageSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

let Message = mongoose.model('Message', messageSchema);

module.exports = {Message};
