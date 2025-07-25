const BASE_URL = "https://taskmanager-5-pwv3.onrender.com"; // Update the port if your backend runs on a different port
// const BASE_URL = "http://localhost:4000"

// utils/apiPaths.js
const API_PATHS = {
    AUTH: {
        REGISTER: "/api/v1/auth/register", // Register a new user (Admin or Employee)
        LOGIN: "/api/v1/auth/login", // Authenticate user & return JWT token
        LOGOUT: "/api/v1/auth/logout", // Logout a user 
        GET_PROFILE: "/api/v1/auth/profile", // Get logged-in user details
        UPDATE_PROFILE: "/api/v1/auth/profile", // Update user profile details
        CHANGE_PASSWORD: "/api/v1/auth/change-password", // Change user password
    },

    USERS: {
        GET_ALL_USERS: "/api/v1/users", // Get all users (Admin only)
        GET_USER_BY_ID: (userId) => `/api/v1/users/${userId}`, // Get user by ID,
        CREATE_USER: "/api/v1/users", // Create a new user (Admin only)
        UPDATE_USER: (userId) => `/api/v1/users/${userId}`, // Update user details
        DELETE_USER: (userId) => `/api/v1/users/${userId}`, // Delete a user
    },

    TASKS: {
        GET_ALL_TASKS: "/api/v1/tasks", // Get all tasks (Admin: all, User: only assigned tasks)
        CREATE_TASK: "/api/v1/tasks", // Create a task (Admin only)
        GET_TASK_BY_ID: (taskId) => `/api/v1/tasks/${taskId}`, // Get a new by Id 
        UPDATE_TASK: (taskId) => `/api/v1/tasks/${taskId}`, // Update a task
        TOGGLE_DELETE_TASK: (taskId) => `/api/v1/tasks/${taskId}`, // Delete and undo a task

        UPDATE_TASK_STATUS: (taskId) => `/api/v1/tasks/status/${taskId}`, // Update task status
        UPDATE_TASK_TODO_CHECKLIST: (taskId) => `/api/v1/tasks/${taskId}/todos`, // Update task todos
    },

    DASHBOARD: {
        GET_DASHBOARD_DATA: "/api/v1/dashboard/admin-data/", // Get Dashboard Data (Admin only)
        GET_USER_DASHBOARD_DATA: "/api/v1/dashboard/user-data/", // Get User Dashboard Data 
    },

    REPORT: {
        EXPORT_TASKS: "/api/v1/reports/export/tasks", // Downaload all tasks as an Excel sheet
        EXPORT_USERS: "/api/v1/reports/export/users" // Download user-task report
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },

    INVITE: {
        GENERATE_INVITE_TOKEN: (token) => `/api/v1/auth/invite/${token}` // Generate a new invite token
    }
}


Object.freeze(API_PATHS);

export {
    BASE_URL,
    API_PATHS
}
