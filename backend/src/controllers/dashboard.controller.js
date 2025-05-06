import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";


const getAdminDashboard = asyncHandler(async (req, res) => {

})

const getUserDashboard = asyncHandler(async (req, res) => {

})


export {
    getAdminDashboard,
    getUserDashboard,
}