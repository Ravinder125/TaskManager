import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

const validateParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = Object.values(req.params);

  if (!params.length) {
    return res
      .status(400)
      .json(ApiResponse.error(400, "Id is required"));
  }

  const hasInvalidId = params.some(
    (param) => !mongoose.Types.ObjectId.isValid(param.toString())
  );

  if (hasInvalidId) {
    return res
      .status(400)
      .json(
        ApiResponse.error(400, "Invalid parameter ID(s)")
      );
  }

  next();
};

export { validateParams };
