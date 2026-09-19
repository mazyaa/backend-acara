import { NextFunction, Request, Response } from "express"
import * as response from "../utils/response";
export const serverRouter = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        response.notFound(res, "Route not found");
    };
};

export const serverError = () => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        response.error(res, err, err.message);
    };
};