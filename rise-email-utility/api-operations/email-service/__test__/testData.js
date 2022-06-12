let event = {
    Records: [
        {
            messageId: 'e68a3278-3800-4ac0-8e74-806219ca6650',
            receiptHandle: 'AQEBprc9YbmlsnOkdmGScGAErkMHTRTiInmNc2k48wslY/4rOKsFMdHS8RPBaFI9YSw6djO4IVHYtUuXYNFoaAHnLz3QZrXLyC4PRoackVvwi5fTXOjHwd/fVSLYBD/74eEQTObUGKIvX91Tvoy4rKMp/aEFXP8yq27V9xC9OaN8Q/7P1MhuT0HRPT51IAUCHWKeUztXgstJl8ELd8pm1UXP9sUrZs1OSwEchfr0R+3wPuB0oGnbo5zRCUoY2ousImoyCw1SPIT3BY0LbpcClQb/GFdywVFHcNIjNaEWfOVZKlZYpmGqbF9CHeKzdPiwkLEEmhetXzH68CVCUtfxheKLMaq+B7g/SJ54w35ZRCQZodQbDaYos9yCLBTcqQPBNKaax7koXjNv2pdnCcvZ076/uw==',
            body: '{\n' +
                '  "Type" : "Notification",\n' +
                '  "MessageId" : "4b30696f-735b-5eaf-8677-3e88ab963caa",\n' +
                '  "TopicArn" : "arn:aws:sns:eu-west-1:820643439592:duplicatecheck",\n' +
                '  "Message" : "Error Check",\n' +
                '  "Timestamp" : "2020-09-25T11:37:49.777Z",\n' +
                '  "SignatureVersion" : "1",\n' +
                '  "Signature" : "QmhxdUs8dVyUhz6zjyvr2MJfl8yungSm3BRNhUzrXQBnI2u17d30npZEPHCU2YeOvXsVcOzecFp2VMrhLCifRUGRKbZPHnZiOfDh9VsYYKkTjnm5qeldoPe/M3RawcDWWVgokZms/CUiBB/2yAAEQcyxxXScjH+RyTC1YzHltNiFTIuvsQHlajkfzl4U0P0/VXfi1ozThd9sHeRQx5t7T6jTev6yF4wvMeg0lH6pNpB3gQBukQtaICoGEICNqCtI4fiQ0A0Fw4dnbiVaiJWJFFudy0KM1DtRiVjD4b/v4twPv05cc3i1uOLSzL5Ba56ZXI0Sq744zkEiFcqQoZy7Wg==",\n' +
                '  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-a86cb10b4e1f29c941702d737128f7b6.pem",\n' +
                '  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:820643439592:duplicatecheck:ad851810-9bd6-45f6-b3aa-84fda7ff0454",\n' +
                '  "MessageAttributes" : {\n' +
                '    "jobName" : {"Type":"String","Value":"amex-coda"},\n' +
                '    "inputFileName" : {"Type":"String","Value":"file.txt"},\n' +
                '    "originDomain" : {"Type":"String","Value":"coda"},\n' +
                '    "config" : {"Type":"String.Array","Value":"[{\\"bucketName\\":\\"tvx-middleware\\", \\"objectHash\\":\\"123456retgf\\"}]"},\n' +
                '    "source" : {"Type":"String.Array","Value":"[{\\"trackingId\\":\\"0987656789\\", \\"interfaceType\\":\\"batch\\"}]"},\n' +
                '    "correlationId" : {"Type":"String","Value":"1234556"},\n' +
                '    "interfaceName" : {"Type":"String","Value":"amex"},\n' +
                '    "error" : {"Type":"String","Value":"no error"},\n' +
                '    "status" : {"Type":"String","Value":"success"}\n' +
                '  }\n' +
                '}',
            attributes: [Object],
            messageAttributes: {},
            md5OfBody: '76647be15ab63c225005edda5296b62b',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:eu-west-1:820643439592:default-queue',
            awsRegion: 'eu-west-1'
        }
    ]
};

