import { IReqUser, IPaginationQuery } from "../utils/interfaces";
import { Response } from "express";
import CategoryModel, { categoryDAO } from "../models/categoryModel";
import * as response from "../utils/response";

export async function create(req: IReqUser, res: Response) {
  try {
    await categoryDAO.validate(req.body);
    const result = await CategoryModel.create(req.body);

    response.success(res, result, " Success create a category");
  } catch (error) {
    response.error(res, error, "failed create category");
  }
}

export async function findAll(req: IReqUser, res: Response) {
   const {
    page = 1,
    limit = 10,
    search,
  } = req.query as unknown as IPaginationQuery;
  try {
     // handling search
    const query = {};

    if (search) {
      Object.assign(query, {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit) // for skip data example page 2 limit 10, so skip (2-1)*10 = 10 so data is start from 11
        .sort({ createdAt: -1}) // sort by createdAt descending
        .exec();

    // for count all data which match with query example with search  
    const count = await CategoryModel.countDocuments(query);

    response.pagination(res, result, {
        totalPages: Math.ceil(count / limit), // total all data / limit for get total pages
        currentPage: page,
        total: count, // total all data which match with query
    }, 'Success get all categories');
  } catch (error) {
    response.error(res, error, "failed find all category");
  }
}

export async function findOne(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await CategoryModel.findById(id);
    response.success(res, result, 'Success get one category');
  } catch (error) {
    response.error(res, error, "failed find one category");
  }
}

export async function update(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    response.success(res, result, "Success update a category");
  } catch (error) {
    response.error(res, error, "failed update category");
  }
}

export async function remove(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await CategoryModel.findByIdAndDelete(id);
    response.success(res, result, "Success remove a category");
  } catch (error) {
    response.error(res, error, "failed remove category");
  }
}
