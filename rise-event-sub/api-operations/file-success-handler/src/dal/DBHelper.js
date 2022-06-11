/* eslint-disable no-useless-catch */
let AWS = require('aws-sdk');
const dynamoClient = new AWS.DynamoDB.DocumentClient;
const logger = require('winston-wrapper').getLogger('DBHelper');

class DBHelper {
    constructor() { }

    /**
     * Updates the record
     * @param {*} updateExpression 
     */
    async update(updateExpression) {
        try {
            return await dynamoClient.update(updateExpression).promise();
        } catch (ex) {
            throw ex;
        }
    }

    /**
     * @description This method insert execution status
     * @param {*} domainName
     * @param {*} jobExecutionStatusBo
     */
    async insertExecutionStatus(domainName, jobExecutionStatusBo) {
        try {
            let tableName = `${domainName}-${process.env.JOB_EXECUTION_STATUS_TABLE_SUFFIX}`;
            let params = {
                TableName: tableName,
                Item: jobExecutionStatusBo,
                // ConditionExpression: `attribute_not_exists(partitionkey) AND attribute_not_exists(sortKey)`
            };
            return await dynamoClient.put(params).promise();
        } catch (ex) {
            logger.error(`Exception occurred while inserting records :: , ${ex}`);
            throw ex;
        }
    }
}

module.exports = DBHelper;