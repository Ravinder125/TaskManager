import { asyncHandler } from "../utils/asynchandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import { promisify } from 'util'

const verifyJwt = promisify(jwt.verify)

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1]

    if (!token) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))

    let decodedToken;
    try {
        decodedToken = await verifyJwt(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        return res.status(401).json(ApiResponse.error(401, 'Invalid token or expired token'))
    }

    const user = await User.findById(decodedToken._id).lean().select('_id');
    if (!user) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))

    req.user = {
        _id: user._id,
        email: decodedToken.email,
        role: decodedToken.role
    }
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
    isAuthenticated,
    adminOnly
}