const AWS = require('aws-sdk');
const nodemailer = require('nodemailer')
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const agreement = require('../report/agreement')
const fs = require('fs');

class EmailService {

    static async sendEmail(event, message) {

        try {
            console.log('sending email to mentor and mentee')
            logger.debug(`message Data : ${JSON.stringify(message)}`);
            let params = {
                "mentor": EmailService.getFullName(message.data.mentor_email_id),
                "mentee": EmailService.getFullName(message.data.mentee_email_id)
            }
            agreement.repo(params)
            
            fs.writeFileSync('/tmp/test.txt', 'Test DATA')
            fs.readdirSync('/tmp').forEach(file => {
                console.log(`file names  : ${file}`);
            });

            const transporter = await EmailService.getTransport();
            const info = await transporter.sendMail({

                from: 'Middleware-nonprod@travelex.com', // sender address
                to: "bharat.kendre@travelex.com, prabhat.kumar@travelex.com", // list of receivers
                subject: "LeadX Mentorship Agreement", // Subject line
                text: "Hello world", // plain text body
                html: `<p>Hi ${params.mentor.split(' ')[0]}/${params.mentee.split(' ')[0]},</p><p>Please find attached LeadX Mentor Mentee agreement.</p><p>Thanks</p><p>LeadX.</p>`, // html body,
                attachments: [
                    {
                        filename: 'mentor_mentee_agreement.pdf',
                        path: '/tmp/agreement.pdf',
                    }
                ]
            });
            logger.debug("Message sent: %s", info.messageId);

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

    static getFullName(email) {
        const namePart = email.split('@')[0];
        let [firstName, lastName] = namePart.split('.')
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        return `${firstName} ${lastName}`
    }

}

module.exports = EmailService