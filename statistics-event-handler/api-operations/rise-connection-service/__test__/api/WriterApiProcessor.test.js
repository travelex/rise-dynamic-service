/* eslint-disable no-undef */
const assert = require('assert');

var apiProcessor = require('../../src/api/WriterApiProcessor');
const testData = require('../testData');

jest.mock('../../src/dal/DataReaderDao');
jest.mock('../../src/dal/SecretManagerClient');
jest.mock('../../src/dal/SoapDBDao');

const context = {
    awsRequestId: 'thisistestRequest'
};
describe('Class dataWriterApi', () => {
    it('process method should return success for valid record', async () => {
        let actual = await apiProcessor.process(testData.validInput, context);
        let expected = {status: 'success'};
        assert.equal(actual, expected.status);
    }, 40000);
    it('process method should return success for valid record', async () => {
        let actual = await apiProcessor.process(testData.validInput2, context);
        let expected = {status: 'success'};
        assert.equal(actual, expected.status);
    }, 40000);

    it('process method should return success for valid record', async () => {
        let actual = await apiProcessor.process(testData.previewEdovizBasic, context);
        let expected = {status: 'success'};
        assert.equal(actual, expected.status);
    }, 40000);
    
    it('process method should return success for valid record', async () => {
        let actual = await apiProcessor.process(testData.getInvoicePdf, context);
        let expected = {status: 'success'};
        assert.equal(actual, expected.status);
    }, 40000);
    
    // it("process method should return success for valid request rule file", async () => {
    //     let actual = await apiProcessor.process(testData.validInputWithRequestRule, context);
    //     let expected = {status: 'success'};
    //     assert.equal(actual, expected.status);
    // }, 40000);

    // it("process method should return success for valid response rule file", async () => {
    //     let actual = await apiProcessor.process(testData.validInputWithResponseRule, context);
    //     let expected = {status: 'success'};
    //     assert.equal(actual, expected.status);
    // }, 40000);

    // it("process should throw error for invalid record", async () => {
    //     try {
    //         await apiProcessor.process(testData.InvalidInput, context);
    //     } catch (err) {
    //         assert.equal("Invalid Request", err.message);
    //     }
    // }, 40000);

});

