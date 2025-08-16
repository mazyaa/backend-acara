import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./env";

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

// function for Converts a file buffer to a Data URL format
const toDataURL = (file: Express.Multer.File) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURL = `data:${file.mimetype};base64,${b64}`;
  return dataURL;
};

export default {
    // an async function to upload a single file  
    async singleUpload(file: Express.Multer.File) {
      const fileDataURL = toDataURL(file);

      const result = await cloudinary.uploader.upload(fileDataURL, {
        resource_type: "auto"
      })
    },
    async multipleUpload(files: Express.Multer.File[]) {},
    async remove(fileUrl: string) {},
}
