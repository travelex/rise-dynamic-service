const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('FileSuccessHandlerApiProcessor');
const utils = require('../utils/Utils');
const EmailService = require('../service/EmailService')


class EmailApiProcessor {
    async process(event, context) {

        try {

            await EmailService.sendEmail(event)

        } catch (error) {
            logger.error(error)
        }
    }
}

// new EmailApiProcessor().process({}, {})
module.exports = EmailApiProcessor;