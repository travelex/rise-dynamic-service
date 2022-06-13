var Report = require('../lib/fluentReports').Report;
var fs = require('fs');
var displayReport = require('./reportDisplayer');
const path = require('path');
async function repo(params) {
    let mentor = params.mentor;
    let mentee = params.mentee;

    // Cache today's date
    const Current_Date = params.date_time;

    // Interesting Data Structure, but we can still use it...


    const imgLoc = __dirname + "/travelex-image.png";

    const options = {
        image: imgLoc,
    subject1 : 
    `             
    
    Mentoring Agreement `,
    subject:
    `
    We, (Mentor full name) ${mentor}. 
    And (Mentee full name) ${mentee} 
    voluntarily commit to the Global Travelex Mentoring Program (Rise) for the 9-month duration.`
        ,
        data: [{
            dataLine1:
                `
    We will: 
    > Meet at the agreed intervals; 
    > Attend any mentor program sessions and activities held by Travelex; 
    > Have a genuine interest and commitment in the Mentoring Program; 
    > Be objective, honest and supportive; 
    > Act ethically and with dignity and respect towards all participants; 
    > Ensure that all conversations between mentor and mentee are to be kept confidential unless both parties agree otherwise for a specific topic of discussion. 
    > Seek HR advice if we find that disclosure /breaking confidentiality is necessary for ethical reasons 
    > Contribute to discussion and resolution of matters raised in meetings; and 
    > Participate in the Mentoring Program evaluation and review. 
 
    We acknowledge that either person has the right to discontinue mentorship for any reason, 
    and we will follow the Mentoring Program’s closure guidelines as outlined in the Mentoring 
    Program Handbook. 
 
    (Mentor) 
    Signed:  
    Name: ${mentor}
    Date: ${Current_Date}
     
    (Mentee) 
    Signed: 
    Name: ${mentee}
    Date: ${Current_Date}
   `
        }],

    };

    // This is your routine that gets run any time a header needs to be printed.
    const header = function (rpt, data) {

        rpt.image(imgLoc, { width: 200 });
        if (options.subject1) {
            rpt.print(options.subject1,  { fontBold: true});
        }
        if (options.subject) {
            rpt.print(options.subject);
        }

        rpt.band([
            { data: data.dataLine1, width: 7000 }
        ]);


        rpt.newLine();

    };

    // And this is the function that runs anytime a footer needs to get run.
    const footer = function (rpt) {
        rpt.print(['This material is for Travelex internal.'], { fontBold: true, fontSize: 10, y: 740 });
    };

    // Create a new Report Engine
    // pipeStream is predefined in this report to make it display in the browser
    // You don't have to pass in a report name; it will default to "report.pdf"
    const reportName =  path.join('/tmp', `agreement.pdf`)
    const testing = { images: 1, blocks: ["210,330,240,60"] };


    var rpt = new Report(reportName, { font: "Arimo" });
    rpt.registerFont("Arimo", { normal: __dirname + '/Fonts/Arimo-Regular.ttf', bold: __dirname + '/Fonts/Arimo-Bold.ttf', italic: __dirname + '/Fonts/Arimo-Italic.ttf', bolditalic: __dirname + '/Fonts/Arimo-BoldItalic.ttf', boldItalic: __dirname + '/Fonts/Arimo-BoldItalic.ttf' });

    rpt
        .recordCount(1)
        .margins(30)
        //.autoPrint(true)
        .header(header)
        .pageFooter(footer)
        .data(options.data);

    // Debug output is always nice (Optional, to help you see the structure)
    if (typeof process.env.TESTING === "undefined") { rpt.printStructure(); }


    // This does the MAGIC...  :-)
    console.time("Rendered");
    rpt.render(function (err, name) {
        console.timeEnd("Rendered");
        if (name === false) {
            console.log("Report has been cancelled!");
        } else {
            console.log(`Creating buffer`)
            let pdf = displayReport(err, name, testing);
        }
    });
}


module.exports = { repo };

