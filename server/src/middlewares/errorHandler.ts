import { errorResponse } from "@/lib/utils";
import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let status = err.statusCode || 500;
  let message = err.message || "Internal server error. Try again later.";

  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
  }

  errorResponse({ res, status, message });
};

export default errorMiddleware;
