const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const fs = require('fs')

class ReferenceDataService {

    static async getReferenceData(fileName) {
        logger.debug('fetching reference data')
        console.log(fileName);

        try {

         /*   // getting file from s3
        
        const params = {Bucket: 'reference-data', Key: fileName};
        s3.getObject(params, (err, data) => {
            if (err){
                logger.error(`error occoured while fetching data from s3 ${err}`)
            }  
            logger.debug(`data fetched from s3:: ${JSON.stringify(data)}`);     
            return data;     
          });
          */

           let data = fs.readFileSync('../objectFile/referenceData.json', 'utf8')
           console.log(data);
           return data;
           
        } catch (err) {
            logger.error(`Error occurred while fetching the reference data :: ${err}`);
            throw err;
        }
    }

}

module.exports = ReferenceDataService