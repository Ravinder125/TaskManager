import { asyncHandler } from "../utils/asynchandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import { Admin } from "../models/admin.model.js"
import { compareSync } from "bcryptjs"

const authUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1]
    if (!token) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken) return res.status(401).json(ApiResponse.error(401, 'Invalid token'))

    const user = await User.findById(decodedToken._id);
    if (!user) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))
    req.user = user
    next()

});

const authAdmin = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1]
    if (!token) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))
    console.log(token)
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken) return res.status(401).json(ApiResponse.error(401, 'Invalid token'))
    console.log(decodedToken)
    const admin = await Admin.findById(decodedToken._id);
    if (!admin) return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))
    req.admin = admin
    console.log(admin)
    next()

})

export {
    authUser,
    authAdmin
}