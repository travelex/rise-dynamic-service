const util = require('../utils/Utils.js');
var AWS = require('aws-sdk');

const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
// const dynamicDao = require('../dal/DynamicDao');
const dynamoDao = require('../dal/DynamoDao');
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
// const reqFromMem = require('require-from-memory');
const TABLE_NAME = process.env.TABLE_NAME;
const USER_TABLE = process.env.USER_PROFILE_TABLE_NAME;

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
			console.log("getConnectionInfo queryParams: ", queryParams);
			let response = await dynamoDao.getRecords(queryParams);
			console.log("getConnectionInfo response", response);
			if (response.Items && response.Items.length > 0) {
				let data = {
					status: 200,
					message: "Connection list fetched",
					body: {}
				};
				data.body.pending = response.Items.filter(data => data.connection_status.toLowerCase() == 'pending');
				data.body.approved = response.Items.filter(data => data.connection_status.toLowerCase() == 'approved');
				data.body.cancelled = response.Items.filter(data => data.connection_status.toLowerCase() == 'cancelled');
				return data;
			} else {
				return {
					status: 404,
					message: "Connection with this account not found"
				};
			}
		} catch (error) {
			logger.error(`Error occurred while fetching connection: ${JSON.stringify(error)}`);
			throw error;
		}
	}

	async putConnection(params, body) {
		try {
			let status;
			let fetchQueryParams, updateQueryParams, checkBeforeInsertParams, response;
			console.log("params.create_if_not_exist", params.create_if_not_exist);
			if (params.create_if_not_exist == 'true') {
				// to check wether mentor already has 2 mentee
				let noOfMenteeParams = this.getNoOfMenteeParams(params);
				let noOfMentee = await dynamoDao.getRecords(noOfMenteeParams);
				console.log("Mentee");
				console.log(noOfMentee);
				if (noOfMentee.Count >= 2) {
					return {
						status: 200,
						message: `Mentor is already booked`
					};
				}
				// to check wether mentee has any connection 
				let noOfMentorParams = this.getNoOfMentorParams(params);
				let noOfMentor = await dynamoDao.getRecords(noOfMentorParams);
				console.log("Mentors");
				console.log(noOfMentor);
				if (noOfMentor.Count >= 1) {
					return {
						status: 200,
						message: `You already have a connection with a mentor`
					};
				}
				console.log("Trying to insert");
				let dataInsertPostCheck = true;
				checkBeforeInsertParams = this.getQueryParams(params);
				console.log("checkBeforeInsertParams", JSON.stringify(checkBeforeInsertParams));
				if (checkBeforeInsertParams && checkBeforeInsertParams.length) {
					for (let object = 0; object < checkBeforeInsertParams.length; object++) {
						let data = await dynamoDao.getRecords(checkBeforeInsertParams[object]);
						console.log("data ", JSON.stringify(data));
						if (data.Items && data.Items.length) {
							dataInsertPostCheck = false;
						}
					}
				}
				if (dataInsertPostCheck == true) {
					fetchQueryParams = this.getInsertRecordsParams(params, body);
					console.log("fetchQueryParams:", JSON.stringify(fetchQueryParams));
					await dynamoDao.putRecords(fetchQueryParams);
					console.log("Data Inserted");
					response = "Connection request sent";
					status = "pending";
				} else {
					return {
						status: 200,
						message: `Connection already sent`
					};
				}
			} else {
				console.log("Trying to update");
				let fetchDetailsOfMentor = this.getFetchDetailsOfMentor(params);
				console.log("fetchDetailsOfMentor", fetchDetailsOfMentor);
				let mentorDetails = await dynamoDao.getItem(fetchDetailsOfMentor);
				console.log("mentorDetails:", JSON.stringify(mentorDetails));
				let userStatus;
				if (mentorDetails.Item && mentorDetails.Item.length) {
					userStatus = mentorDetails.Item[0].mentor?.status
				} else {
					return {
						status: 200,
						message: `No Mentor found in userProfile table`
					};
				}
				fetchQueryParams = this.getQueryParams(params);
				console.log("fetchQueryParams", JSON.stringify(fetchQueryParams));
				if (fetchQueryParams && fetchQueryParams.length) {
					for (let object = 0; object < fetchQueryParams.length; object++) {
						let data = await dynamoDao.getRecords(fetchQueryParams[object]);
						console.log("data: ", JSON.stringify(data));
						if (data.Items && data.Items.length) {
							console.log("relevant records found for update");
							console.log(data.Items[0]);
							if (body.status == "approved") {
								response = await this.approveConnection(data.Items[0], body, userStatus);
							} else if (body.status == "cancelled") {
								response = await this.rejectConnection(data.Items[0], body, userStatus)
							}
							updateQueryParams = this.getUpdateRecordsParams(data.Items[0], body);
							let result = await dynamoDao.updateRecords(updateQueryParams);
							console.log(result);
						}
					}
				}
				status = body.status;
			}
			try {
				console.log("Sending notification via SNS");
				this.publishSNSService(params, status);
			} catch (error) {
				logger.error(error);
			}
			return {
				status: 200,
				message: `${response}`
			};

		} catch (error) {
			logger.error(`Error occurred while updating connection: ${JSON.stringify(error)}`);
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
			let response, fetchQueryParams, deleteQueryParams;
			let fetchDetailsOfMentor = this.getFetchDetailsOfMentor(params);
			let mentorDetails = dynamoDao.getItem(fetchDetailsOfMentor);
			let userStatus;
			if (mentorDetails.Item && mentorDetails.Item.length) {
				userStatus = mentorDetails.Item[0].mentor?.status
			} else {
				return {
					status: 200,
					message: `No Mentor found in userProfile table`
				};
			}
			fetchQueryParams = this.getQueryParams(params);
			console.log("fetchQueryParams", JSON.stringify(fetchQueryParams));
			if (fetchQueryParams && fetchQueryParams.length) {
				for (let object = 0; object < fetchQueryParams.length; object++) {
					let data = await dynamoDao.getRecords(fetchQueryParams[object]);
					console.log("Data: ", JSON.stringify(data));
					if (data.Items && data.Items.length) {
						console.log("relevant records found for deletion");
						console.log(data.Items[0]);
						if (userStatus == "DISABLED") {
							response = "Unable to perform action, This user is temporarily disabled";
						} else {
							deleteQueryParams = this.getDeleteQueryParams(data.Items[0]);
							console.log("deleteQueryParams:: ", deleteQueryParams);
							await dynamoDao.deleteRecords(deleteQueryParams);
							//update status of mentor
							let noOfMenteeParams = this.getNoOfMenteeParams(params);
							let noOfMentee = await dynamoDao.getRecords(noOfMenteeParams);
							if (noOfMentee.Count < 2) {
								let updateUserStatusParams = this.getUpdateUserStatusParams(params, "OPEN");
								await dynamoDao.updateRecords(updateUserStatusParams);
							}
							response = "Connection Deleted";
						}
					}
				}
			}
			try {
				console.log("Sending notification via SNS");
				this.publishSNSService(params, "deleted");
			} catch (error) {
				logger.error(error);
			}
			return {
				status: 200,
				message: `${response}`
			};
		} catch (error) {
			logger.error(`Error occurred while deleting connection: ${JSON.stringify(error)}`);
			throw error;
		}
	}

	async approveConnection(params, body, userStatus) {
		try {
			if (userStatus == "BOOKED") {
				return "Unable to perform action, This user is already booked";
			} else if (userStatus == "NOT_AVAILABLE") {
				return "Unable to perform action, This user is temporarily unavailable";
			} else if (userStatus == "DISABLED") {
				return "Unable to perform action, This user is temporarily disabled";

			} else if (userStatus == "OPEN") {
				// update status of connection
				let updateQueryParams = this.getUpdateRecordsParams(params, body);
				await dynamoDao.updateRecords(updateQueryParams);
				//update status of mentor
				let noOfMenteeParams = this.getNoOfMenteeParams(params);
				let noOfMentee = await dynamoDao.getRecords(noOfMenteeParams);
				if (noOfMentee.Count == 2) {
					let updateUserStatusParams = this.getUpdateUserStatusParams(params, "BOOKED");
					await dynamoDao.updateRecords(updateUserStatusParams);
				}
				return "Connection approved"
			}
		} catch (error) {
			logger.error(`Error occurred while updating connection: ${JSON.stringify(error)}`);
			throw error;
		}
	}

	async rejectConnection(params, body, userStatus) {
		if (userStatus == "DISABLED") {
			return "Unable to perform action, This user is temporarily disabled";
		} else {
			let updateQueryParams = this.getUpdateRecordsParams(params, body);
			await dynamoDao.updateRecords(updateQueryParams);
			return "Connection rejected"
		}
	}

	async deleteConnection(params, body, userStatus) {
		if (userStatus == "DISABLED") {
			return "Unable to perform action, This user is temporarily disabled";
		} else {
			let updateQueryParams = this.getUpdateRecordsParams(params, body);
			await dynamoDao.updateRecords(updateQueryParams);
			return "Connection rejected"
		}
	}


	getFetchRecordsParams(params) {
		let queryObject;
		console.log("params", params);
		if (params.status && params.type == "both") {
			console.log("inside status and type both");
			queryObject = {
				TableName: TABLE_NAME,
				KeyConditionExpression: "#email_id = :email_id and begins_with(#user_type, :type)",
				FilterExpression: "#connection_status = :status and #is_deleted = :isDeleted",
				ExpressionAttributeNames: {
					"#email_id": "email_id",
					"#user_type": "user_type",
					"#connection_status": "connection_status",
					"#is_deleted": "is_deleted"
				},
				ExpressionAttributeValues: {
					":email_id": params.email_id,
					":type": "ment",
					":status": params.status,
					":isDeleted": 0
				}
			};
		} else if (!params.status && params.type == "both") {
			console.log("inside type both");
			queryObject = {
				TableName: TABLE_NAME,
				KeyConditionExpression: "#email_id = :email_id and begins_with(#user_type, :type)",
				FilterExpression: "#is_deleted = :isDeleted",
				ExpressionAttributeNames: {
					"#email_id": "email_id",
					"#user_type": "user_type",
					"#is_deleted": "is_deleted"
				},
				ExpressionAttributeValues: {
					":email_id": params.email_id,
					":type": "ment",
					":isDeleted": 0
				}
			};
		} else if (params.status) {
			console.log("inside status");
			queryObject = {
				TableName: TABLE_NAME,
				KeyConditionExpression: "#email_id = :email_id and begins_with(#user_type, :type)",
				FilterExpression: "#connection_status = :status and #is_deleted = :isDeleted",
				ExpressionAttributeNames: {
					"#email_id": "email_id",
					"#user_type": "user_type",
					"#connection_status": "connection_status",
					"#is_deleted": "is_deleted"
				},
				ExpressionAttributeValues: {
					":email_id": params.email_id,
					":type": params.type,
					":status": params.status,
					":isDeleted": 0
				}
			};
		} else {
			console.log("inside else");
			queryObject = {
				TableName: TABLE_NAME,
				KeyConditionExpression: "#email_id = :email_id and begins_with(#user_type, :type)",
				FilterExpression: "#is_deleted = :isDeleted",
				ExpressionAttributeNames: {
					"#email_id": "email_id",
					"#user_type": "user_type",
					"#is_deleted": "is_deleted"
				},
				ExpressionAttributeValues: {
					":email_id": params.email_id,
					":type": params.type,
					":isDeleted": 0
				}
			};
		}
		console.log("queryObject", queryObject);
		return queryObject;
	}


	getInsertRecordsParams(params, body) {
		const epochTime = Math.round(new Date().getTime() / 1000) + 2592000;
		let date = new Date();
		let insertDate = date.toISOString();
		let endDate = new Date(date.setMonth(date.getMonth() + 1)).toISOString();
		let TableName = TABLE_NAME;
		let guid = Math.floor(Math.random() * 90000) + 10000;
		let RequestItems = {};
		RequestItems[TableName] = [
			{
				PutRequest: {
					Item: {
						"email_id": params.mentee_email_id,
						"user_type": `mentor-${params.mentor_email_id}-${guid}`,
						"category": "mentee",
						"connection_status": body.status,
						"remark": body.remarks,
						"updation_datetime_iso": insertDate,
						"start_datetime_iso": insertDate,
						"end_datetime_iso": endDate,
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
						"connection_status": body.status,
						"remark": body.remarks,
						"updation_datetime_iso": insertDate,
						"start_datetime_iso": insertDate,
						"end_datetime_iso": endDate,
						"record_expiry": epochTime,
						"is_deleted": 0
					}
				}
			}
		];
		console.log(`RequestItems: ${JSON.stringify(RequestItems)}`);
		let queryParams = {
			RequestItems: RequestItems
		};
		console.log(`queryParams.RequestItems: ${queryParams.RequestItems}`);
		console.log(`queryParams.RequestItems: ${JSON.stringify(queryParams.RequestItems)}`);

		return queryParams;
	}


	getUpdateRecordsParams(params, body) {
		let queryParams;
		let date = new Date();
		let newDate = date.toISOString();
		if (body.reason_of_rejection) {
			queryParams = {
				TableName: TABLE_NAME,
				Key: {
					email_id: params.email_id,
					user_type: params.user_type
				},
				UpdateExpression: "set connection_status = :status, rejection_reason = :reason_of_rejection, updation_datetime_iso = :newDate",
				ExpressionAttributeValues: {
					':status': body.status,
					':reason_of_rejection': body.reason_of_rejection,
					':newDate': newDate
				}
			};
		} else {
			queryParams = {
				TableName: TABLE_NAME,
				Key: {
					email_id: params.email_id,
					user_type: params.user_type
				},
				UpdateExpression: "set connection_status = :status, updation_datetime_iso = :newDate",
				ExpressionAttributeValues: {
					':status': body.status,
					':newDate': newDate
				}
			};
		}
		console.log("updateQueryParam: ", queryParams);
		return queryParams;
	}

	getDeleteQueryParams(params) {
		let date = new Date();
		let newDate = date.toISOString();
		let queryParams;
		console.log("newDate", newDate);
		if (body.reason_of_deletion) {
			queryParams = {
				TableName: TABLE_NAME,
				Key: {
					email_id: params.email_id,
					user_type: params.user_type
				},
				UpdateExpression: "set is_deleted = :isDeleted, deletion_reason = :reason_of_deletion, updation_datetime_iso = :newDate",
				ExpressionAttributeValues: {
					':isDeleted': 1,
					':reason_of_deletion': body.reason_of_deletion,
					':newDate': newDate
				}
			};
		} else {
			queryParams = {
				TableName: TABLE_NAME,
				Key: {
					email_id: params.email_id,
					user_type: params.user_type
				},
				UpdateExpression: "set is_deleted = :isDeleted, updation_datetime_iso = :newDate",
				ExpressionAttributeValues: {
					':isDeleted': 1,
					':newDate': newDate
				}
			};
		}
		console.log(" getDeleteQueryParams queryParams", queryParams);
		return queryParams;
	}

	getQueryParams(params) {
		let mentee = params.mentee_email_id;
		let mentor = params.mentor_email_id;
		let queryParams = [{
			TableName: TABLE_NAME,
			KeyConditionExpression: "#email_id = :email_id and begins_with(#user_type, :type)",
			FilterExpression: "#is_deleted = :isDeleted",
			ExpressionAttributeNames: {
				"#email_id": "email_id",
				"#user_type": "user_type",
				"#is_deleted": "is_deleted"
			},
			ExpressionAttributeValues: {
				":email_id": params.mentor_email_id,
				":type": `mentee-${mentee}`,
				":isDeleted": 0
			}
		},
		{
			TableName: TABLE_NAME,
			KeyConditionExpression: "#email_id = :email_id and begins_with(#user_type, :type)",
			FilterExpression: "#is_deleted = :isDeleted",
			ExpressionAttributeNames: {
				"#email_id": "email_id",
				"#user_type": "user_type",
				"#is_deleted": "is_deleted"
			},
			ExpressionAttributeValues: {
				":email_id": params.mentee_email_id,
				":type": `mentor-${mentor}`,
				":isDeleted": 0
			}
		}];
		return queryParams;
	}

	getNoOfMenteeParams(params) {
		let mentor = params.mentor_email_id;
		let queryParams = {
			TableName: TABLE_NAME,
			KeyConditionExpression: "#email_id = :email_id",
			FilterExpression: "#connection_status = :status and #is_deleted = :isDeleted and #category = :category",
			ExpressionAttributeNames: {
				"#email_id": "email_id",
				"#connection_status": "connection_status",
				"#is_deleted": "is_deleted",
				"#category": "category"
			},
			ExpressionAttributeValues: {
				":email_id": mentor,
				":status": "approved",
				":isDeleted": 0,
				":category": "mentor"
			}
		}
		return queryParams;
	}


	getNoOfMentorParams(params) {
		let mentee = params.mentee_email_id;
		let queryParams = {
			TableName: TABLE_NAME,
			KeyConditionExpression: "#email_id = :email_id",
			FilterExpression: "#connection_status <> :status and #is_deleted = :isDeleted and #category = :category",
			ExpressionAttributeNames: {
				"#email_id": "email_id",
				"#connection_status": "connection_status",
				"#is_deleted": "is_deleted",
				"#category": "category"
			},
			ExpressionAttributeValues: {
				":email_id": mentee,
				":status": "cancelled",
				":isDeleted": 0,
				":category": "mentee"
			}
		}
		return queryParams;
	}

	getFetchDetailsOfMentor(params) {
		let mentor = params.mentor_email_id;
		let queryParams = {
			TableName: USER_TABLE,
			Key:{
				"email_id" : mentor
			}
		}
		return queryParams;
	}

	getUpdateUserStatusParams(params, status) {
		let mentor = params.mentor_email_id;
		let queryParams = {
			TableName: USER_TABLE,
			Key: {
				email_id: mentor
			},
			UpdateExpression: "set status = :status",
			ExpressionAttributeValues: {
				':status': status
			}
		}
		return queryParams
	}

	createMessageAttribues(attributes) {
		let attributeNames, msgAttribute = {};
		try {
			attributeNames = attributes;
			this.fixedAttributes.forEach(attributeName => {
				if (attributeNames[attributeName]) {
					attributeNames[attributeName] = attributeNames[attributeName];
					if (typeof attributeNames[attributeName] === 'string' || typeof attributeNames[attributeName] === 'number') {
						msgAttribute[attributeName] = {
							'DataType': 'String',
							'StringValue': typeof attributeNames[attributeName] === 'number' ? attributeNames[attributeName].toString() : attributeNames[attributeName]
						};
					} else if (typeof attributeNames[attributeName] === 'object') {
						msgAttribute[attributeName] = {
							'DataType': 'String.Array',
							'StringValue': JSON.stringify([attributeNames[attributeName]])
						};
					}
				}
			});
			return msgAttribute;
		} catch (ex) {
			console.error(ex);
		}
	}



	publishSNSService(params, status) {
		let date = new Date();
		let newDate = date.toISOString();
		let payload = {
			correlation_id: "",
			entity: "connection",
			operation: "insert",
			date_time_iso: newDate,
			data: {
				mentor_email_id: params.mentor_email_id,
				mentee_email_id: params.mentee_email_id,
				status: status
			}
		};
		// let messageAttributes = this.createMessageAttribues(payload);

		let newParams = {
			TopicArn: 'arn:aws:sns:eu-west-1:148807490170:dev-rise-audit-topic',
			Message: JSON.stringify({
				'default': 'Audit Messages',
				'sqs': JSON.stringify(payload)
			}),
			MessageAttributes: {
				'status': {
					'DataType': 'String',
					'StringValue': 'success'
				},
				'entity': {
					'DataType': 'String',
					'StringValue': 'connection'
				}
			},
			MessageStructure: 'json'
		};

		try {
			new AWS.SNS({
				apiVersion: '2010-03-31'
			}).publish(newParams, (err, success) => {
				if (err) {
					console.error(err);
				} else {
					console.log(`Message ${newParams.Message} sent to the topic ${newParams.TopicArn} `);
				}
			});
		} catch (err) {
			console.error(err);
		}
	}

	// publishSNSService(status) {
	// 	let payload = {
	// 		correlation_id: "",
	// 		entity: "connection",
	// 		operation: "insert",
	// 		date_time_iso: "",
	// 		data: {
	// 			menter_email_id: "",
	// 			mentee_email_id: "",
	// 			status: status
	// 		}
	// 	};

	// 	const params = {
	// 		Message: JSON.stringify({ 'default': 'Audit Messages', payload }), /* required */
	// 		TopicArn: 'arn:aws:sns:eu-west-1:148807490170:dev-rise-audit-topic',
	// 		MessageStructure: 'json',
	// 		MessageAttributes: {
	// 			'status': {
	// 				'DataType': 'String',
	// 				'StringValue': 'success'
	// 			}
	// 		}
	// 	};

	// 	const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

	// 	publishTextPromise.then(
	// 		function (data) {
	// 			console.log(`Message ${ params.Message } sent to the topic ${ params.TopicArn } `);
	// 			console.log("MessageID is " + data.MessageId);
	// 		}).catch(
	// 			function (err) {
	// 				console.error(err, err.stack);
	// 			});
	// }
}

module.exports = new ConnectionService();