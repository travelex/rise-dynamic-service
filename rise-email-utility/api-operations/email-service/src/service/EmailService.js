const AWS = require('aws-sdk');
const nodemailer = require('nodemailer')
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const agreement = require('../report/agreement')
const fs = require('fs');

class EmailService {

    static async sendEmail(event) {
        
        try {
            console.log('sending email to mentor and mentee')
            let params = {

                "mentor": `amar@travelex.com`,
            
                "mentee": `juned@travelex.com`
            
            }
            agreement.repo(params)

            fs.writeFileSync('/tmp/test.txt', 'Test DATA')
            fs.readdirSync('/tmp').forEach(file => {
                console.log(`file names  : ${file}`);
              });
              
            const transporter =await EmailService.getTransport();
            const info = await transporter.sendMail({

                from: 'Middleware-nonprod@travelex.com', // sender address
                to: "bharat.kendre@travelex.com", // list of receivers
                subject: "Test Email for Mentorship App", // Subject line
                text: "Hello world", // plain text body
                html: "<b>Hello world</b>", // html body,
                attachments: [
                    {
                        filename: 'agreement.pdf',
                        path: '/tmp/agreement.pdf',
                    }
            ]
            });
            logger.debug("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return
        } catch (err) {
            logger.error(`Error occurred while sending email :: ${err}`);
            throw err;
        }
    }

    static async getTransport() {

        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'Middleware-nonprod@travelex.com', // generated ethereal user
                pass: 'KFJcq3bQ2:3#S+Jk_{}~p]}#$', // generated ethereal password
            },
        });

        // const testAccount = await nodemailer.createTestAccount();

        // // create reusable transporter object using the default SMTP transport
        // const transporter = nodemailer.createTransport({
        //     host: "smtp.ethereal.email",
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: testAccount.user, // generated ethereal user
        //         pass: testAccount.pass, // generated ethereal password
        //     },
        // });

        return transporter
    }

}

module.exports = EmailService