import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import TicketModel, { ticketDAO, TypeTicket } from "../models/ticketModel";
import * as response from "../utils/response";
import { FilterQuery, isValidObjectId } from "mongoose";

export async function create(req: IReqUser, res: Response) {
  try {
    const payload = req.body as TypeTicket;

    await ticketDAO.validate(payload, { abortEarly: false }); // use abortEarly false to get all error message from yup validation

    const result = await TicketModel.create(payload);

    response.success(res, result, "Successfully created a ticket!");
  } catch (error) {
    response.error(res, error, "Failed to create a ticket");
  }
}
export async function findAll(req: IReqUser, res: Response) {
  const {
    page = 1,
    limit = 10,
    search,
  } = req.query as unknown as IPaginationQuery;

  try {
    const query: FilterQuery<TypeTicket> = {};

    if (search) {
      Object.assign(query, {
        name: { $regex: search, $options: "i" },
      });
    }

    const result = await TicketModel.find(query)
      .populate("events")
      .limit(limit)
      .skip((page - 1) * limit) // for skip data example page 2 limit 10, so skip (2-1)*10 = 10 so data is start from 11
      .sort({ createdAt: -1 }) // sort by createdAt descending
      .exec();

    const count = await TicketModel.countDocuments(query); // for count all data which match with query

    response.pagination(
      res,
      result,
      {
        totalPages: Math.ceil(count / limit), // total all data / limit for get total pages
        currentPage: page,
        total: count, // total all data which match with query
      },
      "Successfully retrieved all tickets",
    );
  } catch (error) {
    response.error(res, error, "Failed to find all tickets");
  }
}
export async function findOne(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.badRequest(res, "id is not valid, please check your id!");
    }

    const result = await TicketModel.findById(id).populate("events");

    if (!result) {
      response.notFound(res, "Ticket not found");
    }

    response.success(res, result, "Successfully retrieved a ticket");
  } catch (error) {
    response.error(res, error, "Failed to find a ticket");
  }
}
export async function update(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.badRequest(res, "id is not valid, please check your id!");
    }

    const payload: Partial<TypeTicket> = req.body;

    const result = await TicketModel.findByIdAndUpdate(id, payload, {
      new: true, // use new true to return the updated document instead of the original document
    });

    if (!result) {
      response.notFound(res, "Ticket not found");
    }

    response.success(res, result, "Successfully updated a ticktet");
  } catch (error) {
    response.error(res, error, "Failed to update a ticket");
  }
}
export async function remove(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.badRequest(res, "id is not valid, please check your id!");
    }

    const result = await TicketModel.findByIdAndDelete(id, {
      new: true, // use new true to return the deleted document instead of the original document
    });

    if (!result) {
      return response.notFound(res, "Ticket not found");
    }

    response.success(res, result, "Successfully deleted a ticket");
  } catch (error) {
    response.error(res, error, "Failed to delete a ticket");
  }
}
export async function findAllByEventId(req: IReqUser, res: Response) {
  try {
    const { eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return response.badRequest(res, "id is not valid, please check your id!");
    }

    const result = await TicketModel.find({ events: eventId }).exec(); // find all tickets by eventId and use exec() to execute the query and return a promise

    if (!result || result.length === 0) {
      return response.notFound(res, "No tickets found for the specified eventId");
    }

    response.success(
      res,
      result,
      "Successfully retrieved all tickets by eventId",
    );
  } catch (error) {
    response.error(res, error, "Failed to find all tickets by eventId");
  }
}
