const Cycle = require("../cycle.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function updateCycleProvider(req,res){
    const validatedData = matchedData(req);
    const userId = req.user?.sub;
    const cycleId = req.params.cycleId ;
        try{
            const updatedCycle = await Cycle.findOneAndUpdate({_id : cycleId , userId},validatedData,{new:true}).select("-password");
            if(!updatedCycle){
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Cycle not found"
                });
            }
            return res.status(StatusCodes.OK).json(updatedCycle);
        }
        catch(error){
            errorLogger("error fetching cycle", req, error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Could not fetch the user's cycle, recheck password/username...or try again later",
            });
        }
};


module.exports = updateCycleProvider;