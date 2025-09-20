import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

export const eventDAO = Yup.object({
    name: Yup.string().required(),
    startDate: Yup.string().required(),
    endDate: Yup.string().required(),
    description: Yup.string().required(),
    banner: Yup.string().required(),
    isFeatured: Yup.boolean().required(),
    isOnline: Yup.boolean().required(),
    isPublish: Yup.boolean(),
    category: Yup.string().required(),
    slug: Yup.string(),
    createdBy: Yup.string().required(),
    createdAt: Yup.string(),
    updatedAt: Yup.string(),
    location: Yup.object().required(),
});

type TEvent = Yup.InferType<typeof eventDAO>;

// change category to ObjectId for foreign key reference from category collection
export interface IEvent extends Omit<TEvent, "category"> {
    category: ObjectId;
}