const express = require("express");
const {StatusCodes} = require("http-status-codes");
const feedRouter = express.Router();
const MockfeedController = require("./feed.controller.js");
const handleValidationError = require("../middleware/validationError.js");
const verifyToken = require("../middleware/verifyToken.middleware.js");
const feedValidator = require("./validators/feed.validator.js");
const getFeedsValidator = require("./validators/getFeed.validator.js");
const userFeedValidator = require("./validators/getUserFeed.validator.js");
const commentsValidator = require("./validators/comments.validator.js"); 
const reactValidator = require("./validators/reactFeed.validator.js");



feedRouter.post("/create",verifyToken,feedValidator,handleValidationError,MockfeedController.feedController);
feedRouter.get("/all",verifyToken,getFeedsValidator,handleValidationError,MockfeedController.getFeedController);
feedRouter.get("/user/:username",userFeedValidator,handleValidationError,MockfeedController.getUserFeedController);
feedRouter.get("/me",verifyToken,MockfeedController.myFeedController);
feedRouter.delete("/delete/:feedId",verifyToken,MockfeedController.deleteFeedController);
feedRouter.post("/like/:feedId", verifyToken , MockfeedController.likeFeedController);
feedRouter.post("/comment/:feedId", verifyToken,commentsValidator,handleValidationError,MockfeedController.commentFeedController);
feedRouter.post("/react/:feedId", verifyToken, reactValidator, handleValidationError, MockfeedController.reactFeedController);


module.exports = feedRouter;