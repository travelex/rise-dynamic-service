'use strict';
let ExceptionType = {
    // Example:
    'MISSING_CUSTOMER_FIRSTNAME': 'missingCustomerFirstName',
    'MISSING_CUSTOMER_EMAIL': 'missingCustomerEmail',
    'CUSTOMER_ALREADY_EXIST': 'customerAlreadyExist',
    'INVALID_EMAIL': 'invalidEmail',
    'ERROR_SAVING_CUSTOMER': 'errorSavingCustomer',
    'CUSTOMER_NOT_FOUND': 'customerNotFound',
    'UNKNOWN_ERROR': 'unknownError',
    'UNHANDLED_EXCEPTION': 'unhandledException',
    'PROCESSING_ERROR': 'processingError',
    'ERROR_CALLING_SERVICE_ENDPOINT': 'errorCallingServiceEndpoint',
    'ERROR_DELETING_MESSAGE': 'errorDeletingMessage',
    'INVALID_INPUT_REQUEST': 'invalidInputRequest'
};

module.exports = ExceptionType;