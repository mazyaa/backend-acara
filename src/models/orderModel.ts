import mongoose, { Schema, ObjectId } from "mongoose";
import * as Yup from "yup";
import { EVENT_MODEL_NAME } from "./eventModel";
import { TICKET_MODEL_NAME } from "./ticketModel";
import { USERS_MODEL_NAME } from "./usersModel";
import generateUniqueId from "../utils/id";
import createLink, { Payment, TypeResponseMidtrans } from "../utils/payment";

export const ORDER_MODEL_NAME = "Order";

export const orderDAO = Yup.object({
  createdBy: Yup.string().required(),
  events: Yup.string().required(),
  ticket: Yup.string().required(),
  quantity: Yup.number().required(),
});

export type TypeOrder = Yup.InferType<typeof orderDAO>; // assign type from yup schema

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type TypeVoucher = {
  voucherId: string;
  isPrint: boolean;
};

export interface IOrder extends Omit<
  TypeOrder,
  "createdBy" | "events" | "ticket"
> {
  total: number;
  status: string;
  payment: TypeResponseMidtrans;
  createdBy: ObjectId;
  events: ObjectId;
  orderId: string;
  ticket: ObjectId;
  quantity: number;
  vouchers: TypeVoucher[];
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: Schema.Types.String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: USERS_MODEL_NAME, // reference to users model
      required: true,
    },
    events: {
      type: Schema.Types.ObjectId,
      ref: EVENT_MODEL_NAME, // reference to event model
      required: true,
    },
    total: {
      type: Schema.Types.Number,
      required: true,
    },
    payment: {
      type: {
        token: {
          type: Schema.Types.String,
          required: true,
        },
        redirect_url: {
          type: Schema.Types.String,
          required: true,
        },
      },
    },
    status: {
      type: Schema.Types.String,
      enum: [OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      default: OrderStatus.PENDING,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: TICKET_MODEL_NAME, // reference to ticket model
      required: true,
    },
    quantity: {
      type: Schema.Types.Number,
      required: true,
    },
    vouchers: {
      type: [
        {
          voucherId: {
            type: Schema.Types.String,
          },
          isPrint: {
            type: Schema.Types.Boolean,
            default: false,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
).index({ orderId: "text" }); // create text index for search in orderId

OrderSchema.pre("save", async function (){
    const order = this; // use this to access the document being saved
    order.orderId = generateUniqueId(); // generate unique order id before saving
    order.payment = await createLink({
        transaction_details: {
            order_id: order.orderId,
            gross_amount: order.total,
        },
    }); // create payment link before saving
});

const OrderModel = mongoose.model(ORDER_MODEL_NAME, OrderSchema); // creating model for order schema

export default OrderModel;
