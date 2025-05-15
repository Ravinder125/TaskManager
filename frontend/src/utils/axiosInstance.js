import axios from 'axios';
import { BASE_URL } from './apiPaths';

// Utility function to get the current path
const getCurrentPath = () => window.location.pathname;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
})

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // No token needed here! Cookies are automatically attached
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const currentPath = getCurrentPath();
            const AuthPage = ['/login', '/register']
            if (error.response.status === 401 && !AuthPage.includes(currentPath)) {
                // Redirected to login page
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.error("Server error, Please try again later.");
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
)




export default axiosInstance;