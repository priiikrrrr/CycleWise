const User = require("../user.schema.js");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const { matchedData } = require("express-validator");

async function getUserProvider(req,res){
    const userId = req.user?.sub;
    try{
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            });
        }
        return res.status(StatusCodes.OK).json(user);
    }
    catch(error){
        errorLogger("error fetching user", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong while fetching user profile",
        });
    }
}

module.exports = getUserProvider;