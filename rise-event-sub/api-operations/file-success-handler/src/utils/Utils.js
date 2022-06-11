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
	

	/**
	 * @description returns creationTime, updation time and expiration time
	*/
	static getParams() {
		try {
			const creationTime = Math.round(new Date().getTime() / 1000);
			const expirationTime = creationTime + parseInt(process.env.TIME_TO_LEAVE_SECONDS);
			const updationTime = creationTime;
			return { creationTime, expirationTime, updationTime }
		}
		catch (ex) {
			throw ex;
		}
	}
}

module.exports = Utils;