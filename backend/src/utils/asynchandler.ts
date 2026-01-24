import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "./ApiResponse.js";

type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const asyncHandler =
  (fn: AsyncFn) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Internal Server Error";

      res.status(500).json(ApiResponse.error(500, message));
      next(error);
    }
  };
