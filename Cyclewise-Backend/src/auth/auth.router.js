const express = require("express");
const{StatusCodes} = require("http-status-codes");
const authController = require("./auth.controller.js");
const authValidator = require("./validator/auth.validator.js");
const handleValidationError = require("../middleware/validationError.js");
const authRouter = express.Router();

authRouter.post("/login", authValidator, handleValidationError, authController.authController);
module.exports = authRouter;