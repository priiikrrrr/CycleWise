const Feed = require("../feed.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js")

async function commentFeedProvider(req,res){
    const {feedId, text} = matchedData(req);
    const userId = req.user?.sub;
    
    try {
        const feed = await Feed.findById(feedId);
        if(!feed){
            return res.status(StatusCodes.NOT_FOUND).json({
                message:"Feed not found",
            });
        }
        feed.comments.push({userId, comment: text});
        await feed.save();
        return res.status(StatusCodes.OK).json({
            message: "comment added successfully",
            data : feed.comments[feed.comments.length -1 ],
        });
    } catch (error) {
        errorLogger("Error adding comment", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Could not add comment, please try again",
    });
    }
}

module.exports = commentFeedProvider;