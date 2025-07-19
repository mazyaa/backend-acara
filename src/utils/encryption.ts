import crypto from 'crypto';
import { PASSWORD_SECRET, ACTIVATION_SECRET } from './env';

export function encrypt(password: string): string  {
    const encrypted = crypto
        .pbkdf2Sync(password, PASSWORD_SECRET, 1000, 64, 'sha512')
        .toString('hex');

    return encrypted;
}

export function generateActivationCode(userId: string): string {
    const activationCode = crypto
        .createHmac('sha256', ACTIVATION_SECRET)
        .update(userId)
        .digest('hex');

    return activationCode;
}