const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

class DynamodbService {

    static async getUserProfile(email_id) {
        logger.debug('fetching the user profile document')
        try {
            let params = {
                TableName: process.env.USER_PROFILE_TABLE,
                Key: {
                    email_id
                }
            };
            const dbResponse = await documentClient.get(params).promise();
            return dbResponse.Item
        } catch (err) {
            logger.error(`Error occurred while fetching the profile :: ${err}`);
            throw err;
        }
    }

    static async searchUserProfile(queryTest) {
        logger.debug('fetching the user profile document')
        try {
            // let response = await documentClient.query({
            //     TableName: process.env.USER_PROFILE_TABLE,
            //     IndexName: 'Index-Name',
            //     KeyConditionExpression: 'HashKey = :hkey and RangeKey > :rkey',
            //     ExpressionAttributeValues: {
            //         ':hkey': 'key',
            //         ':rkey': 2015
            //     }
            // }).promise();
            return { message: "TO be implemented" }
        } catch (err) {
            logger.error(`Error occurred while fetching the profile :: ${err}`);
            throw err;
        }
    }

}

module.exports = DynamodbService