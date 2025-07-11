const Feed = require("../feed.schema.js");
// const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");



async function myFeed(req,res){
    const userId = req.user?.sub;
    try {
        const personalFeed = await Feed.find({userId}).sort({createdAt: 1});

        return res.status(StatusCodes.OK).json({
            message : "fetched your personal feed",
            data : personalFeed
        });
    } catch (error) {
        errorLogger("error fetching feed", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Could not fetch",

    });
        
    }
}
module.exports = myFeed;