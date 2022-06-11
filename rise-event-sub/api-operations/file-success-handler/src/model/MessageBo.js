class MessageBo {
    constructor(topicArn, messageDetails, messagefilter, trackingId, originDomain, eventDetail) {
        this.topicArn = topicArn;
        this.workflowInfo = messageDetails;
        this.status = messagefilter.status.Value;
        this.correlationId = messagefilter.correlationId.Value;
        this.originDomain = originDomain;
        this.header = messagefilter.options.Value[0].header;
        this.config = messagefilter.options.Value[0].header.config;
        this.source = messagefilter.options.Value[0].header.source;
        this.param = messagefilter.options.Value[0].header.params;
        this.objectHash = this.config.objectHash;
        this.bucketName = this.config.bucketName;
        this.interfaceType = this.source.interfaceType;
        this.trackingId = trackingId ? trackingId : this.source.trackingId;
        this.multiObject = (messagefilter.multiObject && messagefilter.multiObject.Value) ? messagefilter.multiObject.Value : null;
        this.monitor = this.config.monitor;
        this.country = eventDetail.country;
        this.partitionkey = eventDetail.partitionkey;
        this.sortKey = eventDetail.sortKey;
        this.jobName = eventDetail.jobName;
        this.interfaceName = eventDetail.interfaceName;
        this.fileName = eventDetail.fileName
        this.domainName = eventDetail.domainName;
        this.error = []
    }

    toJson() {
        return {
            'topicArn': this.topicArn,
            'config': this.config,
            'source': this.source,
            'status': this.status,
            'correlationId': this.correlationId,
            'originDomain': this.originDomain,
            'jobName': this.jobName,
            'interfaceName': this.interfaceName,
            'fileName': this.fileName,
            'trackingId': this.trackingId,
            'objectHash': this.objectHash,
            'interfacetype': this.interfaceType,
            'multiObject': this.multiObject,
            'monitor': this.monitor,
            'param': this.param
        }
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

}

module.exports = MessageBo;