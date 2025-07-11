const {StatusCodes} = require("http-status-codes");
const feedProvider = require("./providers/feed.provider.js");
const getFeedProvider = require("./providers/getAll.feed.provider.js");
const getUserFeedProvider = require("./providers/getUser.feed.provider.js");
const getMyFeedProvider = require("./providers/myfeed.provider.js");
const deleteFeedProvider= require("./providers/delete.feed.provider.js");
const likeFeedProvider = require("./providers/likeFeed.provider.js");
const commentFeedProvider = require("./providers/commentFeed.provider.js");
const reactFeedProvider = require("./providers/reactFeed.provider.js");

async function feedController(req,res){
    return await feedProvider(req,res);
}

async function getFeedController(req,res){
    return await getFeedProvider(req,res);
}

async function getUserFeedController(req,res){
    return await getUserFeedProvider(req,res);
}

async function myFeedController(req,res){
    return await getMyFeedProvider(req,res);
}

async function deleteFeedController(req,res){
    return await deleteFeedProvider(req,res);
}

async function likeFeedController(req,res){
    return await likeFeedProvider(req,res);
}

async function commentFeedController(req,res){
    return await commentFeedProvider(req,res);
}

async function reactFeedController(req,res){
    return await reactFeedProvider(req,res);
}
module.exports = {feedController,getFeedController,getUserFeedController,myFeedController,deleteFeedController,likeFeedController,commentFeedController,reactFeedController};