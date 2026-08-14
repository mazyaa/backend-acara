import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import * as response from "../utils/response";
import OrderModel, { orderDAO, TypeOrder } from "../models/orderModel";
import TicketModel from "../models/ticketModel";
import { FilterQuery, isValidObjectId } from "mongoose";
export async function create(req: IReqUser, res: Response) {
  try {
    const userId = req.user?.id; // get user id from middleware

    const payload = {
      ...req.body,
      createdBy: userId,
    } as TypeOrder;

    await orderDAO.validate(payload); // validate payload using yup schema

    const getTicket = await TicketModel.findById(payload.ticket); // get ticket from database

    if (!getTicket) {
      return response.notFound(res, "Ticket not found"!);
    };

    // ticket must be available to create order
    if (getTicket.quantity < payload.quantity) {
      return response.badRequest(res, "Ticket is not available!");
    };

    const total: number = +getTicket?.price * +payload.quantity; // calculate total price

    Object.assign(payload, { total }); // assign total price to payload

    const result = await OrderModel.create(payload);

    return response.success(res, result, "Order created successfully!");
  } catch (error) {
    response.error(res, error, "Failed to create order");
  };
};

export async function findAll(req: IReqUser, res: Response) {
  try {
    const buildQuery = (filter: any) => {
      let query: FilterQuery<TypeOrder> = {};

      if (filter.search) query.$text = { $search: filter.search };

      return query;
    };

    const { limit = 10, page = 1, search } = req.params;

    const query = buildQuery({ search });

    const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean() // user lean() to return plain javascript object instead of mongoose document
        .exec();

    const count = await OrderModel.countDocuments(query);

    response.pagination(
        res,
        result,
        {
            totalPages: Math.ceil(count / +limit),
            currentPage: +page,
            total: count,
        },
        "Successfully retrieved all orders"
    )
  } catch (error) {
    response.error(res, error, "Failed to retrieve all orders");
  };
};
export async function findOne(req: IReqUser, res: Response) {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return response.badRequest(res, "Invalid order id, please check your order id!");
        }
        
        const result = await OrderModel.findById(id);

        if (!result) {
            response.notFound(res, "Order not found!");
        }

        return response.success(res, result, "Successfully retrieved order");
    } catch (error) {
        response.error(res, error, "Failed to retieve order");
    }
}
export async function findAllByMember(req: IReqUser, res: Response) {}

export async function completed(req: IReqUser, res: Response) {}

export async function pending(req: IReqUser, res: Response) {}

export async function cancelled(req: IReqUser, res: Response) {}
