
const path = require('path');
const winston_wrapper = require('winston-wrapper');
const logger = winston_wrapper.getLogger(path.basename(__filename))

const PostApiProcessor = require('rise-service').PostApiProcessor;

const GetApiProcessor = require('rise-service').GetConnectionApiProcessor;
const PutApiProcessor = require('rise-service').PutConnectionApiProcessor;
const DeleteApiProcessor = require('rise-service').DeleteConnectionApiProcessor;

const apiProcessors = {
    post: PostApiProcessor,
    get: GetApiProcessor,
    put: PutApiProcessor,
    delete: DeleteApiProcessor
}

const cacheObj = null;

module.exports.rise = function (event, context, callback) {
    winston_wrapper.serverlessFunction(event, context, () => {
        logger.info(`Http Method: ${event.httpMethod.toLowerCase()}`);
        logger.debug(`Entered handler with request   ${JSON.stringify(event)}`);
        logger.debug("Entered handler with request " + JSON.stringify(event));
        //try {
            apiProcessors[event.httpMethod.toLowerCase()].process(event, context, cacheObj)
            .then(body => {
                logger.debug(body)
                logger.debug("Exiting with response ", JSON.stringify(body));
                callback(null, {
                    statusCode: 200,
                    headers: {
                        "Content-Type" : "application/json",
                        "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,code,code_verfier,applicationid",
                        "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
                        "Access-Control-Allow-Credentials" : false,
                        "Access-Control-Allow-Origin" : "*",
                        "X-Requested-With" : "*"
                      },
                    body: JSON.stringify(body)
                })
            }).catch(error => {
                logger.error("Exception caught ", error)
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
