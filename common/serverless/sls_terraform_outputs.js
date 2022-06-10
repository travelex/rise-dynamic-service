const fs = require('fs');

module.exports = serverless => {
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
  
  contents = fs.readFileSync(__dirname + '/../../terraform/applications/terraform_outputs.json');
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
