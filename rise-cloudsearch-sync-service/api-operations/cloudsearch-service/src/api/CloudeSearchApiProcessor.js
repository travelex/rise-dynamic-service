const event = require('./event');
const CloudeSearchService = require('../service/CloudeSearchService');
const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('CloudeSearchApiProcessor');
const CloudSearchUtility = require('../utils/CloudSearchUtility');

class CloudeSearchApiProcessor {

    static async process(event, context) {
        try {
            logger.info('Started executing CloudeSearchApiProcessor');

            const operation = event.Records[0].eventName;
            const itemDetail = Array.isArray(event.Records[0].dynamodb) ? event.Records[0].dynamodb[0] : event.Records[0].dynamodb

            let response;
            if (operation === 'INSERT') {

                logger.info('Document is getting added.')
                const newProfile = CloudSearchUtility.getProfileFromDynamoEvent(itemDetail.NewImage);
                response = await CloudeSearchService.addDocument(newProfile);
                logger.info('Document is added.')

            } else if (operation === 'MODIFY') {

                logger.info('Document is getting updated.')
                response = await CloudeSearchService.updateDocument(itemDetail);
                logger.info('Document is updated.')

            } else if (operation === 'REMOVE') {

                logger.info('Document is getting removed.')
                const emailId = itemDetail.Keys.email_id["S"];
                response = await CloudeSearchService.removeDocument(emailId);
                logger.info('Document is removed.')

            } else {
                logger.info('Unknown event. EventName:- ' + operation);
                throw new Error('Unknown event. EventName:- ' + operation);
            }

            logger.info(`Response :- ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error);
            return { status: 'failed' }
        }
    }
}

// CloudeSearchApiProcessor.process(event.modifyEvent).then(logger.info).catch(logger.info)
// CloudeSearchApiProcessor.process(event.removeEvent).then(logger.info).catch(logger.info)
// CloudeSearchApiProcessor.process(event.insertEvent).then(logger.info).catch(logger.info)


module.exports = CloudeSearchApiProcessor;