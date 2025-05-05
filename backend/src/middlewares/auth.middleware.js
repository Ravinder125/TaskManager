import { asyncHandler } from "../utils/asynchandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"

const authorization = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1]
    if (!token) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken) return res.status(401).json(ApiResponse.error(401, 'Invalid token'))
    const user = await User.findById(decodedToken._id);
    if (!user) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))
    req.user = user
    next()

});

const adminOnly = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json(ApiResponse.error(403, 'Access denied, admin only'));
    }
})

export {
    authorization,
    adminOnly
}