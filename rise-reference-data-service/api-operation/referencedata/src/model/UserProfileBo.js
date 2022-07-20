const Util = require("../../../user-profile-post/src/Utils/Util");

class UserProfileBo {
    constructor(event) {
        this.body = Util.parseElement(event.body)
        this.queryStringParameters = this.getQueryParameters(event)
        this.pathParameters = this.getPathParameters(event)
    }

    getQueryParameters(event) {
        try {
            if (event) {
                return event.queryStringParameters ? event.queryStringParameters : undefined
            }
        } catch (ex) {
            throw ex;
        }
    }

    getPathParameters(event) {
        try {
            if (event) {
                return event.pathParameters ? event.pathParameters : event.path ? event.path.split('/')[event.path.split('/').length - 1] : undefined
            }
        } catch (ex) {
            console.error(ex)
            throw ex;
        }
    }
}

module.exports = UserProfileBo;