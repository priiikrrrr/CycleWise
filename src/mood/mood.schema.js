const {Schema, model, Types} = require("mongoose");

const moodSchema = (
    {
        userId : {
            type: Types.ObjectId,
            required: true, 
            ref : "User"
        },
        mood : {
            type: [String],
            enum : ["happy", "sad", "angry", "calm", "anxious", "depressed", "neutral", "excited"],
            required : true
        },
        note : {
            type : String, 
            maxLength : 500,
            default : null
        },
        createdAt : {
            type : Date,
            default : Date.now()
        }
    }
);

const Mood = model("Mood", moodSchema);
module.exports = Mood;