const logger = require("./winston.helper");

function errorLogger(message,req,error){
    logger.error(`error creating a new Log: ${error.message}`, {
            metadata:{
                errorCode : error.code,
                errorName : error.name,
                method : req.method,
                url: req.originalUrl,
                body: req.body,
                query: req.query,
                params:req.params,
                error : error,
                },
            });
}

module.exports = errorLogger;