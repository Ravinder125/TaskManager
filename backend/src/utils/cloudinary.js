import { v2 as cloudinary } from 'cloudinary';
import { cleanUpFiles } from './cleanUpFiles.js';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    const upload = await cloudinary.uploader
        .upload(localFilePath, {
            resource_type: 'image',
            folder: 'TaskManager',
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            format: 'webp',
        })
        .then(result => {
            return result
        }
        )
        .catch((error) => console.error('Error while uploading image on cloudinary', error))
        .finally(() => cleanUpFiles([localFilePath]))
    return upload
}




export { uploadOnCloudinary }