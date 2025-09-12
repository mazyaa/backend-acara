import mongoose from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

export const categoryDAO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  icon: Yup.string().required(),
}); // category DAO is a data access object

// set category type from categoryDAO
export type Category = Yup.InferType<typeof categoryDAO>;

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    icon: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
