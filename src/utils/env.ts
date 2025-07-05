import 'dotenv/config';

export const DATABASE_URL: string = process.env.DATABASE_URL || '';
export const PASSWORD_SECRET: string = process.env.PASSWORD_SECRET || '';
export const SECRET_KEY: string = process.env.SECRET_KEY || '';
export const EMAIL_SMTP_SECURE: boolean = Boolean(process.env.EMAIL_SMTP_SECURE) || false; // convert to boolean
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || '';
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || '';
export const EMAIL_SMTP_PORT: number = Number(process.env.EMAIL_SMTP_PORT) || 465; // convert to number
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || '';
export const EMAIL_SMTP_SERVICE_NAME: string = process.env.EMAIL_SMTP_SERVICE_NAME || 'Zoho';

export const CLIENT_HOST: string = process.env.CLIENT_HOST || 'http://localhost:3001';
