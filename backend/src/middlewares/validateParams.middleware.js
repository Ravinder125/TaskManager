import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

const validateParams = (req, res, next) => {
    if (req.params) {
        const invalid = Object.values(req.params).some((param) => mongoose.Types.ObjectId.isValid(param))
        if (!invalid) return res.status(400).json(ApiResponse.error(400, 'Invalid parameter ID(s)'))
    } else {
        return res.status(400).json(ApiResponse.error(400, 'Id is required'))
    }

    next();

};


export { validateParams }