const {StatusCodes} = require("http-status-codes");
const createMoodProvider = require("./providers/createMood.provider.js");
const getMoodProvider = require("./providers/getMood.provider.js");
const deleteMoodProvider = require("./providers/deleteMood.provider.js");
const updateMoodProvider = require("./providers/updateMood.provider.js");

async function createMoodController(req,res){
    return await createMoodProvider(req,res);
}

async function getMoodController(req,res){
    return await getMoodProvider(req,res);
}

async function deleteMoodController(req,res){
    return await deleteMoodProvider(req,res);
}

async function updateMoodController(req,res){
    return await updateMoodProvider(req,res);
}
module.exports = {createMoodController, getMoodController,deleteMoodController, updateMoodController};