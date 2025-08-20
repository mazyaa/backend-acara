import { Request } from "express";
import { Types } from "mongoose";
import { IUser } from "../models/usersModel";

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
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {
    id?: Types.ObjectId; // Optional id property
  } // Omit use for removing properties from the IUser interface (from usersModel.ts)


export interface IReqUser extends Request {
    user?: IUserToken 
} // set user property on Request interface from interface IUserToken in jwt.ts file

