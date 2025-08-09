const { Schema, model, Types } = require("mongoose");

const chatSchema = new Schema({
    senderId:{
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiverId:{
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    message:{
        type: String,
        required: true,
        trim: true,
        maxLength: 500 
    },
    time:{
        type: Date,
        default: Date.now,
    }

},
{
    timestamps:true,
}
);


const Chat = model("Chat", chatSchema);
module.exports = Chat;
