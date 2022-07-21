
const StatsService = require('../service/StatsService');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));


class StatsApi {

    async process(event) {
        try {
            logger.debug(`Received Event:  ${JSON.stringify(event)}`);
            const entity = event.pathParameters?.entity;
            const operation = event.queryStringParameters?.operation;
            
            if (entity && operation ) {
                const response = await StatsService.getStats(entity, operation);

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
                        errorMessage : 'Stats are not available for enitity : ' + entity + ' and operation : ' + operation + '.' 
                    })
                }

            } else{
                throw new Error('Missing path param "entity" or queryParameter "operation".');
            }
            
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

// new StatsApi().process({
//     queryStringParameters : {
//         operation : 'sum'
//     },
//     pathParameters : {
//         entity : 'inactive_mentee1'
//     }
// }).then(console.log).catch(console.log)
module.exports = StatsApi;