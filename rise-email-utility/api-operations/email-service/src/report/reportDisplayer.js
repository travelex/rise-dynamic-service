"use strict";

const fs = require('fs');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const child_process = require('child_process');
let scalingFactor = process.env.SCALING_FACTOR || 1;


// ----------------------------------------------------------------------------------------------
// TODO: Need to populate this with Application paths for other popular PDF readers

module.exports = function (err, reportName, testing) {
    if (err) {
        console.error("Your report", reportName, "had errors", err);
        return false;
    }
    let found = false;

    // Add the current working directory to the file so PDF Reader can find it
    let reportNameDir;
    reportNameDir = reportName;
    reportName = reportName.substring(reportName.lastIndexOf("/") + 1);
    console.log(`else reportNameDir ${reportNameDir}`)
    console.log(`reportName ${reportName}`)

    const reportNoExt = reportName.replace(".pdf", "");
    console.log(`reportNoExt: ${reportNoExt}`)
    if (!found) {
        console.log("Your report has been rendered to", reportName);
    }


};