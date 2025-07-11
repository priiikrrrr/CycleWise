const Cycle = require("../cycle.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getNextCycleProvider(req,res){
    const {periodStartDate, periodEndDate} = matchedData(req);
    const userId = req.user?.sub;
    try {
        // const lastCycle = await Cycle.findOne({userId}).sort({periodStartDate : -1});
        
      const lastCycle = await Cycle.findOne({ userId }).sort({ periodStartDate: -1});
      if (!lastCycle) {
        console.log("No last cycle found for user", userId);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          statusCode: 404,
          message: "Not Found",
          error: { message: "No cycle data found to predict from" }
        });
      }

  
      const start = new Date(lastCycle.periodStartDate);
      const end = lastCycle.periodEndDate ? new Date(lastCycle.periodEndDate) : null;
      
      let cycleLength ;
      let periodLength ;
      let avgCycleLength = null;
      let nextPeriod = null; //predictions
      let ovulationDay = null; //predictions
      let fertilityWindow = null; //predictions

      const pastCycles = await Cycle.find({userId}).sort({periodStartDate : -1}).limit(3);
        

      if(pastCycles.length > 1){
          const length = pastCycles
          .map((c, i, arr) => {
          if (i === arr.length - 1) return null;
          const currentStart = new Date(arr[i].periodStartDate);
          const nextStart = new Date(arr[i + 1].periodStartDate);
          return Math.round((currentStart - nextStart) / (1000 * 60 * 60 * 24));
        })
        .filter(Boolean);
          
        avgCycleLength = Math.round(length.reduce((a,b) =>a + b) / pastCycles.length
      );
    }  
        if(avgCycleLength){
        nextPeriod = new Date(start);
        nextPeriod.setDate(start.getDate() + avgCycleLength);

        ovulationDay = new Date(nextPeriod);
        ovulationDay.setDate(nextPeriod.getDate() - 14);
        
        fertilityWindow = {
            start : new Date(ovulationDay),
            end : new Date(ovulationDay)
        };         
        fertilityWindow.start.setDate(ovulationDay.getDate() -2);
        fertilityWindow.end.setDate(ovulationDay.getDate() -2);
        
    }

        if (end) {
      periodLength = Math.round((end - start) / (1000 * 60 * 60 * 24));
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      message: "Predicted your upcoming cycle details",
      data: {
        inputs: {
          periodStartDate: start,
          periodEndDate: end,
        },
        systemCalculations: {
          cycleLength: lastCycle.systemCalculations?.cycleLength ?? null,
          avgCycleLength,
          periodLength,
        },
        prediction: {
          nextPeriod,
          ovulationDay,
          fertilityWindow,
        },
      },
    });
    } catch (error) {
        errorLogger("error fetching cyle", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Could not fetch",
        });         
        }
};

module.exports = getNextCycleProvider;