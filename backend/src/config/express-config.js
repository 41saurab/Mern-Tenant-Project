import express from "express";
import router from "./router-config.js";
import cors from "cors";
import { httpResponseCode, httpResponseStatus } from "../constants/http-response.js";
import "./db-config.js";

const application = express();

application.use(cors());

application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.use("/api/v1", router);

// application.use("/health", (req, res) => {
//     res.json({
//         status: "SUCCESS",
//         message: "API is running",
//         data: null,
//         options: null,
//     });
// });

application.use((req, res, next) => {
    next({
        statusCode: httpResponseCode.NOT_FOUND,
        message: `${req.originalUrl} url not found`,
        status: httpResponseStatus.notFound,
    });
});

application.use((error, req, res, next) => {
    console.log("Garbage error:", error);

    let statusCode = error.statusCode || httpResponseCode.INTERNAL_SERVER_ERROR;
    let message = error.message || "Internal Server Error";
    let status = error.status || httpResponseStatus.internalServerError;
    let data = error.detail || null;

    if (+error.code === 11000) {
        statusCode = 400;
        let msg = {};
        Object.keys(error.keyPattern).map((filed) => {
            msg[filed] = `${filed} should be unique`;
        });

        message = msg;
        status = httpResponseStatus.validationFailed;
    }

    res.status(statusCode).json({
        status: status,
        message: message,
        data: data,
        options: null,
    });
});

export default application;
