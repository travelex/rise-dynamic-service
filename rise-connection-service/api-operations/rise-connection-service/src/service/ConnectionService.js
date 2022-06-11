const util = require('../utils/Utils.js');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const dynamicDao = require('../dal/DynamicDao');
const dynamoDao = require('../dal/DynamoDao');
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
const reqFromMem = require('require-from-memory');
const TABLE_NAME = process.env.TABLE_NAME;

process
	.on('UnhandledPromiseRejectionWarning', (ex) => {
		logger.error(`Unhandled Promise Rejection Warning : ${ex}`);
		throw util.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
	})
	.on('UnhandledPromiseRejection', (ex) => {
		logger.error(`Unhandled Promise Rejection : ${ex}`);
		throw util.genericException(ex, ExceptionType.UNHANDLED_EXCEPTION, ExceptionCategory.VALIDATION_ERROR, ex.message, 'Unhandled exception');
	});



class ConnectionService {

	/**
	 * 
	 * @param {*} requestBo 
	 * @param {*} preProcessorRules 
	 */
	async getConnectionInfo(params) {
		try {
			console.log(params);
			let queryParams = this.getFetchRecordsParams(params);
			console.log(queryParams);
			let response = await dynamoDao.getRecords(queryParams);
			console.log(response);
			if (response.length) {
				return response;
			} else {
				return {
					status: 404,
					description: "Connection with email_id not found"
				};
			}
		} catch (error) {
			logger.error(`Error occurred while fetching records for connection: ${JSON.stringify(error)}`);
			throw error;
		}
	}

	async putConnection(params, body) {
		try {
			let queryParams, response;
			console.log("params.create_if_not_exist", params.create_if_not_exist);
			if (params.create_if_not_exist == 'true') {
				console.log("Trying to insert");
				queryParams = this.getInsertRecordsParams(params, body);
				console.log(JSON.stringify(queryParams));
				await dynamoDao.putRecords(params);
				console.log("Data Inserted");
				response = "Created";
			} else {
				console.log("Trying to update");
				queryParams = this.getUpdateRecordsParams(params, body);
				console.log(JSON.stringify(queryParams));
				if (queryParams.length) {
					for (let object = 0; object < queryParams.length; object++) {
						let result = await dynamoDao.updateRecords(queryParams[object]);
						console.log(result);
					}
				}
				response = "Updated";
			}
			return {
				status: 200,
				description: `Connection ${response}`
			};

		} catch (error) {
			logger.error(`Error occurred while fetching records for connection: ${JSON.stringify(error)}`);
			throw error;
		}
	}


	/**
	 * 
	 * @param {*} params 
	 * @param {*} preProcessorRules 
	 */
	async deleteConnection(params) {
		try {
			let response = "deleted";
			let queryParams = this.getDeleteQueryParams(params);
			if (queryParams.length) {
				for (let object = 0; object < queryParams.length; object++) {
					let result = await dynamoDao.deleteRecords(queryParams);
					console.log(result);
				}
			}
			return {
				status: 200,
				description: `Connection ${response}`
			};
		} catch (error) {
			logger.error(`Error occured while fetching records for connection: ${JSON.stringify(error)}`);
			throw error;
		}
	}

	getFetchRecordsParams(params) {
		let queryObject;
		if (params.status) {
			queryObject = {
				TableName: TABLE_NAME,
				KeyConditionExpression: "email_id = :email_id and begins_with(user_type, :type) and status = :status",
				ExpressionAttributeValues: {
					":email_id": { S: params.email_id },
					":type": { S: params.type },
					":status": { S: params.status }
				}
			};
		} else {
			queryObject = {
				TableName: TABLE_NAME,
				KeyConditionExpression: "email_id = :email_id and begins_with(user_type, :type)",
				ExpressionAttributeValues: {
					":email_id": { S: params.email_id },
					":type": { S: params.type }
				}
			};
		}
		return queryObject;
	}

