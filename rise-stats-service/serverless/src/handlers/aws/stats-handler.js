const StatsApi = require('stats-lambda').apiProcessor;
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

exports.handler = async (event, context) => {

    try {
        console.log(`Handler Event : ${JSON.stringify(event)}`);
        const response = await new StatsApi().process(event);
        console.log(response)
        logger.debug(`stats data :- ${JSON.stringify(response)}`);
        return response;
    } catch (error) {
        console.error(error)
        logger.error(error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET",
                "Access-Control-Allow-Credentials": false,
                "Access-Control-Allow-Origin": "*",
                "X-Requested-With": "*"
            },
            body: JSON.stringify({
                errorMessage: error.message
            })
        }
    }
}


// async function test(event, context) {

//     try {
//         console.log(`Handler Event : ${JSON.stringify(event)}`);
//         const response = await new StatsApi().process(event);
//         console.log(response)
//         logger.debug(`stats data :- ${JSON.stringify(response)}`);
//         return response;
//     } catch (error) {
//         console.error(error)
//         logger.error(error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 errorMessage: error.message
//             })
//         }
//     }
// }


// test({
//     queryStringParameters : {
//         operation : 'sum'
//     },
//     pathParameters : {
//         entity : 'inactive_mentee'
//     }
// }).then(console.log).catch(console.log)





