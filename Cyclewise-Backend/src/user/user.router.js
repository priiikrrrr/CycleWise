const express = require("express");
const {StatusCodes} = require("http-status-codes");
const UserRouter = express.Router();
const UserController = require("./user.controller.js");
const handleValidationError = require("../middleware/validationError.js");
const verifyToken = require("././../middleware/verifyToken.middleware.js")
const createUserValidator = require("./validators/user.validator.js");
const updateUserValidator = require("./validators/updateUser.validator.js");

UserRouter.post("/create", createUserValidator, handleValidationError, UserController.createUser);

UserRouter.patch("/update",verifyToken, updateUserValidator,handleValidationError ,UserController.updateUser);

UserRouter.get("/me", verifyToken, UserController.getUser);

module.exports = UserRouter;