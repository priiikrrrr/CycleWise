const Mood = require("../mood.schema.js");
const {matchedData} = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function updateMoodProvider(req, res) {
    const validatedData = matchedData(req);
    const userId = req.user?.sub
    const moodId = req.params.moodId ;
        try{
            const updatedMood = await Mood.findOneAndUpdate({_id : moodId , userId},validatedData,{new:true}).select("-password");
            if(!updatedMood){
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Mood not found"
                });
            }
            return res.status(StatusCodes.OK).json(updatedMood);
        }
        catch(error){
            errorLogger("error fetching Mood", req, error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Could not fetch the user's Mood, recheck password/username...or try again later",
            });
        }
};

module.exports = updateMoodProvider;