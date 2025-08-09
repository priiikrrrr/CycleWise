const Feed = require("../feed.schema.js");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js")

async function likeFeedProvider(req,res){
    const userId = req.user?.sub;
    const feedId = req.params.feedId;

    try {
        const feed = await Feed.findById(feedId);
        if(!Feed){
            return res.status(StatusCodes.NOT_FOUND).json({
                message:"Feed not found",
            });
        }
        const alreadyLiked = feed.likes.includes(userId);
        if(!alreadyLiked){
            feed.likes.pull(userId);
        }else{
            feed.likes.push(userId);
        }
        await feed.save();
        return res.status(StatusCodes.OK).json({
            message: alreadyLiked? "like removed" : "post liked",
            data : feed.likes,
        });
    } catch (error) {
        errorLogger("Error in liking the feed", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong, try again later",
        });
    }
}

module.exports = likeFeedProvider;