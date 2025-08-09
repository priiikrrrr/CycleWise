const { StatusCodes } = require("http-status-codes");

function welcome(req,res){
    res.status(StatusCodes.OK).json({
        message:"welcome to Cyclewise API"
    })
}

function ping(req,res){
    res.status(StatusCodes.OK).json({
        message:"welcome to Cyclewise API"
    })
}

module.exports = {welcome, ping};