
const ReferenceDataService = require('../service/ReferenceDataService');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));


class ReferenceDataApi {

    async process(event) {
        try {
            logger.debug(`Received Event:  ${JSON.stringify(event)}`);

            const refdata = event.queryStringParameters?.refdata;
            if (refdata) {
                const response = await ReferenceDataService.getReferenceData(refdata);

                if (response) {
                    return {
                        statusCode: 200,
                        headers: {
							"Content-Type" : "application/json",
							"Access-Control-Allow-Headers" : "*",
							"Access-Control-Allow-Methods" : "OPTIONS,GET",
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
                        "Access-Control-Allow-Headers" : "*",
                        "Access-Control-Allow-Methods" : "OPTIONS,GET",
                        "Access-Control-Allow-Credentials" : false,
                        "Access-Control-Allow-Origin" : "*",
                        "X-Requested-With" : "*"
                      },
                    body: JSON.stringify({
                        errorMessage : 'Invalid "refdata" query param value.' 
                    })
                }

            } else{
                throw new Error('Required "refdata" queryParameter is missing.');
            }
            
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

// new ReferenceDataApi().process({
//     queryStringParameters : {
//         refdata : 'joblevel'
//     }
// }).then(console.log).catch(console.log)
module.exports = ReferenceDataApi;