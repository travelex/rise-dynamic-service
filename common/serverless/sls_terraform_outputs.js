const fs = require('fs');
const path = require('path')

module.exports = serverless => {
  var configuration = {};

  // return dummy config for local offline plugin runs
  if (serverless.processedInput['options']['stage'] == 'local') {
    configuration = {
      middleware_region: "eu-west-1",
      middleware_bucket_name: "tvx-process-excellence-dev"
    }
    return configuration;
  }

  console.log(`Directoy Name`, __dirname)
  let _path = path.join(__dirname, path.sep, 'terraform_outputs.json')
  console.log(_path)
  contents = fs.readFileSync(_path)
  var parsedTerraform = JSON.parse(contents);
  Object.keys(parsedTerraform).forEach(key => {
    rawValue = parsedTerraform[key].value;
    if (parsedTerraform[key].type == 'string' && (rawValue == 'true' || rawValue == 'True')) {
      configuration[key] = true
    }
    else if (parsedTerraform[key].type == 'string' && (rawValue == 'false' || rawValue == 'False')) {
      configuration[key] = false
    }
    else {
      configuration[key] = rawValue
    }
  });
  return configuration;
};