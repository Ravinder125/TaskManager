import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    // Append image file to form data
    formData.append('profileImage', imageFile)

    try {
        const response = await axiosInstance.patch(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data
    } catch (error) {
        console.error('Error uploading the image:', error)
        throw error
    }
}

