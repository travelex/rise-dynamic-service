const dynamoDao = require('../dal/DynamoDao.js');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

class Mentor {

    async apply() {
        try {

            logger.debug('Applying Rule');
            let response = await new dynamoDao().getAllRecords();
            return response;

        } catch (err) {
            logger.error(`Error occurred while applying rule :: ${err}`);
            throw err;
        }
    }
}

module.exports = new Mentor();