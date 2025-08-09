const Feed = require("../feed.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function feedProvider(req,res){
    const {content, imageUrl} = matchedData(req);
    const userId = req.user?.sub;
    try {
        const feedContent = new Feed({
            userId,
            content,
            imageUrl
        });
        await feedContent.save();
        return res.status(StatusCodes.CREATED).json({
        message: "posted successfully",
        data: feedContent,
        });
    } catch (error) {
        errorLogger("error creating feed", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong while sending, try again later"
    });
    }
};

module.exports = feedProvider;