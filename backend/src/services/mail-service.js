import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MailService {
    transport;

    constructor() {
        try {
            let config = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                service: process.env.SMTP_SERVICE,
                auth: {
                    user: process.env.SMTP_MAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            };

            this.transport = nodemailer.createTransport(config);
        } catch (exception) {
            console.log("Error connecting to MailService");
        }
    }

    sendEmail = async (to, sub, message, attachments = null) => {
        try {
            const ack = await this.transport.sendMail({
                to: to,
                from: process.env.SMTP_FROM,
                subject: sub,
                html: message,
            });

            return ack;
        } catch (exception) {
            console.log("Error sending mail ", exception);
            throw exception;
        }
    };
}

export const mailSvc = new MailService();
