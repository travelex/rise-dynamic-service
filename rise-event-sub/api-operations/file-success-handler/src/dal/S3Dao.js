/* eslint-disable no-useless-catch */
'use strict';

const path = require('path');

const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2015-03-31', region: 'eu-west-1'});

// let FileConverterHelper = require('./FileConverterHelper');

class S3Dao {

	/**
	 * Gets file data from cloud storage  
	 * @param {String} bucket Bucket name
	 * @param {String} file File path
	 * @description It reads the file which is stored in S3 bucket.
	 */
	async getStream(bucket, file) {
		try {

			let params = {
				Bucket: bucket,
				Key: file
			};
			logger.info(`getting file stream ${JSON.stringify(params)}`);

			return new Promise(async (resolve, reject) => {
				let objectBuffer = '';
				let objectStream = await s3.getObjectStream(params);

				objectStream.on('data', data => {
					objectBuffer += data;
				});

				objectStream.on('finish', () => {
					resolve(objectBuffer);
				});

				objectStream.on('error', error => {
					reject(error);
				});
			});

		} catch (exception) {
			logger.error(`Exception occurred for getting object from the bucket ${exception}`);
			throw new Error(`Error occured while getting file from the bucket : ${exception}`);
		}
	}

	/**
	 * Copies file from source to destination 
	 * @param {String} destinationLocation Destination Bucket name
	 * @param {String} sourceLocation Source Bucket name
	 * @param {String} fileKey File Path
	 */
	async copyFile(destinationLocation, sourceLocation, fileKey, versionId, extraParams) {
		try {
			//logger.info('started copying file using tvx-cloud-storage');
			let params = {
				Bucket: destinationLocation,
				CopySource: sourceLocation + (versionId ? `?versionId=${versionId}` : ''),
				Key: fileKey,
				...extraParams
			};
			logger.debug(`Params used for copy file data ${JSON.stringify(params)}`);
			return await s3.copyObject(params);

		} catch (exception) {
			logger.error(exception);
			throw exception;
		}
	}

	/**
	 * Deletes file from source S3 Bucket 
	 * @param {String} deleteLocaiton  Bucket name
	 * @param {String} fileKey File Path 
	 */
	async deleteFile(deleteLocaiton, fileKey, extraParams) {
		try {
			let params = {
				Bucket: deleteLocaiton,
				Key: fileKey,
				...extraParams
			};
			//logger.info('Deleting file from bucket');
			logger.debug(`Deleting object using Params: ${JSON.stringify(params)}`);
			return await s3.deleteObject(params);

		} catch (exception) {
			logger.error(`Error while deleting object : ${exception}`);
			throw new Error(`Error occured while deleting file from original location: ${exception}`);
		}
	}

	

	/**
	 * Gets the file 
	 * @param {*} requestBo 
	 * @param {*} filename 
	 */
	async getFile(requestBo, filename, extraParams) {
		try {
			let params = {
				Bucket: requestBo.bucket,
				Key: filename,
				...extraParams
			};
			logger.debug(`Params used for get file data ${JSON.stringify(params)}`);
			let stream = await s3.getObject(params);
			return stream.Body.toString();
		} catch (err) {
			logger.error(`Error while getting content ${JSON.stringify(err.message)}`);
			throw err;
		}
	}


	/**
	 * 
	 * @param {*} body 
	 * @param {*} bucket 
	 * @param {*} fileName 
	 */
	async writeFile(body, bucket, fileName, metaData = null) {
		try {

			let params = {
				Body: body,
				Bucket: bucket,
				Key: fileName,
			};

			if (metaData) {
				params.Metadata = metaData;
			}

			return await s3.putObject(params).promise();

		} catch (exception) {
			logger.error(`Error while writing object : ${exception}`);
			throw new Error(`Error occured while deleting file from original location: ${exception}`);
		}
	}

