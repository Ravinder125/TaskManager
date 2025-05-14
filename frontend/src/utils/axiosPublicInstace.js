// import axios from "axios";
// import { BASE_URL } from "./apiPaths";


// const axiosPublicInstance = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//     }
// })


// axiosPublicInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 500) {
//             console.error('Server error on public route.');
//         }
//         return Promise.reject(error);
//     }
// )

// export default axiosPublicInstance