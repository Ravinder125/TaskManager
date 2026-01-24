import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model.js";

/* =======================
   Auth Middleware
======================= */

interface DecodedToken extends JwtPayload {
  _id: string;
  email: string;
  role: "admin" | "employee";
}

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.error(401, "Unauthorized request"));
    }

    let decodedToken: DecodedToken;

    try {
      decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;
    } catch {
      return res
        .status(401)
        .json(
          ApiResponse.error(401, "Invalid or expired token")
        );
    }

    const user = await User.findById(decodedToken._id)
      .select("_id")
      .lean();

    if (!user) {
      return res
        .status(401)
        .json(ApiResponse.error(401, "Unauthorized request"));
    }

    req.user = {
      _id: user._id,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    next();
  }
);

export const adminOnly = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === "admin") {
      return next();
    }

    return res
      .status(403)
      .json(
        ApiResponse.error(
          403,
          "Access denied, admin only"
        )
      );
  }
);