	async selectObjectContent(bucket, key, expressionCondition, inputSerialization, outputSerialization) {
		try {
			const selectObjectContentParams = {
				Bucket: bucket,
				Key: key,
				ExpressionType: 'SQL',
				Expression: `${expressionCondition}`,
				InputSerialization: inputSerialization,
				OutputSerialization: outputSerialization
			};

			let buffer = await s3.selectObjectContent(selectObjectContentParams);
			let records = await this.getEventData(buffer.Payload);
			return records;
		} catch (ex) {
			logger.error(ex);
			throw ex;
		}
	}

	async getEventData(payLoad) {
		return new Promise((resolve, reject) => {
			let records = [];
			payLoad.on('data', (event) => {
				if (event.Records) {
					records.push(event.Records.Payload.toString());
				}
			});
			payLoad.on('end', () => {
				resolve(records);
			});
			payLoad.on('error', (err) => {
				reject(err);
			});
		});
	}


	/**
 * Retriving the object from the S3 bucket.
 * @param {string} bucketName 
 * @param {string} fileName 
 */
	async getObjectData(bucketName, fileName) {
		try {
			let startTime = new Date();
			let params = {
				Bucket: bucketName,
				Key: fileName
			};
			logger.debug(`getobject parameters :  ${JSON.stringify(params)}`);
			const data = await s3.getObject(params).promise();
			logger.debug(`getobject exceution time in ms :  ${new Date() - startTime}`);
			return data.Body;

		} catch (err) {
			logger.error(`Exception occurred for getting object from the bucket ${err}`);
			throw err;
		}
	}

	async listObjects(bucket, prefix) {
		try {
			logger.debug("Start of Listing Files ")
			let params = {
				Bucket: bucket,
				Prefix: prefix
			}
			let result = await s3.listObjects(params).promise();
			console.log("aa agaya After Results ")
			logger.debug("After Listing files  ")
			if (result) {
				logger.debug("Files Listed ="+JSON.stringify(result))
				result.Contents = result.Contents.filter((data) => data.Key[data.Key.length - 1] !== '/');
			}
			
			return result;
		} catch (error) {
			console.log(error)
			logger.error(`Error while listing objects : ${error}`);
			throw error
		}
	}

	/**
	 * Return the hash value of the content
	 * @param {*} content String | Buffer
	 */
	async getObjectHash(content) {
		try {
			return objectHash(content);
		} catch (ex) {
			throw ex;
		}
	}

	/**
	 * 
	 * @param {*} bucketName 
	 * @param {*} fileName 
	 * @param {*} start 
	 * @param {*} end 
	 * @description Return the Stream data in bytes 
	 */
	async getStreamedDataByLength(bucketName, fileName, start, end) {
		try {
			let params = {
				Bucket: bucketName,
				Key: fileName,
				Range: `bytes=${start}-${end}`
			};
			logger.debug(`getobject parameters :  ${JSON.stringify(params)}`);
			var data = await s3.getObject(params).createReadStream();
			return data;
		} catch (err) {
			logger.error(`Exception occurred for getting object from the bucket ${err}`);
			throw err;
		}
	}

	/**
	 * Retriving the file object from the S3 bucket without streaming and buffering the data.
	 * @param {string} bucketName 
	 * @param {string} fileName 
	 */
	async getInputFileData(bucketName, fileName) {
		try {

			let params = {
				Bucket: bucketName,
				Key: fileName
			};
			logger.debug(`Params ${JSON.stringify(params)}`);
			const data = await s3.getObject(params).promise();

			// logger.debug(`getInputFileData ${data.Body.toString()}`);
			return data.Body.toString('utf-8');

		} catch (err) {
			logger.error(`Exception occurred for getting object from the bucket ${err}`);
			throw err;
			//util.genericException(err, ExceptionType.ERROR_WHILE_READING_FILE, ExceptionCategory.CLOUD_STORAGE_ERROR, err.message);

		}
	}
}

module.exports = new S3Dao();