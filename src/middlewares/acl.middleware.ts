import { Response, NextFunction } from 'express';
import { IReqUser } from './authMiddleware';

export default (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction) => {
        const role = req.user?.role;

        if (!role || !roles.includes(role)) { //use !roles.includes(role) for check data role, if it is outside the specified role then it will return forbidden
            return res.status(403).json({
                message: "Forbidden",
                data: null
            })
        }
        next(); // if role is in the specified roles then continue to next middleware or controller
    }
}