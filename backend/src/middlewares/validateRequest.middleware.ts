import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const validationRequest = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors
            .array()
            .map(err => err.msg)
            .join(", ");

        return res
            .status(400)
            .json(ApiResponse.error(400, message));
    }
    next()
})