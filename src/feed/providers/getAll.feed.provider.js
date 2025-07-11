const Feed = require("../feed.schema.js");
const {matchedData} = require("express-validator");
const{StatusCodes} = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");


async function getFeedProvider(req,res){
    const data = matchedData(req);
    // console.log(query);
    
    try {
        const totalFeeds = await Feed.countDocuments();
        const currentPage = data.page;
        const limit = data.limit;
        const order = data.order;
        const totalPages = Math.ceil(totalFeeds/limit);
        const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
        const previousPage = currentPage === 1 ? currentPage : currentPage - 1;

        const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`;

        const feeds = await Feed.find()
        .sort({createdAt : order})
        .skip((currentPage - 1)* limit)
        .limit(limit);


        let finalResponse = {
            data:feeds,
            pagination:{
                meta:{
                    itemsPerPage : limit,
                    totalItems : totalFeeds,
                    currentPage : currentPage,
                    totalPages :totalPages,
                },
                links:{
                   first: `${baseUrl}/?limit=${limit}&page=${1}&order=${order}`,
                   last: `${baseUrl}/?limit=${limit}&page=${totalPages}&order=${order}`,
                   currentPage : `${baseUrl}/?limit=${limit}&page=${currentPage}&order=${order}`,
                   nextPage : `${baseUrl}/?limit=${limit}&page=${nextPage}&order=${order}`,
                   previousPage : `${baseUrl}/?limit=${limit}&page=${previousPage}&order=${order}`,
                },
            },

        };
        return res.status(StatusCodes.OK).json(finalResponse);
        } 
        catch (error) {
            errorLogger("error while fetching the feed", req, error);
            return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
                reason:"unable to process your request at the moment, please try later"
            });
        }
}

module.exports = getFeedProvider;