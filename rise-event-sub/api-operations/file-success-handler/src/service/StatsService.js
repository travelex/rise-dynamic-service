const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('StatsService');
let S3Service = require('../dal/S3Dao')
const reqFromMem = require('require-from-memory');
const util = require('../utils/Utils')
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
var aws = require('aws-sdk');
let docClient = new aws.DynamoDB.DocumentClient();
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
            let filesFromS3 = await S3Service.listObjects(bucketName, pathToRetrieve)
            logger.debug(filesFromS3);
            filesFromS3 = filesFromS3.Contents
            /**
             * Iterating for each file to Get the Content 
             */
            for (let fileCount = 0; fileCount < filesFromS3.length; fileCount++) {
                let fileName = filesFromS3[fileCount].Key
                logger.debug(`Rule Name :: ${fileName}`);
                let fileContent = await S3Service.getObjectData(bucketName,fileName)
                fileContent = fileContent.toString("utf-8")
                logger.debug("File Content = "+fileContent)
                const currentPath = __dirname;
				logger.debug(`current path :: ${currentPath}`);
				const childNodeModulePath = currentPath.substring(0, currentPath.lastIndexOf('src')) + 'node_modules';
				logger.debug(`Child Node Module Path :: ${childNodeModulePath}`);
				const opts = { prependPaths: [childNodeModulePath], logFilter: () => false };
				let ruleObject = await reqFromMem.requireFromString(fileContent, __dirname + `/${filePath}`, opts);
				logger.debug('Rule Required from memory');

				logger.debug(' Pre Applying rule');
                await ruleObject.preProcess(requestBo, docClient, opts)
                logger.info(' Pre process Applied');
                await ruleObject.process(requestBo, docClient, opts)
                logger.info('Process Applied');
                await ruleObject.postProcess(requestBo, docClient, opts)
                logger.info('Post Process Applied');
            }
        } catch (error) {
            logger.error(`Error occurred while fetching connection: ${JSON.stringify(error)}`);
            throw util.genericException(error, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, error.message);

        }
    }
}

module.exports = new StatsService();