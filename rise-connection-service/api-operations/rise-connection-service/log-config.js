let logTypes = require('winston-wrapper/log-type');
module.exports = {
  pattern: '{ "level": "${level}", "filename":"${label}", "timestamp":"${timestamp}", "correlationId":" ${correlationId}", "message": ${message}, "providerRequestId":"${providerRequestId}" }',
  appenders: [
    {
      // Console 
      type: logTypes.Console,
      options: {
        level: process.env.LOG_LEVEL || 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
      }
    }
  ]
};
