import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./env";
import { IUserToken } from "./interfaces";


export function generateToken(user: IUserToken): string {
    const token = jwt.sign(user, SECRET_KEY, {
        expiresIn: '1h', // Token will expire in 1 hour
    });

    return token;
}

export function getUserData(token: string) {
    const decoded = jwt.verify(token, SECRET_KEY);

    // check type of decoded
    if (typeof decoded !== 'object' || !('id' in decoded)) {
        throw new Error('invalid token structure');
    }
    
    return decoded as IUserToken; // Cast decoded to IUserToken type, so type of decoded must match IUserToken
}
