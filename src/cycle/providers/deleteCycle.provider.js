const Cycle = require("../cycle.schema.js");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper");

async function deleteCycleProvider(req, res) {
    const userId = req.user?.sub;
    const cycleId = req.params.cycleId;

    try {
        const cycle = await Cycle.findById(cycleId);

        if (!cycle) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "cycle not found",
            });
        }

        if (cycle.userId.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "You are not authorized to delete this cycle",
            });
        }

        await cycle.deleteOne();

        return res.status(StatusCodes.OK).json({
            message: "Selected cycle deleted successfully",
        });

    } catch (error) {
        errorLogger("Failed to delete cycle", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Could not delete cycle, please try again later",
        });
    }
}

module.exports = deleteCycleProvider;