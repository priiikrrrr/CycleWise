const Mood = require("../mood.schema.js");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper");

async function deleteMoodProvider(req, res) {
    const userId = req.user?.sub;
    const moodId = req.params.moodId;

    try {
        const mood = await Mood.findById(moodId);

        if (!mood) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "mood not found",
            });
        }

        if (mood.userId.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: "You are not authorized to delete this mood",
            });
        }

        await mood.deleteOne();

        return res.status(StatusCodes.OK).json({
            message: "Selected mood deleted successfully",
        });

    } catch (error) {
        errorLogger("Failed to delete mood ", req, error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Could not delete mood, please try again later",
        });
    }
}

module.exports = deleteMoodProvider;