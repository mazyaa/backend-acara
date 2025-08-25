import { NextFunction, Request, Response } from 'express';
import { getUserData } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';
import jwt from 'jsonwebtoken';
import * as response from '../utils/response';


export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers?.authorization;

    if (!authorization) {
        return response.unauthorized(res);
    }

    // desctructuring authorizaiton header and spliting it by space which is on headers
    const [prefix, token] = authorization.split(' ');  //perfix = Bearer, token = token. example: 'Bearer blablablathisistoken'

    // check if prefix is Bearer and token is empty
    if (!(prefix === 'Bearer' && token)) {
        return response.unauthorized(res);
    }

    try {
        //get token and send to getUserData function
        const user = getUserData(token);
    
        if (!user) {
            return response.unauthorized(res);
        }
    
        //cast a request user to IUserToken type
        (req as IReqUser).user = user; // set user property on request object
    
        next(); // next to middleware or controller
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return response.unauthorized(res, 'Your token has expired, please login again.');
        }
    }
}