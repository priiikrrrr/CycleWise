const Mood = require("../mood.schema.js");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");

async function getMoodProvider(req, res) {
  const userId = req.user?.sub;
  const { month, year, from, to } = req.query;

  try {
    let filter = { userId };

    // Filter by month and year
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Filter by custom date range
    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const moodLogs = await Mood.find(filter).sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      message: "Fetched your mood logs",
      data: moodLogs,
    });

  } catch (error) {
    errorLogger("error fetching mood logs", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Could not fetch mood logs. Try again later.",
    });
  }
}

module.exports = getMoodProvider;
