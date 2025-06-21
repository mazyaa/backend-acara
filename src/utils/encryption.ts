import crypto from 'crypto';
import { PASSWORD_SECRET } from './env';

export function encrypt(password: string): string  {
    const encrypted = crypto
        .pbkdf2Sync(password, PASSWORD_SECRET, 1000, 64, 'sha512')
        .toString('hex');

    return encrypted;
}