import axios from 'axios';
import { BASE_URL } from './apiPaths';
import getCurrentPath from '../components/other/getCurrentPath';

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
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
                const currentPath = getCurrentPath();
                const isOnAuthPage = ['/login', '/register']
                if (isOnAuthPage.includes(currentPath)) return;

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