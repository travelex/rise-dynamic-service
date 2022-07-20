
const ReferenceDataService = require('../service/ReferenceDataService');
const Util = require('../Utils/Util');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));


class ReferenceDataApi {

    async process(event) {
        try {
            logger.debug(`Received Event:  ${JSON.stringify(event)}`);
            console.log(`Received Event:  ${JSON.stringify(event)}`);
            let queryParam = undefined;

            if (event.query || event.queryStringParameters) {
                try {
                    queryParam = event.query ? JSON.parse(event.query) : JSON.parse(event.queryStringParameters);
                } catch (ex) {
                    queryParam = event.query ? event.query : event.queryStringParameters;
                }
            }
            if (queryParam != undefined) {
                let filename = queryParam.referenceFile

                const response = await ReferenceDataService.getReferenceData(filename);

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

            } else{
                throw new Error('queryParameter is missing');
            }
            

        } catch (error) {
            console.error(error)
            logger.error(error);
            throw error;
        }
    }
}

module.exports = ReferenceDataApi;