const AWS = require('aws-sdk');
const nodemailer = require('nodemailer')
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const agreement = require('../report/agreement')
const fs = require('fs');

class EmailService {

    static async sendEmail(event, message) {

        try {
            logger.debug('sending email to mentor and mentee')
            logger.debug(`message Data : ${JSON.stringify(message)}`);
            let params = {
                "mentor": EmailService.getFullName(message.data.mentor_email_id),
                "mentee": EmailService.getFullName(message.data.mentee_email_id),
                "date_time": message.date_time_iso.split('T')[0]
            }

            agreement.repo(params)

            const transporter = await EmailService.getTransport();

            const info = await transporter.sendMail({
                from: 'Middleware-nonprod@travelex.com', // sender address
                to: "bharat.kendre@travelex.com, prabhat.kumar@travelex.com", // list of receivers
                subject: "LeadX Mentorship Agreement", // Subject line
                html: `<p>Hi ${params.mentor.split(' ')[0]}/${params.mentee.split(' ')[0]},</p><p>Please find attached LeadX Mentor Mentee agreement.</p><p><b>LeadX Team.<b></p>`, // html body,
                attachments: [
                    {
                        filename: 'mentor_mentee_agreement.pdf',
                        path: '/tmp/agreement.pdf',
                    }
                ]
            });
            logger.debug("Message sent: %s", info.messageId);
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
                user: 'Middleware-nonprod@travelex.com', 
                pass: 'KFJcq3bQ2:3#S+Jk_{}~p]}#$',
            },
        });

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