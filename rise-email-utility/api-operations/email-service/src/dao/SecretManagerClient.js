const aws = require('aws-sdk');
aws.config.update({ region: 'eu-west-1' });
const ssm = new aws.SSM();
const logger = require('winston-wrapper').getLogger('SecretManagerClient');

class SecretManagerClient {

    // ssmKeys is list of key names
    static async getSecretFromProvider(ssmKeys) {
        logger.debug('SSM Keys : ' + JSON.stringify(ssmKeys));
        const response = await ssm.getParameters({
            Names: ssmKeys,
            WithDecryption: true
        }).promise();
        
        logger.debug('response : ' + JSON.stringify(response));
        const ssmValues = {};
        response.Parameters.forEach(item => ssmValues[item.Name] = item.Value);
        logger.debug('ssmValues : ' + JSON.stringify(ssmValues));
        return ssmValues;
    }
}

module.exports = SecretManagerClient;