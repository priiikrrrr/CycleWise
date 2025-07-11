const {matchedData} = require("express-validator");
const{StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const getUserByEmail = require("../../user/providers/getUserByEmail.js");
const bcrypt = require("bcrypt");
const generateTokenProvider = require("./generateTokenProvider.js");

async function authProvider(req,res){
    const validatedData = matchedData(req);
    try {
        const user = await getUserByEmail(validatedData.email);
        const result = await bcrypt.compare(validatedData.password , user.password);
        if(!user || !result){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message : "Please check your credentials"
            });
        }
        const token = generateTokenProvider(user);

        return res.status(StatusCodes.OK).json({
            accessToken: token,
            firstName: user.firstName,
            lastName: user.lastName,
            email : user.email,
        });
    } catch (error) {
        errorLogger("error while trying to login", req, error);
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
            reason : "Unable to process your request at the moment, please try again later"
        });
        
    }
}

module.exports = authProvider;