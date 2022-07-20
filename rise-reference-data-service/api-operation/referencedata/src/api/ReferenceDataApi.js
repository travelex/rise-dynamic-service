const DynamodbService = require('../service/DynamodbService');
const Util = require('../Utils/Util');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));


class ReferenceDataApi {

    async process(event) {
        try {
            logger.debug(`Received Event:  ${JSON.stringify(event)}`);
            console.log(`Received Event:  ${JSON.stringify(event)}`);

            const email_id = event.pathParameters?.email_id
            if (email_id) {

                const response = await DynamodbService.getUserProfile(email_id);

                if (response) {
                    return {
                        statusCode: 200,
                        headers: {
							"Content-Type" : "application/json",
							"Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,code,code_verfier,applicationid",
							"Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
							"Access-Control-Allow-Credentials" : false,
							"Access-Control-Allow-Origin" : "*",
							"X-Requested-With" : "*"
						  },
                        body: JSON.stringify(response)
                    }
                }

                return {
                    statusCode: 404,
                    headers: {
                        "Content-Type" : "application/json",
                        "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,code,code_verfier,applicationid",
                        "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
                        "Access-Control-Allow-Credentials" : false,
                        "Access-Control-Allow-Origin" : "*",
                        "X-Requested-With" : "*"
                      },
                    body: JSON.stringify({
                        email_id,
                        error_message : 'Record not found.' 
                    })
                }

            }
            throw new Error('email Id path param is missing');

        } catch (error) {
            console.error(error)
            logger.error(error);
            throw error;
        }
    }
}

// new UserProfileApi({}).process().then(console.log)

module.exports = ReferenceDataApi;