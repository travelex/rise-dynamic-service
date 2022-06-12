'use strict';


const ExceptionCategory = require('../model/ExceptionCategory');
const ExceptionType = require('../model/ExceptionType');
const winstonWrapper = require('winston-wrapper');
const AuditLogger = require('winston-wrapper/AuditLogger');
const logger = winstonWrapper.getLogger('FileSuccessHandlerApiProcessor');
const utils = require('../utils/Utils');
const MessageDto = require('../model/MessageDto');
const MessageTransformer = require('../transformer/MessageTransformer');
const statsService = require('../service/StatsService')
let _auditLog;

process
    .on('UnhandledPromiseRejectionWarning', (ex) => {
        logger.debug('Unhandled Promise Rejection Warning', ex);
        throw utils.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
    })
    .on('UnhandledPromiseRejection', (ex) => {
        logger.debug('Unhandled Promise Rejection', ex);
        throw utils.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
    });

class FileSuccessHandlerApiProcessor {
    async process(event, context) {
        return new Promise((resolve, reject) => {
            winstonWrapper.serverlessFunction(event, context, async () => {
                _auditLog = new AuditLogger.Builder(logger, 'rise-event-sub');
                try {
                    logger.info("Receiving Messages from  Audit Queue ");
                    let eventRecord = utils.parseElement(event);
                    logger.debug(`Success queue Events:::: ${JSON.stringify (eventRecord)}`);
                    
                    for (let recordCounter = 0; recordCounter < eventRecord.Records.length; recordCounter++) {
                        let messageInfo = eventRecord.Records[recordCounter].body;
                        let messageBody = utils.parseElement(messageInfo)
                        logger.debug("messageBody :: " + JSON.stringify(messageBody));

                        let messageDto = new MessageDto(messageBody.TopicArn, messageBody.Message, messageBody.MessageAttributes);
                        logger.debug("messageDto :: " + JSON.stringify(messageDto));

                        let messageBo = await MessageTransformer.transformToBo(messageDto);
                        logger.debug("messageBo :: " + JSON.stringify(messageBo));
                        let response = await statsService.process(messageBo)
                        logger.info("Reached for Single Message")
                        
                    }

                    resolve({ success: true });

                } catch (exception) {
                    logger.error(`exception in FileSuccessHandlerApiProcessor : ${exception.toString()}`);
                    let error = utils.genericException(exception, ExceptionType.UNKNOWN_ERROR, ExceptionCategory.MESSAGE_PROCESSING_ERROR, exception.message);
                    logger.error(error.toString());
                    // _auditLog.withError(error.toString()).withWorkFlowInfo(error.description || error.message).build().generateAuditlog();
                    reject(error);
                }
            });

        });
    }
}

module.exports = FileSuccessHandlerApiProcessor;