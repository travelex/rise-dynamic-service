const apiProcessor = require('../../src/api/FileSuccessHandlerApiProcessor');
const assert = require('assert');
const testData = require('../testData');
// eslint-disable-next-line no-undef
jest.mock('../../src/dal/DBHelper');
jest.mock('../../src/dal/FileSuccessDao');

// eslint-disable-next-line no-undef
describe('FileSuccessHandlerApiProcessor => process method', () => {

    // eslint-disable-next-line no-undef
    it('Success Flow when status has been update in dynamodb table', async () => {
        let output = await new apiProcessor().process(testData.event, null);
        expect(output).toEqual({ success: true })
        // assert.strictEqual(output,{ success: true });
    });

    it('process method should return exception for invalid interfaceType', async () => {
        try {
            await new apiProcessor().process(testData.invalidEvent, '');
        } catch (ex) {
            console.log('error :', ex);
        }
    });

    // it('Success Flow when message exists in the table', async () => {
    //     let output = await apiProcessor.process(testData.messageExists, null);
    //     assert.strictEqual(output, undefined);
    // });

    // it('should return error when message exists in the table ', async () => {
    //     try {
    //         process.env["ALLOWED_BATCHING_EVENT_PATTERNS"] = "transform-post";
    //         let output = await apiProcessor.process(testData.messageExist, null);
    //     } catch (err) {
    //         assert.strictEqual(err.message, "Cannot create property 'message' on string 'error'");
    //     }
    // });


});