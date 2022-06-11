/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-useless-catch */
'use strict';
const path = require('path');
const AWS = require('aws-sdk');
const winston = require('winston-wrapper');
const logger = winston.getLogger(path.basename(__filename));

const utils = require('../utils/Utils');
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');

let s3 = new AWS.S3();

/**
 * Utility Dao Class
 */
class UtilityDao {

	/** 
	* 
	* @param {String} bucketName 
	* @param {String} transformationpath 
	* @description Get the list of files
	*/
	async getfileList(bucketName, filePath) {
		try {
			logger.debug("inside getfileList");
			let params = {
				Bucket: bucketName,
				Prefix: filePath
			}
			let data = await s3.listObjects(params).promise();
			return data.Contents;
		} catch (ex) {
			logger.debug(ex);
			logger.error(`Exception occurred while fetching list of file details from s3 :: ,  ${ex}`);
			throw utils.genericException(ex, ExceptionType.ERROR_WHILE_FETCHING_LIST, ExceptionCategory.S3_ERROR, ex.message);
		}
	}

	/**
	 * @param {*} bucketName 
	 * @param {*} fileDetail 
	 * @description returns details of metadata applied in the file.
	 */
	async getHeadObject(bucketName, fileDetail, paramDetails) {
		try {
			let param = {
				Bucket: bucketName,
				Key: fileDetail
			};

			return await s3.headObject(param).promise();

		} catch (ex) {
			logger.error(`Exception occurred in execution of file ${paramDetails.fileName} while fetching S3 Head:, ${ex} for file: ${JSON.stringify(fileDetail)}`);
			return null;
		}

	}



	/**
	* @param {String} destinationBucket 
	* @param {JSON} source 
	* @param {String} fileName 
	* @description copying files
	*/
	copyObject(destinationBucket, source, fileName) {
		let params = {
			Bucket: destinationBucket,
			CopySource: source,
			Key: fileName
		};
		return s3.copyObject(params).promise()
			.catch(err => { throw err; });
	}

	/**
	 * 
	 * @param {*} bucketName 
	 * @param {*} key 
	 * @description deletes the files
	*/

	async deleteObject(bucketName, key) {
		try {
			let params = {
				Bucket: bucketName,
				Key: key
			};
			return await s3.deleteObject(params).promise();
		}
		catch (err) {
			throw new Error(err);
		}
	}


	/**
	 * 
	 * @param {*} param 
	 * @description get content of the files
	 */
	async getContent(param) {
		try {
			return new Promise(async (resolve, reject) => {
				let content = '';

				let data = undefined;
				try {
					data = await s3.selectObjectContent(param).promise();
					const eventStream = data.Payload;

					eventStream.on('data', (event) => {
						if (event.Records) {
							content = JSON.parse(event.Records.Payload);
						} else if (event.Stats) {
							logger.debug(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
						} else if (event.End) {
							logger.debug('SelectObjectContent completed');
						}
					});
					// Handle errors encountered during the API call
					eventStream.on('error', (err) => {
						reject(err);
					});
					eventStream.on('end', () => {
						resolve(content);
					});
				}
				catch (err) {
					logger.error(`Error while getting selectObjectContent ${err}`);
					reject(err);
				}
			});
		} catch (ex) {
			logger.error(`Error while fetching the Content ${ex}`);
			throw ex;
		}
	}

}
module.exports = new UtilityDao();