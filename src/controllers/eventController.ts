import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import { eventDAO, EventModel, TEvent } from "../models/eventModel";
import * as response from "../utils/response";
import { FilterQuery } from "mongoose";

export async function create(req: IReqUser, res: Response) {
  try {
    const payload = { ...req.body, createdBy: req.user?.id } as TEvent; // get all payload from body and add createdBy from user id

    await eventDAO.validate(payload, { abortEarly: false }); // validate payload with yup

    const result = await EventModel.create(payload);

    response.success(res, result, "Successfully created an event");
  } catch (error) {
    response.error(res, error, "Failed to create an event");
  }
}

export async function findAll(req: IReqUser, res: Response) {
  const {
    page = 1,
    limit = 10,
    search,
  } = req.query as unknown as IPaginationQuery;

  try {
    const query: FilterQuery<TEvent> = {};

    if (search) {
      Object.assign(query, {
        ...query,
        $text: {
          $search: search,
        },
      });
    }

    const result = await EventModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit) // for skip data example page 2 limit 10, so skip (2-1)*10 = 10 so data is start from 11
      .sort({ createdAt: -1 }) // sort by createdAt descending
      .exec();

    const count = await EventModel.countDocuments(query);

    response.pagination(
      res,
      result,
      {
        totalPages: Math.ceil(count / limit), // total all data / limit for get total pages
        currentPage: page,
        total: count, // total all data which match with query
      },
      "Successfully retrieved all events"
    );
  } catch (error) {
    response.error(res, error, "Failed to find All events");
  }
}

export async function findOne(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await EventModel.findById(id);

    response.success(res, result, "Successfully retrived an event by id");
  } catch (error) {
    response.error(res, error, "Failed to find an event");
  }
}

export async function update(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await EventModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    response.success(res, result, "Successfully updated an event");
  } catch (error) {
    response.error(res, error, "Failed to update an event");
  }
}

export async function remove(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    const result = await EventModel.findByIdAndDelete(id, {
        new: true,
    });

    response.success(res, result, "Successfully deleted an event");
  } catch (error) {
    response.error(res, error, "Failed to delete an event");
  }
}

export async function findOneBySlug(req: IReqUser, res: Response) {
  try {
    const { slug } = req.params;

    const result = await EventModel.findOne({
        slug,
    });

    response.success(res, result, "Successfully retreived an event by slug");
  } catch (error) {
    response.error(res, error, "Failed to find one an event by slug");
  }
}
