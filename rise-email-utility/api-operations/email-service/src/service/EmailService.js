const nodemailer = require('nodemailer')
const path = require('path');
const logger = require('winston-wrapper').getLogger(path.basename(__filename));
const agreement = require('../report/agreement')
const SecretManagerClient = require('../dao/SecretManagerClient');
const sftpUserName = process.env.SFTP_USER_NAME;
const sftpUserPassword = process.env.SFTP_PASSWORD;

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
                to: `${message.data.mentor_email_id}, ${message.data.mentee_email_id}`,  //"bharat.kendre@travelex.com, prabhat.kumar@travelex.com", // list of receivers
                subject: "LeadX Mentorship Agreement", // Subject line
                html: `<p>Hi ${params.mentor.split(' ')[0]}/${params.mentee.split(' ')[0]},</p><p>Please find attached LeadX Mentor Mentee agreement document.</p><p><b>Team LeadX.<b></p>`, // html body,
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

        const ssmValues =  await SecretManagerClient.getSecretFromProvider([sftpUserName, sftpUserPassword])
        const transporter = nodemailer.createTransport({
            host: process.env.SFTP_HOST,
            port: Number(process.env.SFTP_PORT) ?? 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: ssmValues[sftpUserName], 
                pass: ssmValues[sftpUserPassword],
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