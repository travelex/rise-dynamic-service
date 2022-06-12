'use strict';

const FileSuccessHandlerService = require('../service/FileSuccessHandlerService');
const ExceptionCategory = require('../model/ExceptionCategory');
const ExceptionType = require('../model/ExceptionType');
const winstonWrapper = require('winston-wrapper');
const AuditLogger = require('winston-wrapper/AuditLogger');
const logger = winstonWrapper.getLogger('FileSuccessHandlerApiProcessor');
const utils = require('../utils/Utils');
const MessageDto = require('../model/MessageDto');
const MessageTransformer = require('../transformer/MessageTransformer');

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
                    logger.info("Receiving Messages from Success-Queue if Exist..");
                    let eventRecord = utils.parseElement(event);
                    logger.debug(`Success queue Events:::: ${JSON.stringify (eventRecord)}`);
                    let params = undefined, config;
                    for (let recordCounter = 0; recordCounter < eventRecord.Records.length; recordCounter++) {
                        let messageInfo = eventRecord.Records[recordCounter].body;
                        let messageBody = utils.parseElement(messageInfo)
                        logger.debug("messageBody :: " + JSON.stringify(messageBody));

                        let messageDto = new MessageDto(messageBody.TopicArn, messageBody.Message, messageBody.MessageAttributes);
                        logger.debug("messageDto :: " + JSON.stringify(messageDto));

                        let messageBo = await MessageTransformer.transformToBo(messageDto);
                        logger.debug("messageBo :: " + JSON.stringify(messageBo));

                        _auditLog.withOriginDomain(messageBo.originDomain)
                            .withJobName(messageBo.jobName)
                            .withInputFileName(messageBo.fileName)
                            .withInterfaceName(messageBo.interfaceName)
                            .withCorrelationId(messageBo.correlationId);
                        messageBo.auditLog = _auditLog;

                        //Insert status record in job_status for monitoring
                        if (messageBo.monitor === true) {
                            logger.info(`START: Inserting success status`)
                            let executionStatus = await new FileSuccessHandlerService().setExecutionStatus(messageBo);
                            logger.debug(`COMPLETED: Status inserted successfully : ${JSON.stringify(executionStatus)}`);
                        } else {
                            logger.info('monitor flag is undefined or false or event is not resent')
                        }

                        //multiFile success handling
                        logger.debug("Inside multiObject success");
                        config = await new FileSuccessHandlerService().getInterfaceDetails(messageBo);
                        logger.debug(`::interfaceConfig::`);
                        params = await new FileSuccessHandlerService().getParamJson(messageBo);
                        if (messageBo.multiObject == "1") {
                            // logger.debug("Inside multiObject success");
                            // config = await new FileSuccessHandlerService().getInterfaceDetails(messageBo);
                            // logger.debug(`::interfaceConfig::`);
                            logger.debug(config.interfaceConfig);
                            await new FileSuccessHandlerService().moveMultiFileToArchive(messageBo, config.interfaceConfig, params)
                        }

                        
                        // isDuplicateUpdateRequired
                        if (config.interfaceConfig && config.interfaceConfig.global && config.interfaceConfig.global.isDuplicateUpdateRequired) {
                            let statusResponse;
                            if (messageBo.fileName && messageBo.interfaceType === 'batch') {
                                statusResponse = await new FileSuccessHandlerService().setSuccessFileStatus(messageBo);
                            } else {
                                logger.debug('Input is not a file')
                                throw new Error('Input is not file')
                            }
                        }

                        //Update status to Success for file 
                        // if (messageBo.multiObject != "1" && messageBo.monitor != true) {
                        //     let statusResponse;
                        //     if (messageBo.fileName && messageBo.interfaceType === 'batch') {
                        //         statusResponse = await new FileSuccessHandlerService().setSuccessFileStatus(messageBo);
                        //     } else {
                        //         logger.debug('Input is not a file')
                        //         throw new Error('Input is not file')
                        //     }
                        // }

                        //_auditLog.withWorkFlowInfo('File Success Handler Message Request has been processed successfully').withTrackingId(messageBo.trackingId).build().generateAuditlog();

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