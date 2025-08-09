const Mood = require("../mood.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function createMoodProvider(req,res){
    const { mood, note } = matchedData(req);
    const userId = req.user?.sub;

    try {
        if(!mood || mood.length == 0){
            return res.status(StatusCodes.BAD_REQUEST).json({
            message: "At least one mood must be selected",
            });
        }
        const log = new Mood({
            userId,
            mood,
            note : note || null,
        });
        await log.save();
        return res.status(StatusCodes.CREATED).json({
            status: "success",
            statusCode: StatusCodes.CREATED,
            message: "Mood logged successfully",
            data: {
            userId: log.userId,
            mood: log.mood,
            note: log.note,
            createdAt: log.createdAt,
            _id: log._id
            }

        });

    } catch (error) {
        errorLogger("error logging mood", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong while sending, try again later"
    });    
    }
};


module.exports = createMoodProvider;