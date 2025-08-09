const Chat = require("../chat.schema.js");
const User = require("../../user/user.schema.js");
// const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");
// const chatProvider = require("./sendMessage.provider.js");



async function fetchChat(req,res){
    const userId = req.user?.sub;
    const receiverUsername = req.params.username;
    try {
        const receiver = await User.findOne({username:receiverUsername.toLowerCase()});
        if(!receiver){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "The chat you're trying to fetch does not exist"
            });
        }
        const messages = await Chat.find({
            $or:[
                {senderId : userId , receiverId: receiver._id},
                {senderId: receiver._id, receiverId: userId},
            ],
        }).sort({createdAt: 1});

        return res.status(StatusCodes.OK).json({messages});
    } catch (error) {
        errorLogger("error fetching chats", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Could not fetch chat history",

    });
        
    }
}
module.exports = fetchChat;