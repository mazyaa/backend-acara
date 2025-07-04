import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

import {
    EMAIL_SMTP_SECURE,
    EMAIL_SMTP_PASS,
    EMAIL_SMTP_USER,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_HOST,
} from '../env';

const transporter = nodemailer.createTransport({
    host: EMAIL_SMTP_HOST,
    port: EMAIL_SMTP_PORT,
    secure: EMAIL_SMTP_SECURE,
    auth: {
        user: EMAIL_SMTP_USER,
        pass: EMAIL_SMTP_PASS,
    },
    requireTLS: true,
})

export interface ISendMail {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const sendMail = async ({ ...mailParams }: ISendMail) => {
   try {
     const result = await transporter.sendMail({
        ...mailParams,
    })
    return result;
   } catch (error) {
         console.error('Error sending email:', error);
         throw new Error('Failed to send email');
    }
}

const renderMailHtml = async (template: string, data: any): Promise<string> => {
    const templatePath = await ejs.renderFile(
        path.join(__dirname, `./templates/${template}.ejs`),
        data
    );
    return templatePath as string;
}

export { sendMail, renderMailHtml };