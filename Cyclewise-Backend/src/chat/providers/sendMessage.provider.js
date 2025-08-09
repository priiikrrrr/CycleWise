const Chat = require("../chat.schema.js");
const User = require("../../user/user.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function chatProvider(req,res){
    const {receiverUsername,message} = matchedData(req);
    const senderId = req.user?.sub;
    try {
        const receiver = await User.findOne({username:receiverUsername});
        if(!receiver){
            return res.status(StatusCodes.NOT_FOUND).json({
            message: "User you're trying to send message, doesn't exist",
            });
        }
        const chat = new Chat({
            senderId,
            receiverId: receiver._id,
            message
        }) ;
        await chat.save();
        return res.status(StatusCodes.CREATED).json({
            message: "Message sent successfully",
            data: chat,
        });
    } catch (error) {
        errorLogger("error creating chat", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong while sending, try again later"
    });
        
    }
}

module.exports = chatProvider;