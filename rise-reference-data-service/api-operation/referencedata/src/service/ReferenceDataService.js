const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

class ReferenceDataService {

    static async getReferenceData(refdata) {


        try {
            logger.debug('fetching reference data');

            const params = { Bucket: 'tvx-mentorship-dev', Key: 'static-data/joblevel.json' };
            const filedata = await s3.getObject(params).promise();
            logger.debug(filedata);
            logger.debug(filedata.toString());
            return {
                name: 'bharat'
            };

        } catch (err) {
            logger.error(`Error occurred while fetching the reference data :: ${err}`);
            throw err;
        }
    }

}

module.exports = ReferenceDataService