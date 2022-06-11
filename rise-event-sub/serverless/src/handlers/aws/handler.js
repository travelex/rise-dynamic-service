const apiProcessor = require('file-success-handler').apiProcessor;
const winston = require('winston-wrapper');
const logger = winston.getLogger('file-success-handler')

module.exports.handle = function (event, context, callback) {
    winston.serverlessFunction(event, context, () => {
        //logger.debug("Entered handler with request " + JSON.stringify(event));
        new apiProcessor().process(event,context).then((body) => {
            //logger.debug("Exiting with response ", body);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(body)
            })
        }).catch(error => {
            logger.error("Exception caught ", error);
            // throw error;
            callback(null, {
                statusCode: error.httpStatusCode,
                body: JSON.stringify({
                    errorCode: error.code,
                    errorMessage: error.description
                })
            })
        })
    })
};
