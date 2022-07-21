const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

class ReferenceDataService {

    static async getReferenceData(refdata) {

        try {
            const response = {};
            const refDataList = refdata.split(',');
            logger.debug(refDataList);
            for (let index = 0; index < refDataList.length; index++) {
                const params = { Bucket: 'tvx-mentorship-' + process.env.BUCKET_NAME, Key: 'static-data/' + refDataList[index] + '.json' };
                const filedata = await s3.getObject(params).promise();
                logger.debug(JSON.parse(filedata.Body.toString()));
                response[refDataList[index]] = JSON.parse(filedata.Body.toString())
            }
            logger.debug(response);
            return response;
        } catch (err) {
            throw err;
        }
    }

}

module.exports = ReferenceDataService