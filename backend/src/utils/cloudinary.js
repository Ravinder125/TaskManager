import { v2 as cloudinary } from 'cloudinary';
import { cleanUpFiles } from './cleanUpFiles.js';


// Configuration
cloudinary.config({
    cloud_name: 'dsewrli3x' || process.env.CLOUD_NAME,
    api_key: 446452547259894 || process.env.CLOUDINARY_API_KEY,
    api_secret: 'b9FP8qW3WV9TnGDFN9l9biAEeRQ' || process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    const upload = await cloudinary.uploader
        .upload(localFilePath, { resource_type: 'auto' })
        .then(result => {
            console.log('File successfully uploaded on cloudinary')
            return result
        }
        )
        .catch((error) => console.error('Error while uploading image on cloudinary', error))
        .finally(() => cleanUpFiles([localFilePath]))
    return upload
}




export { uploadOnCloudinary }