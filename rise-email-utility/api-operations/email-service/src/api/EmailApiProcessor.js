const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('EmailApiProcessor');
const EmailService = require('../service/EmailService')


class EmailApiProcessor {
    async process(event, context) {

        try {
            const body = JSON.parse(event.Records[0].body)
            const message = JSON.parse(body.Message)
            const entity = message.entity;
            const status = message.data.status;

            if (entity == 'connection' && status == 'approved') {
                await EmailService.sendEmail(event, message);
            } else {
                logger.debug(`Email will not be sent for entity: ${entity} and status: ${status}`)
            }
            return { status: 'success' }
        } catch (error) {
            logger.error(error)
            return { status: 'success' };
        }
    }
}

module.exports = EmailApiProcessor;