/* eslint-disable no-useless-catch */
let AWS = require('aws-sdk');
const dynamoClient = new AWS.DynamoDB.DocumentClient;

class DBHelper {
    constructor() { }

    /**
     * Updates the record
     * @param {*} updateExpression 
     */
    async update(updateExpression) {
        try {
            return true;
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = DBHelper;