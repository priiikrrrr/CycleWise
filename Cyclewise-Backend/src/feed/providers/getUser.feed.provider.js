const Feed = require("../feed.schema.js");
const User = require("../../user/user.schema.js")
const {matchedData} = require("express-validator");
const{StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");


async function getUserFeedProvider(req,res){
    const validatedData = matchedData(req);

    const validUsername = await User.findOne({username : validatedData.username});
    try {
        if(!validUsername){
        return res.status(StatusCodes.NOT_FOUND).json({
            message:"The username is not found"
        });
    }
    const userFeed = await Feed.find({userId: validUsername._id}).sort({ createdAt: -1 });
    return res.status(StatusCodes.OK).json({
        message : "User feed fetched successfully",
        data : userFeed,
    });
    } catch (error) {
        errorLogger("error fetching feed", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong while sending, try again later"
    });
    }


};

module.exports = getUserFeedProvider;

