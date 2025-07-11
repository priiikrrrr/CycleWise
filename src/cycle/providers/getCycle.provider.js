const Cycle = require("../cycle.schema.js");
// const {matchedData} = require("express-validator");
const {StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getCycleProvider(req,res){
    const userId = req.user?.sub;
    const {month, year, from , to } = req.query;
    try {
    let filter = { userId };

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.periodStartDate = { $gte: startDate, $lt: endDate };
    }

    // Filter by date range
    if (from && to) {
      filter.periodStartDate = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }
    const personalCycle = await Cycle.find(filter).sort({ periodStartDate: 1 });
        return res.status(StatusCodes.OK).json({
        status: "success",
        statusCode: StatusCodes.OK,
        message: "Fetched your personal cycle",
        data: personalCycle.map(cycle => ({
            _id: cycle._id,
            periodStartDate: cycle.periodStartDate,
            periodEndDate: cycle.periodEndDate,
            symptoms: cycle.symptoms,
            systemCalculations: cycle.systemCalculations,
            predictionLogic: cycle.predictionLogic,
            createdAt: cycle.createdAt
        }))
            });
    } catch (error) {
        errorLogger("error fetching cyle", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Could not fetch",
        });         
    }
};

module.exports = getCycleProvider;