const express = require("express");
const {StatusCodes} = require("http-status-codes");
const chatRouter = express.Router();
const mockChatContoller = require("./chat.controller.js");
const handleValidationError = require("../middleware/validationError.js");
const verifyToken = require("../middleware/verifyToken.middleware.js");
const ChatValidator = require("./chat.validator.js");

chatRouter.post("/send", verifyToken, ChatValidator,handleValidationError, mockChatContoller.chatController);
chatRouter.get("/history/:username", verifyToken , mockChatContoller.historyController);

module.exports = chatRouter;