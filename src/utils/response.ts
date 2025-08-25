import { Response } from "express";
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
      data: error.errors,
    });
  }
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
