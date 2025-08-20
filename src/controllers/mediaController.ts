import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import * as uploader from "../utils/uploader";

export async function single(req: IReqUser, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      message: "No File Provided",
      data: null,
    });
  }
  try {
    const result = await uploader.singleUpload(req.file as Express.Multer.File);
    res.status(200).json({
      message: "File Uploaded Successfully",
      data: result,
    });
  } catch {
    res.status(500).json({
      message: "File Upload Failed",
      data: null,
    });
  }
}

export async function multiple(req: IReqUser, res: Response) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "No Files Provided",
      data: null,
    });
  }
  try {
    const result = await uploader.multipleUpload(
      req.files as Express.Multer.File[]
    );
    res.status(200).json({
      message: "Files Uploaded Successfully",
      data: result,
    });
  } catch {
    res.status(500).json({
      message: "Files Upload Failed",
      data: null,
    });
  }
}

export async function remove(req: IReqUser, res: Response) {
    try {
        const { fileUrl } = req.body as {fileUrl: string};
        const result = await uploader.remove(fileUrl);
        res.status(200).json({
            message: 'file removed successfully',
            data: result,
        })
    } catch {
        res.status(500).json({
            message: 'file remove failed',
            data: null
        })
    }
}
