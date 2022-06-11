class MessageDto {

    constructor(topicArn, messageDetails, messageAttributes) {
        this.topicArn = topicArn;
        this.messageDetails = messageDetails;
        this.messageAttributes = messageAttributes;
    }

    toJson(){
        return {
            'topicArn' : this.topicArn,
            'messageDetails': this.messageDetails,
            'messageAttributes': this.messageAttributes
        }
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

module.exports = MessageDto;