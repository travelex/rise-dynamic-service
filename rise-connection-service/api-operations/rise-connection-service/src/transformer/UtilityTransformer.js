'use strict';

let RequestBo = require('../model').UtilityBo;
const Utils = require('../utils/Utils');

class UtilityTransformer {

    /**
     * Transforms RequestDto to RequestBo
     * @param {Object} requestDto RequestDto object
     */
    static async transformToBo(requestDto) {
        let _body = Utils.parseElement(requestDto);
        return new RequestBo(_body);
    }

    static async transformToDto(responseBo) {
        return responseBo;
    }
}

module.exports = UtilityTransformer;