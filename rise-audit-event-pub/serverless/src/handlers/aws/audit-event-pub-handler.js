const path = require('path');
const winston = require('winston-wrapper');
// const apiProcessor = require('s3-event-reader').ApiProcessor;
const logger = winston.getLogger(path.basename(__filename));

module.exports.handle = function (event, context, callback) {
    winston.serverlessFunction(event, context, () => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(event)
        })
        // apiProcessor.process(event, context).then((body) => {
        // }).catch(error => {
        //     throw error;
        // })
    });
};
