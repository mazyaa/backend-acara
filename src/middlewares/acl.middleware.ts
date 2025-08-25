import { Response, NextFunction } from 'express';
import { IReqUser } from '../utils/interfaces';
import * as response from '../utils/response';

export default (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction) => {
        const role = req.user?.role;

        if (!role || !roles.includes(role)) { //use !roles.includes(role) for check data role, if it is outside the specified role then it will return forbidden
            return response.unauthorized(res, 'forbidden');
        }
        next(); // if role is in the specified roles then continue to next middleware or controller
    }
}