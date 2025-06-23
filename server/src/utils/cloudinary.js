import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary credentials not found.");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary and delete it locally.
 */
const uploadOnCloudinary = async (localFilePath, resource_type = "auto") => {
    try {
        if (!localFilePath || !fs.existsSync(localFilePath)) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type,
        });

        // Delete file safely after upload
        fs.unlink(localFilePath, (err) => {
            if (err) console.error("Failed to delete temp file:", err.message);
        });

        return response;
    } catch (error) {
        console.error("Upload error:", error.message);

        // Try removing local file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlink(localFilePath, (err) => {
                if (err) console.error("Failed to delete temp file after error:", err.message);
            });
        }

        return null;
    }
};

/**
 * Extract Cloudinary public ID from a file URL.
 */
const extractPublicId = (url) => {
    if (!url) return null;

    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0]; // remove extension
    const folderPath = parts.slice(parts.indexOf("upload") + 1).join("/");
    return `${folderPath}/${fileName}`;
};

/**
 * Delete a file from Cloudinary using its URL.
 */
const deleteOnCloudinary = async (url, resource_type = "image") => {
    try {
        const publicId = extractPublicId(url);
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type,
        });

        return response;
    } catch (error) {
        console.error("Cloudinary delete error:", error.message);
        return null;
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };
