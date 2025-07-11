const express = require("express");
const {StatusCodes} = require("http-status-codes");
const cycleRouter = express.Router();
const handleValidationError = require("../middleware/validationError.js");
const verifyToken = require("../middleware/verifyToken.middleware.js");
const cycleValidator = require("./validators/cycle.validator.js");
const mockCycleController = require("./cycle.controller.js");

cycleRouter.post("/create", verifyToken, cycleValidator, handleValidationError, mockCycleController.createCycleController);
cycleRouter.get("/getAll" , verifyToken, mockCycleController.getCycleController);
cycleRouter.get("/getNext" ,verifyToken,  mockCycleController.getNextCycleController);
cycleRouter.delete("/delete/:cycleId" , verifyToken  , mockCycleController.deleteCycleController);
cycleRouter.patch("/update/:cycleId", verifyToken, cycleValidator, handleValidationError, mockCycleController.updateCycleController);

module.exports = cycleRouter;