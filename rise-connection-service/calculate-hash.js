const {hashElement} = require('folder-hash');
const {S3Client, GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3");
const readYamlFile = require('read-yaml-file')
const color = require("cli-color");
const fs = require("fs");
const path = require("path");
const DEPLOYMENT_BUCKET = `tvx-risk-compliance-${process.env['APP_ENVIRONMENT']}-application-config`
const shell = require('shelljs')
const options = {
    algo: 'sha256',
    folders: {exclude: ['.*', 'node_modules', 'test_coverage', '.serverless', '__test__', 'api-test', 'feature', '__mocks__', 'mockData','test','.vscode']},
    files: {
        include: ['*.js', '*.json', '*.yml', '*.yaml'],
        exclude: ['package-lock.json', 'calculate-hash.js', 'README.md', 'test.js', 'hash.json', '.eslintrc.json']
    },
};

const error = color.red.bold;
const log = color.yellow;
const notice = color.green.bold;
const important = color.magenta;

String.prototype.replaceAllVariable = function replaceAll(search, replace) {
    return this.split(search).join(replace);
}

async function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
}

async function readObject(client, input) {
    const command = new GetObjectCommand(input);
    try {
        const {Body} = await client.send(command);
        return await streamToString(Body);
    } catch (err) {
        let message = `error occurred fetching the ${input.Key} from ${input.Bucket} bucket with error :: ${err}`;
        console.log(error(message))
        if (err.Code === "NoSuchKey")
            return undefined;
        else throw new Error(message)
    }
}

async function putObject(client, input) {
    const command = new PutObjectCommand(input);
    try {
        return await client.send(command);
    } catch (err) {
        let message = `error uploading the ${input.Key} to ${input.Bucket} bucket with error :: ${err}`;
        console.log(error(message))
    }
}

async function readYaml(file) {
    return await new Promise((resolve, reject) => {
        readYamlFile(file).then(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        })
    })
}

async function findHashes(element, options) {
    try {
        return await hashElement(element, options);
    } catch (err) {
        console.error(error('hashing failed:', err));
        return undefined;
    }
}

async function writeJsonData(fileName, data) {
    return await new Promise((resolve, reject) => {
        fs.writeFile(fileName, JSON.stringify(data),
            function (err) {
                if (err) reject(err);
                resolve(`Data is written to ${fileName} file successfully.`)
            });
    })
}

function parseElement(element) {
    try {
        return JSON.parse(element);
    } catch (err) {
        return element;
    }
}

async function calculateHashAndSave() {
    console.log(log(`1. Creating a hash over the current folder: ${__dirname}`));
    const response = await findHashes('.', options);
    let returnVal = 1;
    if (response) {
        let fileName = path.join(__dirname, "hash.json");
        console.log(log(`2. Writing hashes of current folder into ${fileName} file`));
        await writeJsonData(fileName, response)
        const result = await findHashes(fileName, options)
        console.log(log(`3. Calculated hash of all folder and files = ${result.hash}`))

        //fetching the service name from serverless file
        const serverlessYamlData = await readYaml(path.join(__dirname, "serverless", "serverless.yml"))
        const client = new S3Client({region: "eu-west-1"});

        // put event if hashes are not same
        const putObjectInput = {
            Bucket: DEPLOYMENT_BUCKET,
            Key: `hashes/${serverlessYamlData.service}.json`,
            Body: JSON.stringify({codeSha256: result.hash}),
            ContentType: "application/json"
        }

        const getObjectInput = {
            Bucket: DEPLOYMENT_BUCKET,
            Key: `hashes/${serverlessYamlData.service}.json`
        }

        const hashFile = await readObject(client, getObjectInput)
        if (hashFile) {
            const existing_hash = parseElement(hashFile)
            console.log(log(`4. existing hash fetched from s3 :: ${JSON.stringify(existing_hash)}`));
            if (existing_hash.codeSha256 === result.hash) {
                console.log(important('5. Hash matched.'))
                returnVal = 0;
            } else {
                console.log(important('5. Hash not matched. Updating the hash.'))
                const putObjectResponse = await putObject(client, putObjectInput);
                if (putObjectResponse['$metadata'].httpStatusCode === 200) {
                    console.log(log(`6. uploaded updated hash with key = ${putObjectInput.Key} in bucket = ${putObjectInput.Bucket}`))
                }
            }
        } else {
            console.log(log('4. File not found. Inserting the file containing hash.'))
            const putObjectResponse = await putObject(client, putObjectInput);
            if (putObjectResponse['$metadata'].httpStatusCode === 200) {
                console.log(log(`5. uploaded the ${putObjectInput.Key} to ${putObjectInput.Bucket} bucket`))
            }
        }
    }
    shell.exec(`echo "export TRIGGER_BUILD=${returnVal === 1}" >> .extra_env`)
}

(async () => {
    const env = `${process.env['APP_ENVIRONMENT']}`;
    console.log(notice(`********************************      CUSTOM HASH EVALUATION STARTED       *************************************`))
    const result = await calculateHashAndSave();
    console.log(notice(`********************************      CUSTOM HASH EVALUATION FINISHED    ***************************************`))
})()