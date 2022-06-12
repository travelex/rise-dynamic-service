const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('StatsService');
let S3Service = require('../dal/S3Dao')
const reqFromMem = require('require-from-memory');
const util = require('../utils/Utils')
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
class StatsService {

    /**
     * Main method to process each Request 
     * @param {*} requestBo 
     */
    async process(requestBo) {
        try {
            /**
             * 1. Get all files according to rules
             * 2. Do pre process and Post of Files 
             */
            let pathToRetrieve = requestBo.getRulePathsForOperation()
            logger.debug(`Rule Path :: ${pathToRetrieve}`);
            
            let bucketName = process.env.BUCKET_NAME
            logger.debug(`Bucket Name :: ${bucketName}`);
            let filesFromS3 = await S3Service.listObjects(bucketName, pathToRetrieve).Contents
            logger.debug(filesFromS3);
            /**
             * Iterating for each file to Get the Content 
             */
            for (let fileCount = 0; fileCount < filesFromS3.length; fileCount++) {
                let fileName = filesFromS3[fileCount]
                logger.debug(`Rule Name :: ${fileName}`);
                let fileContent = await S3Service.getStream(bucketName,fileName).toString('utf-8')
                logger.debug("File Content = "+fileContent)
            }
        } catch (error) {
            logger.error(`Error occurred while fetching connection: ${JSON.stringify(error)}`);
            throw util.genericException(error, ExceptionType.ERROR_WHILE_VALIDATION, ExceptionCategory.VALIDATION_ERROR, error.message);

        }
    }
}

module.exports = new StatsService();