import { IReqUser } from '../utils/interfaces';
import { Response } from 'express';
import CategoryModel, { categoryDAO } from '../models/categoryModel';
import * as response from '../utils/response';

export async function create(req: IReqUser, res: Response) {
    try {

    } catch (error) {
        response.error(res, error, 'failed create category');
    }
};

export async function findAll(req: IReqUser, res: Response) {
    try {

    } catch (error) {
        response.error(res, error, 'failed find all category');
    }
};

export async function findOne(req: IReqUser, res: Response) {
    try {

    } catch (error) {
        response.error(res, error, 'failed find one category');
    }
};

export async function update(req: IReqUser, res: Response) {
    try {

    } catch (error) {
        response.error(res, error, 'failed update category');
    }
};

export async function remove(req: IReqUser, res: Response) {
    try {

    } catch (error) {
        response.error(res, error, 'failed remove category');
    }
};

