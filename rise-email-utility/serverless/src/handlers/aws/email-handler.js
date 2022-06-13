const EmailApiProcessor = require('email-service').apiProcessor;
const winston = require('winston-wrapper');
const logger = winston.getLogger('email-handler')

exports.handler = async (event, context) => {

    try {
        console.log(`Handler Event : ${JSON.stringify(event)}`);
        const response = await new EmailApiProcessor().process(event);
        return response;
    } catch (error) {
        logger.error(error);
        return error;
    }
}