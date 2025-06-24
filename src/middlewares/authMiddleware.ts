import { NextFunction, Request, Response } from 'express';
import { getUserData, IUserToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';

export interface IReqUser extends Request {
    user?: IUserToken 
} // set user property on Request interface from interface IUserToken in jwt.ts file

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers?.authorization;

    if (!authorization) {
        return res.status(403).json({
            message: 'unauthorized',
            data: null
        })
    }

    // desctructuring authorizaiton header and spliting it by space which is on headers
    const [prefix, token] = authorization.split(' ');  //perfix = Bearer, token = token. example: 'Bearer blablablathisistoken'

    // check if prefix is Bearer and token is empty
    if (!(prefix === 'Bearer' && token)) {
        return res.status(403).json({
            message: 'unauthorized',
            data: null
        })
    }

    try {
        //get token and send to getUserData function
        const user = getUserData(token);
    
        if (!user) {
            return res.status(403).json({
                message: 'unauthorized',
                data: null
            });
        }
    
        //cast a request user to IUserToken type
        (req as IReqUser).user = user; // set user property on request object
    
        next(); // next to middleware or controller
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({
                message: 'Your token has expired, please login again.',
                data: null
            });
        }
    }
}