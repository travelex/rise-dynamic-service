/* eslint-disable no-async-promise-executor */
/* eslint-disable no-useless-catch */

'use strict';



const path = require('path');
const winstonWrapper = require('winston-wrapper');
let logger = winstonWrapper.getLogger(path.basename(__filename));
let AuditLogger = require('winston-wrapper/AuditLogger');

//const service = require('../service');
const utils = require('../utils/Utils');
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
const dynamicService = require('../service/DynamicService');


const options = {
    'provider': 'AWS',
    'auditTopic': {
        'apiVersion': '2010-03-31',
        'topicARN': process.env.SNS_TOPIC_ARN
    }
};

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


/**
 * STEPS:
 * 1. Check if request has FulfilementType, if not, reject
 * 2. Check BasketItems, if preCheckRequired|| authProcheck required
 * 3. if authprocheck required, check if kyc required, if not- retrun 
 * 4.KYC check
 * 
 */


class WriterApiProcessor {

    /**
     * Processes input request
     * @param {JSON} event Lambda event containing header and body
     * @param {JSON} context Lambda context
     * @description It performs "below" steps":
     * a) Receive db write request and parse it
     * b) Transform the request to Business object
     * c) Calls the service based on type and format
     */
    async process(event, context, cacheObj) {
        return new Promise(async (resolve, reject) => {
            winstonWrapper.serverlessFunction(event, context, async () => {
                _auditLog = new AuditLogger.Builder(logger, 'rise-service', options);
                try {
                    logger.info('Dynamic service request received');
                    //logger.debug('event', event);
                    const { path, pathParameters, queryStringParameters } = event;
                    logger.debug('path', path);
                    logger.debug('pathParameters', pathParameters);
                    logger.debug('queryStringParameters', queryStringParameters);

                    const rootFolder = path.split('/')[1];
                    const entity = pathParameters.entity;
                    const operation = queryStringParameters.criteria;
                    let fileName = entity + '-' + operation;
                    logger.debug('fileName:', fileName);
                    const filePath = rootFolder + '/' + fileName;
                    logger.debug('filePath:', filePath);

                    let responseOb = dynamicService.applyRules(filePath);

                    let response = responseOb;


                    _auditLog.withWorkFlowInfo('Dynamic Service request completed successfully')
                        .withCompleted(true).withEvent(response).build().generateAuditlog();

                    resolve(response);

                } catch (exception) {
                    logger.error(exception);
                    let error = utils.genericException(exception, ExceptionType.ERROR_PROCESSING_REQUEST, ExceptionCategory.SYSTEM_ERROR, exception.message);
                    _auditLog.withJobName('rise-dynamic-service')
                        .withOriginDomain('')
                        .withInputFileName(event.headers.correlationId)
                        .withCorrelationId(event.headers.correlationId)
                        .withError(error.toString())
                        .withWorkFlowInfo(error.message)
                        .build().generateAuditlog();
                    reject(error);
                }
            });
        });
    }

}

module.exports = new WriterApiProcessor();