const User = require("../user.schema.js");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const { matchedData } = require("express-validator");

async function updateUserProvider(req,res){
    const validatedData = matchedData(req);
    const userId = req.user?.sub ;
    try{
        const updatedUser = await User.findByIdAndUpdate(userId,validatedData,{new:true}).select("-password");
        if(!updatedUser){
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            });
        }
        return res.status(StatusCodes.OK).json(updatedUser);
    }
    catch(error){
        errorLogger("error fetching user", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Could not fetch the user's profile, recheck password/username...or try again later",
        });
    }
}

module.exports = updateUserProvider;