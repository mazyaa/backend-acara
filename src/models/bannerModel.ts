import mongoose, { Schema } from "mongoose";
import * as Yup from "yup";

const BANNER_MODEL_NAME = 'banner';
export const bannerDAO = Yup.object({
    title: Yup.string().required(),
    image: Yup.string().required(),
    isShow: Yup.boolean().required(), 
});

export type TypeBanner = Yup.InferType<typeof bannerDAO>;

interface IBanner extends TypeBanner {};

const BannerSchema = new Schema<IBanner>({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    image: {
        type: Schema.Types.String,
        required: true,
    },
    isShow: {
        type: Schema.Types.Boolean,
        default: true,
        required: true,
    },
},{
    timestamps: true,
});

const BannerModel = mongoose.model(BANNER_MODEL_NAME, BannerSchema);

export default BannerModel;