let invalidEvent = {
    Records: [
        {
            messageId: 'e68a3278-3800-4ac0-8e74-806219ca6650',
            receiptHandle: 'AQEBprc9YbmlsnOkdmGScGAErkMHTRTiInmNc2k48wslY/4rOKsFMdHS8RPBaFI9YSw6djO4IVHYtUuXYNFoaAHnLz3QZrXLyC4PRoackVvwi5fTXOjHwd/fVSLYBD/74eEQTObUGKIvX91Tvoy4rKMp/aEFXP8yq27V9xC9OaN8Q/7P1MhuT0HRPT51IAUCHWKeUztXgstJl8ELd8pm1UXP9sUrZs1OSwEchfr0R+3wPuB0oGnbo5zRCUoY2ousImoyCw1SPIT3BY0LbpcClQb/GFdywVFHcNIjNaEWfOVZKlZYpmGqbF9CHeKzdPiwkLEEmhetXzH68CVCUtfxheKLMaq+B7g/SJ54w35ZRCQZodQbDaYos9yCLBTcqQPBNKaax7koXjNv2pdnCcvZ076/uw==',
            body: '{\n' +
                '  "Type" : "Notification",\n' +
                '  "MessageId" : "4b30696f-735b-5eaf-8677-3e88ab963caa",\n' +
                '  "TopicArn" : "arn:aws:sns:eu-west-1:820643439592:duplicatecheck",\n' +
                '  "Message" : "Error Check",\n' +
                '  "Timestamp" : "2020-09-25T11:37:49.777Z",\n' +
                '  "SignatureVersion" : "1",\n' +
                '  "Signature" : "QmhxdUs8dVyUhz6zjyvr2MJfl8yungSm3BRNhUzrXQBnI2u17d30npZEPHCU2YeOvXsVcOzecFp2VMrhLCifRUGRKbZPHnZiOfDh9VsYYKkTjnm5qeldoPe/M3RawcDWWVgokZms/CUiBB/2yAAEQcyxxXScjH+RyTC1YzHltNiFTIuvsQHlajkfzl4U0P0/VXfi1ozThd9sHeRQx5t7T6jTev6yF4wvMeg0lH6pNpB3gQBukQtaICoGEICNqCtI4fiQ0A0Fw4dnbiVaiJWJFFudy0KM1DtRiVjD4b/v4twPv05cc3i1uOLSzL5Ba56ZXI0Sq744zkEiFcqQoZy7Wg==",\n' +
                '  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-a86cb10b4e1f29c941702d737128f7b6.pem",\n' +
                '  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:820643439592:duplicatecheck:ad851810-9bd6-45f6-b3aa-84fda7ff0454",\n' +
                '  "MessageAttributes" : {\n' +
                '    "jobName" : {"Type":"String","Value":"amex-coda"},\n' +
                '    "inputFileName" : {"Type":"String","Value":"file.txt"},\n' +
                '    "originDomain" : {"Type":"String","Value":"coda"},\n' +
                '    "config" : {"Type":"String.Array","Value":"[{\\"bucketName\\":\\"tvx-middleware\\", \\"objectHash\\":\\"123456retgf\\"}]"},\n' +
                '    "source" : {"Type":"String.Array","Value":"[{\\"trackingId\\":\\"0987656789\\", \\"interfaceType\\":\\"realtime\\"}]"},\n' +
                '    "correlationId" : {"Type":"String","Value":"1234556"},\n' +
                '    "interfaceName" : {"Type":"String","Value":"amex"},\n' +
                '    "error" : {"Type":"String","Value":"no error"},\n' +
                '    "status" : {"Type":"String","Value":"success"}\n' +
                '  }\n' +
                '}',
            attributes: [Object],
            messageAttributes: {},
            md5OfBody: '76647be15ab63c225005edda5296b62b',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:eu-west-1:820643439592:default-queue',
            awsRegion: 'eu-west-1'
        }
    ]
};


module.exports = {
    event, invalidEvent
};