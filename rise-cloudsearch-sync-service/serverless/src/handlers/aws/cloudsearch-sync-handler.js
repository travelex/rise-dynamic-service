const CloudeSearchApiProcessor = require('cloudsearch-service').apiProcessor;
const winston = require('winston-wrapper');
const logger = winston.getLogger('cloudsearch-sync-handler')
const event = require('./event');

exports.handler = async (event, context) => {

    try {
        console.log(`Handler Event : ${JSON.stringify(event)}`);
        const response = await CloudeSearchApiProcessor.process(event);
        return response;
    } catch (error) {
        logger.error(error);
        return error;
    }
}

async function test(event, context) {

    try {
        console.log(`Handler Event : ${JSON.stringify(event)}`);
        const response = await CloudeSearchApiProcessor.process(event);
        return response;
    } catch (error) {
        logger.error(error);
        return error;
    }
}

//Remove
// test(event.removeEvent).then(logger.info).catch(logger.info)

//Add
// test(event.insertEvent).then(logger.info).catch(logger.info)

// Modify
// test(event.modifyEvent).then(logger.info).catch(logger.info)

