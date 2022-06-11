'use strict';

const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('FileSuccessHandlerService');
// const GenericException = require('generic-exception').GenericException;
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
const utils = require('../utils/Utils');
const DBHelper = require('../dal/DBHelper');
const moment = require('moment');
const FileSuccessDao = require('../dal/FileSuccessDao');
const JobExecutionStatusBo = require(`../model/JobExecutionStatusBo`);
const UtilityDao = require(`../dal/UtilityDao`);
const Util = require(`../utils/Utils`);
const CONDITIONAL_CHECK_EXCEPTION_CODE = process.env.CONDITIONAL_CHECK_EXCEPTION_CODE;

process
    .on('UnhandledPromiseRejectionWarning', (ex) => {
        logger.debug('Unhandled Promise Rejection Warning', ex);
        throw utils.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
    })
    .on('UnhandledPromiseRejection', (ex) => {
        logger.debug('Unhandled Promise Rejection', ex);
        throw utils.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
    });

class FileSuccessHandlerService {
    /** Will prepare Request for Each batch , fire and delete  */
    async setSuccessFileStatus(messageBo) {
        let fileHash = messageBo.objectHash;
        logger.debug(`fileHash : ${JSON.stringify(fileHash)}`);
        let interfaceNameJobName = messageBo.interfaceName + '-' + messageBo.jobName;
        logger.debug(`interfaceNameJobName ${JSON.stringify(interfaceNameJobName)}`);
        let updateParams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                'interfaceNameJobName': interfaceNameJobName,
                'checksum': fileHash
            },
            UpdateExpression: 'set fileStatus  = :fileStatus',
            ConditionExpression: 'interfaceNameJobName = :interfaceNameJobName and filename = :fileName and checksum = :checksum',
            ExpressionAttributeValues: {
                ':fileStatus': messageBo.status,
                ':interfaceNameJobName': interfaceNameJobName,
                ':fileName': messageBo.fileName,
                ':checksum': fileHash
            },
            ReturnValues: 'UPDATED_NEW'
        };
        logger.debug(`update params::: ${JSON.stringify(updateParams)}`);
        try {
            return await new DBHelper().update(updateParams);
        } catch (ex) {
            logger.error(ex);
            throw ex;
        }
    }

    /**
     * 
     * @param {*} record 
     * @description This method inserts records based on status
     */

    async setExecutionStatus(messageBo) {
        try {
            const params = Util.getParams();
            logger.debug(`partitionkey: ${messageBo.partitionkey}, sortKey: ${messageBo.sortKey}, correlationId: ${messageBo.correlationId}`);
            const jobExecutionStatusBo = new JobExecutionStatusBo(messageBo.partitionkey, messageBo.sortKey, messageBo.correlationId, messageBo.error, params);
            
            logger.info(`Inserting status in table for ${messageBo.sortKey}`);
            const status = await new DBHelper().insertExecutionStatus(messageBo.domainName, jobExecutionStatusBo.toCreateItem());
            logger.debug(`Execution status : ${JSON.stringify(status)}`)
            return status;
        } catch (ex) {
            logger.error(`Error occured while updating/inserting record in ExecutionStatus table. Error : ${ex}`);
            logger.error(`Error flow detail : partitionkey: ${messageBo.partitionkey}, sortKey: ${messageBo.sortKey}, correlationId: ${messageBo.correlationId}`);
            throw ex;
            // try {
            //     if (CONDITIONAL_CHECK_EXCEPTION_CODE.includes(ex.code)) {
            //         logger.debug(`Updating ${messageBo.interfaceName} record in execution status table. partitionkey: ${messageBo.partitionkey}, sortKey: ${messageBo.sortKey}`);
            //         return await this.updateErrorStatus(messageBo.domainName, messageBo.partitionkey, messageBo.sortKey, messageBo.error)
            //     }
            //     logger.error(`Error occured while updating/inserting record in ExecutionStatus table. Error : ${ex}`);
            //     logger.error(`Error flow detail : partitionkey: ${messageBo.partitionkey}, sortKey: ${messageBo.sortKey}, correlationId: ${messageBo.correlationId}`);
            //     throw ex;
            // } catch (ex) {
            //     logger.error(`Error occured while updating/inserting record in ExecutionStatus table. Error : ${ex}`);
            //     logger.error(`Error flow detail : partitionkey: ${messageBo.partitionkey}, sortKey: ${messageBo.sortKey}, correlationId: ${messageBo.correlationId}`);
            //     throw ex;
            // }
        }

    }

    /**
    * Gets the interface config file from object store
    * @param {*} messageBo 
    */
    async getInterfaceDetails(messageBo) {
        try {
            return await UtilityDao.getContent(this.getSelectObjectParam(messageBo));
        } catch (ex) {
            throw ex;
        }
    }


    /**
    * @param {*} messageBo 
    * @description Create Select object content parameters
    */
    getSelectObjectParam(messageBo) {
        try {
            let bucketName = messageBo.bucketName + '/interfaces/configs/' + messageBo.originDomain + '/' + messageBo.interfaceName;
            let KeyPath = messageBo.jobName + '-interface-config.json';
            logger.debug('Bucket Name with Path: ' + bucketName + '/' + KeyPath);
            let param = {
                Bucket: bucketName,
                Key: KeyPath,
                ExpressionType: 'SQL',
                Expression: 'SELECT * FROM S3Object',
                InputSerialization: {
                    JSON: {
                        Type: 'DOCUMENT'
                    }
                },
                OutputSerialization: {
                    JSON: {}
                }
            };
            return param;
        } catch (error) {
            logger.error(`Exception occurred while fetching interface config, ${error.toString()}`);
            throw error;
        }
    }

    /**
    * @param {*} messageBo 
    * @param {*} interfaceConfig 
    * @param {*} params 
    * @description moves files to archive
    */
    async moveMultiFileToArchive(messageBo, interfaceConfig, params) {
        try {
            if (interfaceConfig && interfaceConfig.global && interfaceConfig.global.isArchiveMoveRequired) {
                logger.info(`Moving multiFiles to archive location`);
                await this.moveToArchive(messageBo, params);
                logger.info('Files has been moved to archive folder');
                messageBo.auditLog.withWorkFlowInfo('File Success Handler Message Request has been processed successfully').withTrackingId(messageBo.trackingId).build().generateAuditlog();
            }
        } catch (error) {
            logger.error(`Exception occurred while Moving file to archive location, ${error.toString()}`);
            throw error;
        }
    }

    /**
    * @param {*} messageBo
    * @param {*} paramDetails
    * @description Used to get list of files that will be moved to archive location
    */

    async moveToArchive(messageBo, paramDetails) {
        try {
            logger.debug("Creating object-group through metadata");
            if (messageBo.config.metadata) {
                let objectGroupId = messageBo.config.metadata['object-group-id'];
                logger.debug(objectGroupId);
                logger.debug(paramDetails);
                const fileNames = await this.getFileList(messageBo, paramDetails, objectGroupId);
                logger.debug(fileNames);
                for (let index = 0; index < fileNames.length; index++) {
                    const fileName = fileNames[index];
                    await this.moveFileToArchive(messageBo, paramDetails, fileName);
                }
            } else {
                await this.moveFileToArchive(messageBo, paramDetails, '');
            }

        } catch (ex) {
            logger.error(`Exception occurred while Moving file to archive location, ${ex.toString()}`);
            throw ex;
        }
    }


    /**
    * @param {*} dataBo
    * @param {*} paramDetails
    * @param {*} objectGroupId
    * @description returns file list which needs to be processed from the specified bucket.
    */
    async getFileList(dataBo, paramDetails, objectGroupId) {
        try {
            logger.info("Fetching list of files");
            let fileNames = [];
            let bucketName = dataBo.config.bucketName;
            let country = paramDetails.country ? paramDetails.country : null;
            logger.debug(`country:: ${country}`);
            let sourceDetails;
            if (country) {
                sourceDetails = `interfaces/input/${paramDetails.domain}/${paramDetails.interfaceName}/${paramDetails.jobName}/${country}`;
            } else {
                sourceDetails = `interfaces/input/${paramDetails.domain}/${paramDetails.interfaceName}/${paramDetails.jobName}`;
            }

            logger.debug(`source path : ${sourceDetails}`);

            logger.debug('fetching list of files from the bucket');
            let fileList = await UtilityDao.getfileList(bucketName, sourceDetails);
            logger.debug(fileList);
            // Iterating list of files to check if the metadata contains the tracking id and if yes than will process with those files
            for (let file in fileList) {
                let fileKey; //= fileList[file].Key.split('/')[5];
                let splitArray = fileList[file].Key.split('/');

                if (splitArray.length > 6) {
                    fileKey = `${splitArray[5]}/${splitArray[6]}`;
                }
                else {
                    fileKey = splitArray[5];
                }
                logger.debug(`file Key ${fileKey}`);
                let fileDetail = fileList[file].Key;
                if (fileKey) {
                    logger.debug('fetching header object');
                    // gets the head object which contains the metadata details.
                    let result = await UtilityDao.getHeadObject(bucketName, fileDetail, paramDetails);

                    // checking if object group Id matches to the current groupId.
                    if (result && result.Metadata['object-group-id'] && result.Metadata['object-group-id'].includes(objectGroupId)) {
                        fileNames.push(fileKey);
                    }
                }
            }
            return fileNames;
        } catch (error) {
            logger.error(`Exception occurred while fetching list of files, ${error.toString()}`);
            throw error;
        }
    }

    /**
    * @param {*} dataBo
    * @param {*} paramDetails
    * @param {*} fileName
    * @description  moves file to archive location
    */

    async moveFileToArchive(dataBo, paramDetails, fileName) {
        try {
            if (!fileName) {
                fileName = dataBo.param[0].batch.find(record => record.name === 'fileName') ? dataBo.param[0].batch.find(record => record.name === 'fileName').value : '';
            }

            let archivePathDetails = `interfaces/archive/${paramDetails.domain}/${paramDetails.interfaceName}/${paramDetails.jobName}`;
            logger.debug(`Archive path : ${archivePathDetails}`);

            let sourcePathDetails = `interfaces/input/${paramDetails.domain}/${paramDetails.interfaceName}/${paramDetails.jobName}/${fileName}`;

            logger.info(`Moving file : ${sourcePathDetails} to archive folder`);
            logger.debug((`archive:: ${dataBo.bucketName}/${archivePathDetails} :: source :: ${dataBo.bucketName}/${sourcePathDetails} :: fileName :: ${fileName}`));
            await UtilityDao.copyObject(`${dataBo.bucketName}/${archivePathDetails}`, `${dataBo.bucketName}/${sourcePathDetails}`, fileName);
            logger.info(`File ${sourcePathDetails} copied to archive folder`);
            await UtilityDao.deleteObject(dataBo.bucketName, `${sourcePathDetails}`);
            logger.info(`File ${sourcePathDetails} deleted from input folder`);
        } catch (error) {
            logger.error(`Exception occurred while moving files to archive, ${error.toString()}`);
            throw error;
        }
    }

    /**
     * @param {*} messageBo 
     * @description creates custom params
     */
    async getParamJson(messageBo) {
        try {
            let jobName = messageBo.jobName || '';
            let domain = messageBo.originDomain || '';
            let interfaceName = messageBo.interfaceName || '';
            let country = messageBo.config.country || '';
            return {
                jobName,
                domain,
                interfaceName,
                country
            };
        } catch (ex) {
            logger.error('Exception occurred in request :: ', ex);
            // throw utils.genericException(ex, ExceptionType.INVALID_INPUT_REQUEST, ExceptionCategory.INPUT_REQUEST_ERROR, ex.message);
        }
    }

    /**
    * 
    * @param {*} messageBo 
    * @description This method is used to set status warehouse job  */
   async updateErrorStatus(domainName, partitionkey, sortKey, error) {
    try {
        const tableName = `${domainName}-${process.env.JOB_EXECUTION_STATUS_TABLE_SUFFIX}`;
        const creationTime = Math.round(new Date().getTime() / 1000);

        const updateParams = {
            TableName: tableName,
            Key: {
                'partitionkey': partitionkey,
                'sortKey': sortKey
            },
            UpdateExpression: 'set #err  = :error, updationTime = :updationTime',
            ExpressionAttributeValues: {
                ':error': error,
                ':updationTime': creationTime
            },
            ExpressionAttributeNames: {
                "#err": "error"
            },
            ReturnValues: 'UPDATED_NEW'
        };
        logger.debug(`update params for WarehouseErrorStatus::: ${JSON.stringify(updateParams)}`);

        return await new DBHelper().update(updateParams);
    } catch (ex) {
        logger.error(`Error occurred while updating warehouse status. partitionkey: ${partitionkey}, sortKey: ${sortKey}. Error : ${ex}`);
        throw ex;
    }
}

}

module.exports = FileSuccessHandlerService;
