var aws = require('aws-sdk');
let docClient = new aws.DynamoDB.DocumentClient();
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

const TABLE_NAME = process.env.TABLE_NAME;
let sdkRetryDelay = process.env.DELAY_IN_SECOND;
let errorCodeToCheck = process.env.ERROR_CODE_TO_CHECK;

class DynamoDao {

    /**
     * 
     * @param {*} record
     * @description save the record into Dynamo DB 
     */
    async saveRecord(record, trackingId, recordNo) {
        let isInternalServerErrorStatus = false;
        try {

            var params = {
                TableName: TABLE_NAME,
                Item: record,
                ConditionExpression: 'attribute_not_exists(id)'
            };

            return await new aws.DynamoDB({
                retryDelayOptions: {
                    customBackoff: function (retryCount, err) {
                        if (err && (err.statusCode == 500 || err.statusCode == 503)) {
                            isInternalServerErrorStatus = true;
                            logger.error(`SDK Retry attempt ${retryCount} having internal server error for tracking ID : ${trackingId} , recordNo : ${recordNo} and isInternalServerErrorStatus : ${isInternalServerErrorStatus} with exception : ${err} `);
                        } else {
                            logger.error(`SDK Retry attempt ${retryCount} for tracking ID : ${trackingId} , recordNo : ${recordNo} and isInternalServerErrorStatus : ${isInternalServerErrorStatus} with exception : ${err} `);
                        }

                        // Delay in second
                        return sdkRetryDelay;
                    }
                }
            }).putItem(params).promise();

        } catch (ex) {
            if (isInternalServerErrorStatus && ex && errorCodeToCheck.includes(ex.code)) {
                logger.error(`Skipped Conditional check exception after Internal server error occurred for tracking ID : ${trackingId} , recordNo : ${recordNo} and isInternalServerErrorStatus ${isInternalServerErrorStatus}  with Exception : ${ex}`);
                return isInternalServerErrorStatus;
            } else if (isInternalServerErrorStatus && ex && (ex.statusCode == 500 || ex.statusCode == 503)) {
                logger.error(`Internal Server Exception occurred after max retry while putting records to DB for tracking ID : ${trackingId} , recordNo : ${recordNo} and isInternalServerErrorStatus ${isInternalServerErrorStatus} with Exception : ${ex}`);
                throw ex;
            }
            else {
                logger.error(`Exception occurred while putting records to DB for tracking ID : ${trackingId} , recordNo : ${recordNo} and isInternalServerErrorStatus ${isInternalServerErrorStatus} with Exception : ${ex}`);
            }
        }
    }

    /**
     * 
     * @param {*} traceId 
     * @param {*} totalRecordCount 
     */
    async updateRecordCount(traceId, totalRecordCount) {
        try {
            var docClient = new aws.DynamoDB.DocumentClient();
            const params = {
                TableName: TABLE_NAME,
                Key: {
                    'id': traceId,
                    'recNo': 0
                },
                UpdateExpression: 'set currentCount  = currentCount + :currentCount',
                ConditionExpression: 'currentCount < :count',
                ExpressionAttributeValues: {
                    ':currentCount': 1,
                    ':count': totalRecordCount
                },
                ReturnValues: 'UPDATED_NEW'
            };

            return await docClient.update(params).promise();

        } catch (ex) {
            logger.error(`Exception occurred for trackingId ${traceId} while increasing currentCount:: , ${ex}`);
        }
    }

    async getAllRecords() {
        try {
            var docClient = new aws.DynamoDB.DocumentClient();
            const params = {
                TableName: TABLE_NAME,
                Key: {
                    'id': 1,
                    'recNo': 0
                }
            };
            return await docClient.query(params).promise();
        } catch (ex) {
            logger.error(`Exception occurred while fetching records :: , ${ex}`);
        }
    }

    async getRecords(queryParams) {
        try {
            return await docClient.query(queryParams).promise();
        } catch (error) {
            logger.error(`Exception occurred while fetching records :: , ${error}`);
            throw error;
        }
    }

    async deleteRecords(params) {
        try {
            return await docClient.update(params).promise();
        } catch (error) {
            logger.error(`Exception occurred while deleting records :: , ${error}`);
            throw error;
        }
    }

    async putRecords(params) {
        try {
            return await docClient.batchWrite(params).promise();
        } catch (error) {
            logger.error(`Exception occurred while inserting records :: , ${error}`);
            throw error;
        }
    }

    async updateRecords(params){
        try { 
            return await docClient.update(params).promise();
        } catch (error) {
            logger.error(`Exception occurred while updating records :: , ${error}`);
            throw error;
        }
    }
}

module.exports =  new DynamoDao();