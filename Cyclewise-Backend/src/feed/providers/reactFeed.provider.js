const Feed = require("../feed.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function reactFeedProvider(req, res) {
  const { emoji } = matchedData(req);
  const userId = req.user?.sub;
  const feedId = req.params.feedId;

  try {
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Feed not found" });
    }

    const reactions = feed.reactions.get(emoji) || [];

    const alreadyReacted = reactions.some((id) => id.toString() === userId);
    if (alreadyReacted) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You already reacted with this emoji",
      });
    }

    reactions.push(userId); // push the userId
    feed.reactions.set(emoji, reactions);
    await feed.save();

    return res.status(StatusCodes.OK).json({
      message: "Reaction added successfully",
      data: feed.reactions,
    });
  } catch (error) {
    errorLogger("Something went wrong while reacting", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while reacting",
    });
  }
}

module.exports = reactFeedProvider;
