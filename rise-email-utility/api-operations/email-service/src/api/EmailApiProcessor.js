const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('FileSuccessHandlerApiProcessor');
const utils = require('../utils/Utils');
const EmailService = require('../service/EmailService')


class EmailApiProcessor {
    async process(event, context) {

        try {
            const body = JSON.parse(event.Records[0].body)
            const message = JSON.parse(body.Message)
            const entity = message.entity;
            const status = message.data.status;
            const date_time = message.date_time_iso.split('T')[0];
            if (entity == 'connection' && status == 'approved') {
                await EmailService.sendEmail(event, message)
            } else {
                return { message: 'Invaid operation' }
            }

        } catch (error) {
            logger.error(error)
        }
    }
}

new EmailApiProcessor().process({}, {})
module.exports = EmailApiProcessor;