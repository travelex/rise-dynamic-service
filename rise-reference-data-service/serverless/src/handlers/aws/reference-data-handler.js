const ReferenceDataApi = require('reference-data-lambda').apiProcessor;
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

exports.handler = async (event, context) => {

    try {
        console.log(`Handler Event : ${JSON.stringify(event)}`);
        const response = await new ReferenceDataApi().process(event);
        console.log(response)
        logger.debug(`reference data :- ${JSON.stringify(response)}`);
        return response;
    } catch (error) {
        console.error(error)
        logger.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                errorMessage: error.message
            })
        }
    }
}


// async function test(event, context) {

//     try {
//         const response = await new UserProfileApi().process({});
//         console.log(response)
//         logger.debug(`User profile data :- ${JSON.stringify(response)}`);
//     } catch (error) {
//         console.error(error)
//         logger.error(error);
//         return {
//             statusCode : 500,
//             body : JSON.stringify({
//                 errorMessage : error.message
//             })
//         }
//     }
// }



function parseElement(element) {
    try {
        return JSON.parse(element);
    } catch (err) {
        return element;
    }
}





