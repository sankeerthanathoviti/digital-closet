const mongoose = require('mongoose');
const ChatMessage = require('./models/ChatMessage');
require('dotenv').config({path: './backend/.env'});

mongoose.connect(process.env.MONGO_URI, {}).then(async () => {
    const messages = await ChatMessage.find();
    console.log("Total messages:", messages.length);
    console.log(messages);
    process.exit(0);
}).catch(console.error);
