import { Response } from "express";
import mongoose from "mongoose";
import * as Yup from "yup";

type Pagination = {
    totalPages: number;
    currentPage: number;
    total: number;
}

export function success(res: Response, data: any, message: string) {
  res.status(200).json({
    meta: {
      status: 200,
      message,
    },
    data,
  });
}

export function error(res: Response, error: unknown, message: string) {
  if (error instanceof Yup.ValidationError) {
    return res.status(400).json({
      meta: {
        status: 400,
        message,
      },
      data: {
        [`${error.path}`]: error.errors,
      },
    });
  }

  //error for mongoose (orm)
  if (error instanceof mongoose.Error) {
    return res.status(500).json({
      meta: {
        status: 500,
        message: error.message,
      },
      data: error.name,
    })
  }

  //error from db (mongo db)
  if ((error as any)?.code) {
    const _err = error as any;
    return res.status(500).json({
      meta: {
        status: 500,
        messsage: _err.errorResponse.errmsg,
      },
      data: _err,
    });
  }

  res.status(500).json({
    meta: {
      status: 500,
      message,
    },
    daya: error,
  })
}

export function unauthorized(res: Response, message: string = "Unauthorized") {
  res.status(403).json({
    meta: {
      status: 403,
      message,
    },
    data: null,
  });
}

export function pagination(
  res: Response,
  data: any[],
  pagination: Pagination,
  message: string
) {
    res.status(200).json({
        meta: {
            status: 200,
            message,
        },
        data,
        pagination,
    })
}
