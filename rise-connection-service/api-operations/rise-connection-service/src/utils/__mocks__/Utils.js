
class Utils {
    static async getSelectedContent() {
        return 'test';
    }

    static async genericException(exception, exceptionType, exceptionCategory, ...substitutionArgs) {
        return exception.message;
    }

    static async sleep(seconds){
        let milliseconds = seconds * 1000;
        logger.debug(`milliseconds:  ${milliseconds}`);
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    static deepCopy(inObject) {
        let outObject, value, key

        if (typeof inObject !== "object" || inObject === null) {
            return inObject // Return the value if inObject is not an object
        }

        // Create an array or object to hold the values
        outObject = Array.isArray(inObject) ? [] : {}

        for (key in inObject) {
            value = inObject[key]

            // Recursively (deep) copy for nested objects, including arrays
            outObject[key] = this.deepCopy(value)
        }
        return outObject
    }
}

module.exports = Utils;