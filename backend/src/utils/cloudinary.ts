import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { cleanUpFiles } from "./cleanUpFiles.js";
import type { UploadApiResponse } from "cloudinary";
import { ENV } from "../config/env.config.js";

dotenv.config({ path: "./.env" });

// ---- env guards (TS + runtime safety)
const {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = ENV;

if (!CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary environment variables are missing");
}

// Configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | undefined> => {
  const upload = await cloudinary.uploader
    .upload(localFilePath, {
      resource_type: "image",
      folder: "TaskManager",
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      format: "webp",
    })
    .then((result) => {
      return result;
    })
    .catch((error: unknown) => {
      console.error(
        "Error while uploading image on cloudinary",
        error
      );
      return undefined;
    })
    .finally(() => cleanUpFiles(localFilePath));

  return upload;
};

export { uploadOnCloudinary };
