import multer from "multer";
import { httpResponseCode, httpResponseStatus } from "../constants/http-response.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

export const uploadFile = (filetype = "image") => {
    const fileFilter = (req, file, cb) => {
        const extension = file.originalname.split(".").pop();

        if (filetype === "image" && ["jpg", "jpeg", "png", "svg", "bmp", "webp"].includes(extension.toLowerCase())) {
            cb(null, true);
        } else if (filetype === "doc" && ["txt", "pdf", "csv", "xslx", "xls", "json", "ppt"].includes(extension.toLowerCase())) {
            cb(null, true);
        } else {
            cb({
                statusCode: httpResponseCode.BAD_REQUEST,
                message: "File format not supported",
                status: httpResponseStatus.validationFailed,
            });
        }
    };
    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5000000,
        },
    });
};
