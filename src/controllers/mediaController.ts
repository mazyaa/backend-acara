import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import * as uploader from "../utils/uploader";
import * as response from "../utils/response";

export async function single(req: IReqUser, res: Response) {
  if (!req.file) {
    response.error(res, null, "No file provided");
  }
  try {
    const result = await uploader.singleUpload(req.file as Express.Multer.File);

    response.success(res, result, "FIle Uploaded Successfully");
  } catch {
    response.error(res, null, "File Upload Failed");
  }
}

export async function multiple(req: IReqUser, res: Response) {
  if (!req.files || req.files.length === 0) {
    response.error(res, null, "No Files Provided");
  }
  try {
    const result = await uploader.multipleUpload(
      req.files as Express.Multer.File[]
    );

    response.success(res, result, "Files Uploaded Successfully");
  } catch {
    response.error(res, null, "Files Upload Failed");
  }
}

export async function remove(req: IReqUser, res: Response) {
  try {
    const { fileUrl } = req.body as { fileUrl: string };
    const result = await uploader.remove(fileUrl);

    response.success(res, result, "File removed successfully");
  } catch {
    response.error(res, null, 'File remove failed');
  }
}
