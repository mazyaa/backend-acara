import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import * as response from "../utils/response";
import OrderModel, {
  orderDAO,
  OrderStatus,
  TypeOrder,
  TypeVoucher,
} from "../models/orderModel";
import TicketModel from "../models/ticketModel";
import { FilterQuery, isValidObjectId } from "mongoose";
import generateUniqueId from "../utils/id";
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
    }

    // ticket must be available to create order
    if (getTicket.quantity < payload.quantity) {
      return response.badRequest(res, "Ticket is not available!");
    }

    const total: number = +getTicket?.price * +payload.quantity; // calculate total price

    Object.assign(payload, { total }); // assign total price to payload

    const result = await OrderModel.create(payload);

    return response.success(res, result, "Order created successfully!");
  } catch (error) {
    response.error(res, error, "Failed to create order");
  }
}
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
      "Successfully retrieved all orders",
    );
  } catch (error) {
    response.error(res, error, "Failed to retrieve all orders");
  }
}
export async function findOne(req: IReqUser, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return response.badRequest(
        res,
        "Invalid order id, please check your order id!",
      );
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

export async function completed(req: IReqUser, res: Response) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await OrderModel.findOne({
      orderId,
      createdBy: userId,
    });

    if (!order) {
      return response.notFound(res, "Order not found!");
    }

    if (order.status === OrderStatus.COMPLETED) {
      return response.badRequest(res, "Order is already completed!");
    }

    // generate vouchers based on order quantity
    const vouchers: TypeVoucher[] = Array.from(
      { length: order.quantity },
      () => {
        return {
          isPrint: false,
          voucherId: generateUniqueId(), // generate unique voucher id
        } as TypeVoucher;
      },
    );

    const result = await OrderModel.findOneAndUpdate(
      { orderId, createdBy: userId }, // update order by orderId and userId
      { status: OrderStatus.COMPLETED, vouchers }, // update status to completed and add vouchers
      { new: true }, // return the updated document
    );

    const ticket = await TicketModel.findById(order.ticket);

    if (!ticket) {
      return response.notFound(res, "Ticket not found!");
    }

    await TicketModel.updateOne(
      { _id: ticket._id },
      { quantity: ticket.quantity - order.quantity }, // reduce ticket quantity by order quantity
    );

    return response.success(res, result, "Order completed successfully!");
  } catch (error) {
    response.error(res, error, "Failed to completed an order");
  }
}

export async function pending(req: IReqUser, res: Response) {
  try {
  } catch (error) {
    response.error(res, error, "Failed to pending an order");
  }
}

export async function cancelled(req: IReqUser, res: Response) {
  try {
  } catch (error) {
    response.error(res, error, "Failed to cancelled an order");
  }
}
