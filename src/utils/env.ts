import 'dotenv/config';

export const DATABASE_URL: string = process.env.DATABASE_URL || '';
export const PASSWORD_SECRET: string = process.env.PASSWORD_SECRET || '';
export const SECRET_KEY: string = process.env.SECRET_KEY || '';