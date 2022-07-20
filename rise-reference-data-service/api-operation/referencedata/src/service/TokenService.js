const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const SecretManagerClient = require('../dao/SecretManagerClient');

class TokenService {

    /**
     * @desc method is used to invalidate token from the table
     * @param id AUTH_CODE received from the server
     * @returns {Promise<DocumentClient.UpdateItemOutput & {$response: Response<DocumentClient.UpdateItemOutput, Error & {code: string, message: string, retryable?: boolean, statusCode?: number, time: Date, hostname?: string, region?: string, retryDelay?: number, requestId?: string, extendedRequestId?: string, cfId?: string, originalError?: Error}>}>}
     */
    async invalidateToken(id) {
        try {
            let params = {
                TableName: process.env.AUTHENTICATION_TOKEN_TABLE,
                Key: {
                    code: id
                },
                ExpressionAttributeNames: {
                    "#INV": "invalid"
                },
                ExpressionAttributeValues: {
                    ':expired': true
                },
                ReturnValues: "ALL_NEW",
                UpdateExpression: "SET #INV = :expired",
                ConditionExpression: `attribute_exists(${"code"})`
            };

            return await documentClient.update(params).promise();
        } catch (err) {
            logger.error(`Error occurred while invalidating the token. Provided id does not exists :: ${err}`);
            throw err;
        }
    }

    

    
    /**
     * @desc method is used to update expiry time of the token
     * @param id AUTH_CODE received from the server
     * @returns {Promise<DocumentClient.UpdateItemOutput & {$response: Response<DocumentClient.UpdateItemOutput, Error & {code: string, message: string, retryable?: boolean, statusCode?: number, time: Date, hostname?: string, region?: string, retryDelay?: number, requestId?: string, extendedRequestId?: string, cfId?: string, originalError?: Error}>}>}
     */
     async getUserIdentityDetails(id) {
        logger.debug('fetching user details')
        try {
            let params = {
                TableName: process.env.AUTHENTICATION_TOKEN_TABLE,
                Key: {
                    code: id
                }
            };

            return await documentClient.get(params).promise();
        } catch (error) {
            logger.error(`Error occurred while Fetching User Details. provided id does not exists :: ${error}`);
            throw error;
        }
    }

    static async getUserRole(object_id){

        // await SecretManagerClient.getSecretFromProvider(ssmKeys)
        const ssmKey = process.env.USER_ROLES_SSM_KEY
        const ssmResponse = await SecretManagerClient.getSecretFromProvider([ssmKey])
        const userRoles = JSON.parse(JSON.parse(ssmResponse[ssmKey]));

        logger.debug('SSM KEY : ' + ssmKey);
        logger.debug('userRoles : ' + JSON.stringify(userRoles));
        return userRoles[object_id]
     }

}

function parseObject(obj) {
    let result;
    try {
        // preserve newlines, etc - use valid JSON
        result = obj.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
// remove non-printable and other non-valid JSON chars
        result = result.replace(/[\u0000-\u0019]+/g, "");
        return JSON.parse(result)
    } catch (err) {
        return obj;
    }

}

module.exports = TokenService