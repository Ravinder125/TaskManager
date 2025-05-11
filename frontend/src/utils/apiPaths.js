export const BASE_URL = "http://localhost:3000";

// utils/api/paths.js
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/v1/auth/register", // Register a new user (Admin or Employee)
        LOGIN: "/api/v1/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/v1/auth/profile", // Get logged-in user details
    },

    USERS: {
        GET_ALL_USERS: "/api/v1/users", // Get all users (Admin only)
        GET_USER_BY_ID: (userId) => `/api/v1/users/${userId}`, // Get user by ID,
        CREATE_USER: "/api/v1/users", // Create a new user (Admin only)
        UPDATE_USER: (userId) => `/api/v1/users/${userId}`, // Update user details
        DELETE_USER: (userId) => `/api/v1/users/${userId}`, // Delete a user
    },

    DASHBOARD: {
        GET_DASHBOARD_DATA: "/api/v1/dashboard/dashboard-data/", // Get Dashboard Data
        GET_USER_DASHBOARD_DATA: "/api/v1/dashboard/dashboard-data/", // Get Dashboard Data
    },

    TASKS: {
        GET_ALL_TASKS: "/api/v1/tasks", // Get all tasks (Admin: all, User: only assigned tasks)
    }
}

seconds: 7, 140