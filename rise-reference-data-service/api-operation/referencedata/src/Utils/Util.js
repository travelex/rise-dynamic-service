 
const qs = require('qs');
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));

class Util {
    static checkExpiryTime(epochTime) {
        let dateToBeChecked = new Date(epochTime * 1000)
        let current_time = Date.now().valueOf();
        return dateToBeChecked <= current_time;
    }


    static generateUserIdentity(email_id, given_name, name) {
        logger.debug('generating User Name');
        return {
            "email_id": email_id,
            "given_name": given_name,
            "name": name
        }
    }

    static parseParams(data) {
        let paramObj = {};
        for (const record of data) {
            let arrValue;
            try {
                arrValue = JSON.parse(record.Value)
            } catch (err) {
                arrValue = record.Value
            }

            paramObj[record.Name] = arrValue;
        }
        return paramObj;
    }
}

module.exports = Util
