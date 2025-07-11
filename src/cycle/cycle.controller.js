const {StatusCodes} = require("http-status-codes")
const createCycleProvider = require("./providers/createCycle.provider.js");
const getCycleProvider = require("./providers/getCycle.provider.js");
const getNextCycleProvider = require("./providers/getNextCycle.provider.js");
const deleteCycleProvider = require("./providers/deleteCycle.provider.js");
const updateCycleProvider = require("./providers/updateCycle.provider.js");

async function createCycleController(req,res){
    return await createCycleProvider(req,res);
}

async function getCycleController(req,res){
    return await getCycleProvider(req,res);
}

async function getNextCycleController(req,res){
    return await getNextCycleProvider(req,res);
}

async function deleteCycleController(req,res){
    return await deleteCycleProvider(req,res);
}

async function updateCycleController(req,res){
    return await updateCycleProvider(req,res);
}
module.exports = {createCycleController, getCycleController, getNextCycleController,deleteCycleController, updateCycleController};
