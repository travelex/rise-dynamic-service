const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

class StatsService {

    static async getStats(entity, operation) {

        
        try {
            logger.debug('fetching stats')
            let params = {
                TableName: process.env.STATS_TABLE,
                Key: {
                    entity,
                    operation
                }
            };
            const dbResponse = await documentClient.get(params).promise();
            return dbResponse.Item
        } catch (err) {
            logger.error(`Error occurred while fetching the stats :: ${err}`);
            throw err;
        }
    }

}
module.exports = StatsService