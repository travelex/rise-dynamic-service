class MessageBo {
    constructor(topicArn, data, messageAttributes) {
        this.topicArn = topicArn;
        this.data = data,
        this.messageAttributes = messageAttributes
        this.entity = this.data.entity
        this.operation = this.data.operation

    }

    toJson() {
        return {
            'topicArn': this.topicArn,
            "data" : this.data,
            "messageAttributes": this.messageAttributes
        }
    }

    getRulePathsForOperation(){
        return "stats/"+this.entity+"-"+this.operation+"/"
    }
    toString() {
        return JSON.stringify(this.toJson());
    }

}

module.exports = MessageBo;