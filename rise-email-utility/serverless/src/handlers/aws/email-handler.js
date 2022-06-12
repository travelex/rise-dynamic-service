const EmailApiProcessor = require('email-service').apiProcessor;
const winston = require('winston-wrapper');
const logger = winston.getLogger('email-handler')

exports.handler = async (event, context) => {

    try {
        console.log(`Handler Event : ${JSON.stringify(event)}`);
        const response = await new EmailApiProcessor().process(event);
        logger.debug(`User profile data :- ${JSON.stringify(response)}`);
        return  {
            statusCode : 200,
            body : JSON.stringify({error : 'succes'})
        };;
    } catch (error) {
        logger.error(error);
        return {
            statusCode : 400,
            body : JSON.stringify({error : error.message})
        };
    }
}


// async function test(event, context) {

//     try {
//         console.log(`Handler Event : ${JSON.stringify(event)}`);
//         const response = await new EmailApiProcessor().process(event);
//         logger.debug(`User profile data :- ${JSON.stringify(response)}`);
//         return response;
//     } catch (error) {
//         logger.error(error);
//         throw error;
//     }
// }


// test({},{})