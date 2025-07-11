const Cycle = require("../cycle.schema.js");
const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function createCycleProvider(req,res){
    const {periodStartDate, periodEndDate, symptoms} = matchedData(req);
    const userId = req.user?.sub;

    try {
        const start = new Date(periodStartDate);
        //if periodEndDate isnt passed, we store null since the user can still be on their period
        const end = periodEndDate ? new Date(periodEndDate) : null;

        //finding the recent cycle , by sorting period start date in desc order
        const lastCycle = await Cycle.findOne({userId}).sort({periodStartDate : -1});
        


        let cycleLength ;
        let periodLength ;
        let avgCycleLength = null;
        let nextPeriod = null; //predictions
        let ovulationDay = null; //predictions
        let fertilityWindow = null; //predictions

        //calculating number of days , i,e cycle length 
        if(lastCycle){
            const previousStart = new Date(lastCycle.periodStartDate);
            cycleLength = Math.round((start - previousStart)/(1000 * 60 * 60 * 24));
        }
        //If an end date provided, calculating number of days the period lasted.
        if(end){
            periodLength = Math.round((end-start)/(1000*60*60*24));
        }

        const pastCycles = await Cycle.find({userId}).sort({periodStartDate : -1}).limit(3);


//{online ref}
        if(pastCycles.length > 0){
            const length = pastCycles
            .map(c =>(c.systemCalculations?.cycleLength || 0))
            .filter(Boolean); //removes any null/0 

            if(cycleLength)length.unshift(cycleLength);
            if(length.length>0){
                avgCycleLength = Math.round(length.reduce((a,b) =>a + b) / length.length);
            }
        }


//Adds the average cycle length to the current periodStartDate to get next estimated start date.
        if(avgCycleLength){
            nextPeriod = new Date(start);
            nextPeriod.setDate(start.getDate() + avgCycleLength);


//Typically occurs ~14 days before next period. So subtract 14 days from predicted next period.
            ovulationDay = new Date(nextPeriod);
            ovulationDay.setDate(nextPeriod.getDate() - 14);

            fertilityWindow = {
                start : new Date(ovulationDay),
                end : new Date(ovulationDay)
            };

//Fertile window = 5 days: 2 before + ovulation + 2 after.            
            fertilityWindow.start.setDate(ovulationDay.getDate() - 2);
            fertilityWindow.end.setDate(ovulationDay.getDate() + 2);
        }

        const newCycle = new Cycle({
            userId,
            periodStartDate : start,
            periodEndDate : end,
            symptoms : symptoms || [],

            systemCalculations : {
                cycleLength,
                periodLength,
                avgCycleLength
            },
            predictionLogic : {
                nextPeriod,
                ovulationDay,
                fertilityWindow
            }
        });

        await newCycle.save();
        return res.status(StatusCodes.CREATED).json({
        status: "success",
        statusCode: StatusCodes.CREATED,
        message: "Cycle logged successfully",
        data: {
                userId: newCycle.userId,
                periodStartDate: newCycle.periodStartDate,
                periodEndDate: newCycle.periodEndDate,
                symptoms: newCycle.symptoms,
                systemCalculations: newCycle.systemCalculations,
                predictionLogic: newCycle.predictionLogic,
                _id: newCycle._id,
                createdAt: newCycle.createdAt,
                updatedAt: newCycle.updatedAt,   
        }
    });
    } catch (error) {
        errorLogger("Error saving cycle", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Could not save cycle, try again later"
    });
    }
};

module.exports = createCycleProvider;