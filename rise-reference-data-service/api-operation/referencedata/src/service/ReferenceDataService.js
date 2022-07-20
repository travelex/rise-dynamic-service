const AWS = require('aws-sdk');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const fs = require('fs')

class ReferenceDataService {

    static async getReferenceData(fileName) {
        logger.debug('fetching reference data')
        console.log(fileName);    
        try {
           let data = fs.readFileSync('../objectFile/referenceData.json', 'utf8')
           console.log(data);
           return data;
           
        } catch (err) {
            logger.error(`Error occurred while fetching the reference data :: ${err}`);
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

module.exports = ReferenceDataService