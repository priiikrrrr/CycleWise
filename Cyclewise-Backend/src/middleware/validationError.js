const {validationResult} = require("express-validator");
const {StatusCodes,getReasonPhrase} = require("http-status-codes");

function handleValidationError(req,res,next){
    const errors = validationResult(req);
    console.log("VALIDATION ERRORS:", errors.array()); //extra - remove later
    console.log("BODY:", req.body);//extra - remove later

    if(!errors.isEmpty()){
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            status: "error",
            statusCode : StatusCodes.UNPROCESSABLE_ENTITY,
            message: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
            error: errors.array(),
        });
    }
    next();//NO ERROR 
}
module.exports = handleValidationError;