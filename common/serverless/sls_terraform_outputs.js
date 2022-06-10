const fs = require('fs');
const path = require('path')
const shelljs = require('shelljs')
const AWS = require('aws-sdk')
module.exports = serverless => {
  let buckets = {
    "dev":"tvx-hackathon-mentorship-dev-app-config",
    "prod":"tvx-hackathon-mentorship-prod-app-config"
  }

  var configuration = {
  };
  // return dummy config for local offline plugin runs
  if (serverless.processedInput['options']['stage'] == 'local') {
    configuration = {
      region: "eu-west-1",
      middleware_bucket_name: "dev-ui-mentorship-tvx-test-cloud"
    }
    return configuration;
  }
  // console.log(fs.readdirSync(path.join(__dirname,"/../../terraform/applications/terraform_outputs.json")))
  //contents = fs.readFileSync('/root/project/terraform/applications/terraform_outputs.json');
  console.log(shelljs.pwd())
  console.log(shelljs.ls("../../"))
  contents = fs.readFileSync(__dirname + '/../../terraform/applications/terraform_outputs.json');
  var parsedTerraform = JSON.parse(contents);
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


  // contents = fs.readFileSync(__dirname + '/../../terraform/applications/terraform_14_outputs.json');
  // parsedTerraform = JSON.parse(contents);
  // Object.keys(parsedTerraform).forEach(key => {
  //   rawValue = parsedTerraform[key].value;
  //   if (parsedTerraform[key].type == 'string' && (rawValue == 'true' || rawValue == 'True')) {
  //     configuration[key] = true
  //   }
  //   else if (parsedTerraform[key].type == 'string' && (rawValue == 'false' || rawValue == 'False')) {
  //     configuration[key] = false
  //   }
  //   else {
  //     configuration[key] = rawValue
  //   }
  // });
  
  return configuration;
};
