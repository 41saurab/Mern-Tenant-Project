import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class FileUploadService {
    static async uploadFile(filePath, dir) {
        try {
            const cloudinaryFile = await cloudinary.uploader.upload(filePath, {
                folder: dir,
                resource_type: "auto",
                unique_filename: true,
            });
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            return cloudinaryFile.url;
        } catch (exception) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw exception;
        }
    }
}

export default FileUploadService;
