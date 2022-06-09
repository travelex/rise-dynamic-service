
const path = require('path');
//const LruCache = require("lru-cache");
const winston_wrapper = require('winston-wrapper');
const apiProcessor = require('rise-service').apiProcessor;
const logger = winston_wrapper.getLogger(path.basename(__filename))

//const options = { maxAge: process.env.CacheTTL * 60 * 60 }
//const cacheObj = new LruCache(options);
const cacheObj = null;

module.exports.rise = function (event, context, callback) {
    winston_wrapper.serverlessFunction(event, context, () => {
        logger.debug("Entered handler with request " + JSON.stringify(event));
        //try {
        apiProcessor.process(event, context, cacheObj)
            .then(body => {
                logger.debug(body)
                logger.debug("Exiting with response ", JSON.stringify(body));
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(body)
                })
            }).catch(error => {
                logger.error("Exception caught ", error)
                callback(null, {
                    statusCode: error.httpStatusCode || 500,
                    body: JSON.stringify({
                        errorCode: error.code || 500,
                        errorMessage: error.description || error
                    })
                })
            })
    })
};
