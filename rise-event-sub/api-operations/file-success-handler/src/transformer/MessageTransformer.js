const MessageBo = require('../model/MessageBo');
const utils = require('../utils/Utils')
const logger = require('winston-wrapper').getLogger('MessageTransformer');
const ExceptionType = require('../model/ExceptionType');
const ExceptionCategory = require('../model/ExceptionCategory');
const TableDomainName = require('../model/TableDomainName');
class MessageTransformer {
    static async transformToBo(messageDto) {
        try {
            let messageAttribute = utils.parseElement(messageDto.messageAttributes);
            messageAttribute.options.Value = utils.parseElement(messageAttribute.options.Value);
            
            const valueObject = {
                header: {
                    config: null,
                    source: null,
                    param: null,
                }
            }
            if (messageAttribute.options && messageAttribute.options.Value && messageAttribute.options.Value[0] && messageAttribute.options.Value[0].header) {
                messageAttribute.options.Value[0].header.config = (messageAttribute.options.Value[0].header && messageAttribute.options.Value[0].header.config) ? utils.parseElement(messageAttribute.options.Value[0].header.config) : null;
                messageAttribute.options.Value[0].header.source = (messageAttribute.options.Value[0].header && messageAttribute.options.Value[0].header.source) ? utils.parseElement(messageAttribute.options.Value[0].header.source) : null;
                messageAttribute.options.Value[0].header.param = (messageAttribute.options.Value[0].header && messageAttribute.options.Value[0].header.param) ? utils.parseElement(messageAttribute.options.Value[0].header.param) : null;
            } else {
                if (messageAttribute.options && messageAttribute.options.Value && messageAttribute.options.Value[0]) {
                    messageAttribute.options.Value[0] = valueObject
                } else {
                    messageAttribute.options = {
                        Value: [valueObject]
                    }
                }
            }

            let metadata = (messageAttribute.options.Value[0].header.config && messageAttribute.options.Value[0].header.config.metadata) ? messageAttribute.options.Value[0].header.config.metadata : null;
            let trackingId = null;
            if (metadata && metadata.trackingid) {
                trackingId = metadata.trackingid.split('#')[0];
            }

            let originDomain = this.getOriginDomain(messageAttribute);

            const eventDetail = MessageTransformer.getEventEventDetails(messageAttribute, originDomain, trackingId)

            return new MessageBo(messageDto.topicArn, messageDto.messageDetails, messageAttribute, trackingId, originDomain, eventDetail);

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
