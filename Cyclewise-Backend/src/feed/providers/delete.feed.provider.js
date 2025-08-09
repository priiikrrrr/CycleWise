const Feed = require("../feed.schema");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper");

async function deleteFeedProvider(req, res) {
    const userId = req.user?.sub;
    const feedId = req.params.feedId;

    try {
        const feed = await Feed.findById(feedId);

        if (!feed) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Feed not found",
            });
        }

        if (feed.userId.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "You are not authorized to delete this feed",
            });
        }

        await feed.deleteOne();

        return res.status(StatusCodes.OK).json({
            message: "Selected feed deleted successfully",
        });

    } catch (error) {
        errorLogger("Failed to delete feed", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Could not delete feed, please try again later",
        });
    }
}

module.exports = deleteFeedProvider;
