const winstonWrapper = require('winston-wrapper');
const logger = winstonWrapper.getLogger('CloudeSearchService');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });
const CloudSearchUtility = require('../utils/CloudSearchUtility')

const cloudSearchDomain = new AWS.CloudSearchDomain({
    endpoint: 'doc-userprofile-tktgdgxjn6xs7sbtsxjiic3the.eu-west-1.cloudsearch.amazonaws.com',
    apiVersion: '2013-01-01'
});


class CloudeSearchService {

    static async updateDocument(itemDetail) {
        const updatedProfile = CloudSearchUtility.getProfileFromDynamoEvent(itemDetail.NewImage);
        const oldProfile = CloudSearchUtility.getProfileFromDynamoEvent(itemDetail.OldImage);
        // determine update is required or not 
        if (JSON.stringify(updatedProfile) === JSON.stringify(oldProfile)) {
            logger.info('Document update is not required. As both old and new cloud search specific fields are not modified.');
            return { status: 'update not required' }
        }
        // delete existing document
        await CloudeSearchService.removeDocument(updatedProfile.email_id);

        // add new document
        await CloudeSearchService.addDocument(updatedProfile);

        return { status: 'updated' }
    }



    static async addDocument(updatedProfile) {

        try {
            const params = {
                contentType: 'application/json',
                documents: JSON.stringify(
                    [
                        {
                            type: 'add',
                            id: updatedProfile.email_id,
                            fields: updatedProfile
                        },
                    ]
                )
            };
            const addResponse = await cloudSearchDomain.uploadDocuments(params).promise();
            logger.info(`addResponse: ${JSON.stringify(addResponse)}`);
            return { status: 'added' }
        } catch (error) {
            logger.error('Error occurred while adding document to cloud search. DocumentId :- ' + documentId);
            throw error;
        }
    }

    static async removeDocument(documentId) {
        try {
            const params = {
                contentType: 'application/json',
                documents: JSON.stringify(
                    [
                        {
                            type: 'delete',
                            id: documentId,
                        },
                    ]
                )
            };
            const deleteResponse = await cloudSearchDomain.uploadDocuments(params).promise();
            logger.info(`deleteResponse: ${JSON.stringify(deleteResponse)}`);
            return { status: 'deleted' }
        } catch (error) {
            logger.error('Error occurred while deleting document from cloud search. DocumentId :- ' + documentId);
            throw error;
        }
    }

}

module.exports = CloudeSearchService;