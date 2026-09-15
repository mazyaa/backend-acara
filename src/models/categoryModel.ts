import mongoose , { Schema } from "mongoose";
import * as Yup from "yup";

export const categoryDTO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  icon: Yup.string().required(),
}); // category DTO is a data transfer object

// set category type from categoryDTO
export type TypeCategory = Yup.InferType<typeof categoryDTO>;

const CategorySchema = new Schema<TypeCategory>(
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
