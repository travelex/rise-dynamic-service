const GenericException = require('generic-exception').GenericException;

const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
const utils = require('../utils/Utils');



class BaseResonse {
   
    /**
     * 
     * @param {*} requestBo 
     * @param {*} exceptionType 
     * @param {*} exceptionCategory 
     * @param  {...any} substitutionArguments 
     */
    noticeLog(requestBo, exceptionType, exceptionCategory, ...substitutionArguments) {
        let error = utils.genericException(new Error('Error'), exceptionType, exceptionCategory, ...substitutionArguments);
        requestBo.auditLogger.withError(error.toString())
            .withWorkFlowInfo(error.description || error.message)
            .withCompleted(true)
            .build().generateAuditlog();
    }

    /**
   * 
   * @param {*} requestBo 
   * @param {*} exceptionType 
   * @param {*} exceptionCategory 
   * @param  {...any} substitutionArguments 
   */
    warningLog(requestBo, exceptionType, exceptionCategory, ...substitutionArguments) {
        let error = utils.genericException(new Error('Error'), exceptionType, exceptionCategory, ...substitutionArguments);
        requestBo.auditLogger.withError(error.toString())
            .withWorkFlowInfo(error.description || error.message)
            .build().generateAuditlog('warning');
    }
}

module.exports = BaseResonse;
