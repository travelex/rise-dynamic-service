'use strict';

const he = require('he');
const xmljs = require('xml-js');
const parser = require('fast-xml-parser');
const GenericException = require('generic-exception').GenericException;

const xmlOptions = {
    compact: false, spaces: 2
};

const jsonOptions = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
    tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"]
}

class Utils {
    static genericException(exception, exceptionType, exceptionCategory, ...substitutionArgs) {
        if (!(exception.message)) {
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
            return exception;
        }
    }

    /**
     * Converts Request JSON to XMl
     * @param {XML} xmlInput 
     * @description Converts screening XML to json
     */
    static convertToJson(xmlData) {
        try {
            // if (parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
            //     var jsonObj = parser.parse(xmlData, jsonOptions);
            // }
            
            // Intermediate obj
            var tObj = parser.getTraversalObj(xmlData, jsonOptions);
            var jsonObj = parser.convertToJson(tObj, jsonOptions);
            return jsonObj;
        } catch (ex) {
            console.log(ex);
        }
    }

    /**
     *
     * @param {*} seconds
     */
    static async sleep(seconds) {
        let milliseconds = seconds * 1000;
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    /**
     * @desc parse the string into json object
     * @param element
     * @returns {any}
     */
    static parseElement(element) {
        try {
            return JSON.parse(element);
        } catch (err) {
            return element;
        }
    }

    /**
     * @description this function is used to create deep copy of an object
     * @param inObject
     * @returns {*[]|*}
     */
    static deepCopy(inObject) {
        let outObject, value, key;

        if (typeof inObject !== 'object' || inObject === null) {
            return inObject; // Return the value if inObject is not an object
        }

        // Create an array or object to hold the values
        outObject = Array.isArray(inObject) ? [] : {};

        for (key in inObject) {
            value = inObject[key];

            // Recursively (deep) copy for nested objects, including arrays
            outObject[key] = this.deepCopy(value);
        }
        return outObject;
    }

    /**
     * Converts Request XMl to JSON
     * @param {XML} xmlInput 
     * @description Converts screening XML to json
     */
    /** static requestXmlInputToJsonSync(xmlInput) {
        //try {
                let xparser  = new parser.XMLParser();
                let jObj = JSON.stringify(xparser.parse(xmlInput));
                
                jObj = jObj.replace(/\\/g, '');
                return jObj;
        //} catch (error) {
        //    throw error;
        //}
    }**/

   /**
     * Converts to XML
     * @param {XML} xmlInput 
     * @description Converts screening XML to json
     */
    static convertToXml(jsonData) {
        try {
            return xmljs.json2xml(jsonData, xmlOptions);
        } catch (ex) {
            console.log(ex);
            throw ex;
        }
    }

    /**
     * Converts to XML
     * @param {XML} xmlInput 
     * @description Converts screening XML to json
     */
     static convertXmlToJSON(jsonData) {
        try {
            return xmljs.xml2json(jsonData, {compact: false, spaces: 4});
        } catch (ex) {
            console.log(ex);
            throw ex;
        }
    }
}

module.exports = Utils;