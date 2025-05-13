import { API_PATHS, BASE_URL } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append image file to form data
    formData.append('Profileimage', imageFile)

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set header for file upload
            },
        });
        return response.data
    } catch (error) {
        console.error('Error uploading the image:', error)
        throw error
    }
}

