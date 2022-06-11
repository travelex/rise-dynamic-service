'use strict'

const objectHash = require('object-hash');
const AWs = require('aws-sdk');
let s3 = new AWs.S3();

class FileSuccessDao {
    async getFileData(fileParams) {
        try{
            let data = 11111;
            return data.toString();
        }
        catch(ex){
            throw ex;
        }
    }

    generateObjectHash(fileContent) {
        try {
            return objectHash(fileContent)
        }
        catch(ex) {
            throw ex;
        }
    }
}

module.exports = FileSuccessDao;