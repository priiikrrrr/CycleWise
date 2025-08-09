const express = require("express");
// const {StatusCodes} = require("http-status-codes");
const baseRouter = express.Router();
const baseController = require("./base.controller.js");


baseRouter.get("/",baseController.welcome);
baseRouter.get("/ping",baseController.ping);

module.exports = baseRouter;