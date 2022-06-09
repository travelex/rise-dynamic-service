const util = require('../utils/Utils.js');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const dynamicDao = require('../dal/DynamicDao');
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
const reqFromMem = require('require-from-memory');

process
	.on('UnhandledPromiseRejectionWarning', (ex) => {
		logger.error(`Unhandled Promise Rejection Warning : ${ex}`);
		throw util.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
	})
	.on('UnhandledPromiseRejection', (ex) => {
		logger.error(`Unhandled Promise Rejection : ${ex}`);
		throw util.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
	});



class DynamicService {

	/**
 * 
 * @param {*} requestBo 
 * @param {*} preProcessorRules 
 */
	async applyRules(filePath) {
		try {
			if (filePath) {
				logger.info('Validating Rule');
				logger.debug('Reading  rule');
				let readStream = await this.readStream(process.env.BUCKET_NAME, filePath);
				logger.debug(`Rule path :: ${filePath}`);
				const currentPath = __dirname;
				logger.debug(`current path :: ${currentPath}`);
				const childNodeModulePath = currentPath.substring(0, currentPath.lastIndexOf('src')) + 'node_modules';
				logger.debug(`Child Node Module Path :: ${childNodeModulePath}`);
				const opts = { prependPaths: [childNodeModulePath], logFilter: () => false };
				let ruleObject = await reqFromMem.requireFromString(readStream.toString('utf-8'), __dirname + `/${filePath}`, opts);
				logger.debug('Evaluating  rule');

				logger.debug('Apply  rule');
				let ruleResponse = await ruleObject.apply();
				logger.debug(`Response from  Rules files: ${ruleResponse}`);

				let jsonresponse = util.parseElement(ruleResponse);
				logger.debug(`Response received from Rule ${filePath} in JSON: ${JSON.stringify(jsonresponse)}`);
				logger.info('Rule validated successfully');
				return jsonresponse;

			} else {
				logger.error('No Rules defined');
				return {
					success: false
				};
			}
		} catch (exception) {
			logger.error(`Appy Rules Error: ${exception}`);
			throw util.genericException(exception, ExceptionType.ERROR_WHILE_VALIDATION, ExceptionCategory.VALIDATION_ERROR, exception.message);
		}
	}




    /**
	 * Gets file data from cloud storage  
	 * @param {String} bucket Bucket name
	 * @param {String} key File path
	 * @description It reads the file which is stored in S3 bucket.
	 */
	async readStream(bucket, key) {
		try {
			return await dynamicDao.getStream(bucket, key);
		} catch (exception) {
			logger.error(`ReadStream error: ${exception}`);
			throw util.genericException(exception, ExceptionType.ERROR_WHILE_READINGFILE, ExceptionCategory.FILEOPERATION_ERROR, key, exception.message);
		}
	}

	/**
	 * Evaluates pre-processor rule code and executes it.
	 * @param stream  pre-processor rule code file.
	 *  
	 */
	async evalStream(stream) {
		try {
			return eval(stream);
		} catch (exception) {
			logger.error(`EvalStream error: ${exception}`);
			throw util.genericException(exception, ExceptionType.ERROR_WHILE_EVALUATING_FILE, ExceptionCategory.FILEOPERATION_ERROR, exception.message);
		}
	}
}

module.exports = new DynamicService();