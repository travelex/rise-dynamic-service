var logTypes = require('winston-wrapper/log-type');
module.exports = {
	pattern: '{ "level": "${level}", "filename":"${label}", "timestamp":"${timestamp}", "correlationId":"${correlationId}", "message": ${message} }',
	appenders: [
		{
			// Console 
			type: logTypes.Console,
			options: {
				level: process.env.LOG_LEVEL || 'info',
				handleExceptions: true,
				json: false,
				colorize: true,
			}
		}
	]
};