	getInsertRecordsParams(params, body) {
		const epochTime = Math.round(new Date().getTime() / 1000);
		let date = new Date();
		let insertDate = date.toISOString();
		let TableName = TABLE_NAME;
		console.log(TableName);
		let guid = 12345;
		// let queryParams = {
		// 	RequestItems: {
		// 		[TABLE_NAME]: [
		// 			{
		// 				PutRequest: {
		// 					Item: {
		// 						"email_id": params.mentee_email_id,
		// 						"user_type": `mentor-${params.mentor_email_id}-${guid}`,
		// 						"category": "mentee",
		// 						"status": body.status,
		// 						"remark": body.remark,
		// 						"updation_datetime_iso": insertDate,
		// 						"start_datetime_iso": insertDate,
		// 						"end_datetime_iso": insertDate,
		// 						"record_expiry": epochTime,
		// 						"is_deleted": 0
		// 					}
		// 				}
		// 			},
		// 			{
		// 				PutRequest: {
		// 					Item: {
		// 						"email_id": params.mentor_email_id,
		// 						"user_type": `mentee-${params.mentee_email_id}-${guid}`,
		// 						"category": "mentor",
		// 						"status": body.status,
		// 						"remark": body.remark,
		// 						"updation_datetime_iso": insertDate,
		// 						"start_datetime_iso": insertDate,
		// 						"end_datetime_iso": insertDate,
		// 						"record_expiry": epochTime,
		// 						"is_deleted": 0
		// 					}
		// 				}
		// 			}
		// 		]
		// 	}
		// };


		let RequestItems = {};
		RequestItems['rise-connections-dev'] = [
			{
				PutRequest: {
					Item: {
						"email_id": params.mentee_email_id,
						"user_type": `mentor-${params.mentor_email_id}-${guid}`,
						"category": "mentee",
						"status": body.status,
						"remark": body.remark,
						"updation_datetime_iso": insertDate,
						"start_datetime_iso": insertDate,
						"end_datetime_iso": insertDate,
						"record_expiry": epochTime,
						"is_deleted": 0
					}
				}
			},
			{
				PutRequest: {
					Item: {
						"email_id": params.mentor_email_id,
						"user_type": `mentee-${params.mentee_email_id}-${guid}`,
						"category": "mentor",
						"status": body.status,
						"remark": body.remark,
						"updation_datetime_iso": insertDate,
						"start_datetime_iso": insertDate,
						"end_datetime_iso": insertDate,
						"record_expiry": epochTime,
						"is_deleted": 0
					}
				}
			}
		]
		console.log(`RequestItems: ${JSON.stringify(RequestItems)}`);
		let queryParams = {
			RequestItems: RequestItems
		}
		console.log(`queryParams.RequestItems: ${queryParams.RequestItems}`);
		console.log(`queryParams.RequestItems: ${JSON.stringify(queryParams.RequestItems)}`);

		return queryParams;
	}


	getUpdateRecordsParams(params, body) {
		let mentorType = `mentor-${params.mentee_email_id}`;
		let menteeType = `mentee-${params.mentor_email_id}`;

		let queryParams = [
			{
				TableName: TABLE_NAME,
				Key: {
					"email_id": params.mentee_email_id
				},
				UpdateExpression: "set status = :status and remark = :remark",
				ConditionExpression: 'begins_with(user_type, :type)',
				ExpressionAttributeValues: {
					':status': body.status,
					':remark': body.remark,
					':type': menteeType,
				}
			},
			{
				TableName: TABLE_NAME,
				Key: {
					"email_id": params.mentor_email_id
				},
				UpdateExpression: "set status = :status and remark = :remark",
				ConditionExpression: 'begins_with(user_type, :type)',
				ExpressionAttributeValues: {
					':status': params.status,
					':remark': params.remark,
					':type': mentorType,
				}
			}
		];
		return queryParams;
	}


	getDeleteQueryParams(params) {
		let mentorType = `mentor-${params.mentee_email_id}`;
		let menteeType = `mentee-${params.mentor_email_id}`;

		let queryParams = [
			{
				TableName: TABLE_NAME,
				Key: {
					"email_id": params.mentee_email_id
				},
				UpdateExpression: "set is_deleted = :isDeleted",
				ConditionExpression: 'begins_with(user_type, :type)',
				ExpressionAttributeValues: {
					':isDeleted': 1,
					':type': menteeType,
				}
			},
			{
				TableName: TABLE_NAME,
				Key: {
					"email_id": params.mentor_email_id
				},
				UpdateExpression: "set is_deleted = :isDeleted",
				ConditionExpression: 'begins_with(user_type, :type)',
				ExpressionAttributeValues: {
					':isDeleted': 1,
					':type': mentorType,
				}
			}
		];
		return queryParams;
	}

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

module.exports = new ConnectionService();