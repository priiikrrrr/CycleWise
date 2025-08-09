const express = require("express");
const {StatusCodes} = require("http-status-codes");
const moodRouter = express.Router();
const handleValidationError = require("../middleware/validationError.js");
const verifyToken = require("../middleware/verifyToken.middleware.js");
const moodValidator = require("./validators/mood.validator.js");
const mockMoodController = require("./mood.controller.js");

moodRouter.post("/logMood", verifyToken ,moodValidator, handleValidationError ,  mockMoodController.createMoodController)
moodRouter.get("/getAll", verifyToken, mockMoodController.getMoodController);
moodRouter.delete("/delete/:moodId", verifyToken, mockMoodController.deleteMoodController);
moodRouter.patch("/update/:moodId", verifyToken, moodValidator, handleValidationError, mockMoodController.updateMoodController);


module.exports = moodRouter;