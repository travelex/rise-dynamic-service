'use strict';

const GenericException = require('generic-exception').GenericException;

class Utils {

	static genericException(exception, exceptionType, exceptionCategory, ...substitutionArgs) {
		if (!(exception.message)) {
			// console.log('system', exception);
			exception.message = 'System Error';
		}
		if (!(exception instanceof GenericException)) {
			return new GenericException.Builder(exceptionType)
				.withMessage(exception.message)
				.withWrappedException(exception)
				.withExceptionCategory(exceptionCategory)
				.withSubstitutionArgs(substitutionArgs)
				.build();
		} else {
			// console.log('eee', exception);
			return exception;
		}
	}

	static parseElement(object) {
        try {
            return JSON.parse(object);
        } catch (err) {
            return object;
        }
	}

	static async sleep(delay){
		return new Promise(resolve => setTimeout(resolve, delay))
	}
}

module.exports = Utils;