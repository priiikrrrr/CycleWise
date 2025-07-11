const {StatusCodes} = require("http-status-codes");
const chatProvider = require("./providers/sendMessage.provider.js");
const fetchChat = require("./providers/getChatHistory.provider.js");

async function chatController(req,res){
    return await chatProvider(req,res);
}

async function historyController(req,res){
    return await fetchChat(req,res);
}

module.exports = {chatController,historyController};
