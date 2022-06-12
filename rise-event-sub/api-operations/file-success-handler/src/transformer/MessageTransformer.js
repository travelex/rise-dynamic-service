const MessageBo = require('../model/MessageBo');
const utils = require('../utils/Utils')
const logger = require('winston-wrapper').getLogger('MessageTransformer');
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
const TableDomainName = require('../model/TableDomainName');
class MessageTransformer {
    static async transformToBo(messageDto) {
        try {
            
            logger.debug(messageDto.messageDetails)
            logger.debug("Type Of "+typeof(messageDto.messageDetails))
            let queueData = utils.parseElement(messageDto.messageDetails)
            logger.debug("Type Of "+typeof(queueData))
            logger.debug(queueData)
            let expexted = {
                correlation_id: queueData.correlation_id,
                entity: queueData.entity,
                operation: queueData.operation,
                date_time_iso: queueData.date_time_iso,
                data: {
                    menter_email_id: queueData.data.menter_email_id,
                    mentee_email_id: queueData.data.mentee_email_id,
                    status: queueData.data.status,
                }
            }
          
            return new MessageBo(expexted);

        } catch (error) {
            logger.error(`Exception occurred while Transforming event Object, ${error.toString()}`);
            throw utils.genericException(error, ExceptionType.INVALID_INPUT_REQUEST, ExceptionCategory.INPUT_REQUEST_ERROR, error.message);
        }
    }

    static getOriginDomain(messageAttribute) {
        let originDomain;
        let header = messageAttribute.options.Value[0].header;
        let batchArr = (header.params && header.params[0] && header.params[0].batch) ? header.params[0].batch : null;
        let originDomainObj = batchArr ? batchArr.find(element => element.name.toLowerCase() == 'domain') : null;
        if (header.originDomain) {
            originDomain = header.originDomain;
        } else if (originDomainObj) {
            originDomain = originDomainObj.value;
        } else if (messageAttribute.originDomain && messageAttribute.originDomain.Value) {
            originDomain = messageAttribute.originDomain.Value
        } else if (messageAttribute.options.Value[0].originDomain) {
            originDomain = messageAttribute.options.Value[0].originDomain;
        } else {
            originDomain = null
        }
        return originDomain;
    }


    /*
     * @description returns event detail fields like fileName, countrycode etc..
     */
    static getEventEventDetails(messagefilter, originDomain, trackingId) {
        try {
            let sortKey, country, jobName, interfaceName, domainName, partitionkey, fileName;
            const header = messagefilter.options.Value[0].header;
            const config = messagefilter.options.Value[0].header.config;
            const source = messagefilter.options.Value[0].header.source;
            const params = header ? header.params : null;
            if (params) {
                for (const data of params) {
                    if (data.eventsequencer && data.eventsequencer.eventPayload) {
                        const metadata = JSON.parse(data.eventsequencer.eventPayload)
                        const trackingid = metadata.metadata && metadata.metadata.trackingid ? metadata.metadata.trackingid : null;
                        sortKey = `trackingId#${trackingid.split('#')[0]}`;
                        country = metadata.metadata.country;
                        jobName = metadata.metadata.jobname;
                        interfaceName = metadata.metadata.interfacename;
                        domainName = metadata.metadata.domain;
                        partitionkey = `${interfaceName}#${jobName}` + (country ? `#${country}` : '');
                        fileName = metadata.metadata.filename;
                        return { partitionkey, sortKey, country, fileName, jobName, interfaceName, domainName }
                    }
                }
            }

            sortKey = `trackingId#${trackingId ? trackingId : source.trackingId}`;
            country = (config && config.country) ? config.country : '';
            jobName = messagefilter.jobName.Value;
            interfaceName = messagefilter.interfaceName.Value;
            domainName = TableDomainName[originDomain.trim()];
            partitionkey = `${interfaceName}#${jobName}` + (country ? `#${country}` : '');
            fileName = messagefilter.inputFileName.Value;
            return { partitionkey, sortKey, country, fileName, jobName, interfaceName, domainName };
        } catch (ex) {
            throw ex;
        }
    }
}

module.exports = MessageTransformer;
