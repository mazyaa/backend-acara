import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import TicketModel, { bannerDAO, TypeBanner } from "../models/bannerModel";
import * as response from "../utils/response";
import { FilterQuery, isValidObjectId } from "mongoose";
export async function create(req: IReqUser, res: Response) {
  try {
    const payload = req.body as TypeBanner;

    await bannerDAO.validate(payload, { abortEarly: false }); // use abortEarly false to get all error message from yup validation

    const result = await TicketModel.create(payload);

    response.success(res, result, "Successfully created a banner!");
  } catch (error) {
    response.error(res, error, "Failed to create a banner");
  }
}
export async function findAll(req: IReqUser, res: Response) {
  const {
    page = 1,
    limit = 10,
    search,
  } = req.query as unknown as IPaginationQuery;
  try {
    const query: FilterQuery<TypeBanner> = {};

    if (search) {
        Object.assign(query, {
            title: { $regex: search, $options: "i" }, // use regex and options i for case insensitive search
        });
    }

    const result = await TicketModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit) // for skip data example page 2 limit 10, so skip (2-1)*10 = 10 so data is start from 11
        .sort({ createdAt: -1}) // sort by createdAt descending
        .exec();

    const count = await TicketModel.countDocuments(query);

    response.pagination(
        res, 
        result,
        {
            totalPages: Math.ceil(count / limit), // total all data / limit for get total pages
            currentPage: page,
            total: count, // total all data which match with query
        },
        "Successfully retrieved all banners"
    )
  } catch (error) {
    response.error(res, error, "Failed to retrieve all banners");
  }
}
export async function findOne(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await TicketModel.findById(id);

    response.success(res, result, "Successfully retrived a banner");
  } catch (error) {
    response.error(res, error, "Failed to retrive a banner");
  }
}
export async function update(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;
    const payload = req.body as Partial<TypeBanner>;

    const result = await TicketModel.findByIdAndUpdate(id, payload, {
        new: true, // return the updated document
    });

    response.success(res, result, "Successfully update a banner");
  } catch (error) {
    response.error(res, error, "Failed to update a banner");
  }
}
export async function remove(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await TicketModel.findByIdAndDelete(id, {
        new: true, // return the deleted document
    });

    response.success(res, result, "Successfully remove a banner");
  } catch (error) {
    response.error(res, error, "Failed to remove a banner");
  }
};
