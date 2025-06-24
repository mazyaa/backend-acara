import { Types } from "mongoose";
import { IUser } from "../models/usersModel";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./env";

export interface IUserToken
  extends Omit<
    IUser, // interface IUser from usersModel.ts (parent interface)
    | "password"
    | "activationCode"
    | "isActive"
    | "email"
    | "fullName"
    | "profilePicture"
    | "userName"
  > {
    id?: Types.ObjectId; // Optional id property
  } // Omit use for removing properties from the IUser interface (from usersModel.ts)


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
