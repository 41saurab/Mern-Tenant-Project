import { httpResponseCode, httpResponseStatus } from "../constants/http-response.js";

export const bodyValidator = (schemaDTO) => {
    return async (req, res, next) => {
        try {
            let data = req.body;

            await schemaDTO.validateAsync(data, { abortEarly: false });

            next();
        } catch (exception) {
            let msg = {};

            exception.details.map((error) => {
                msg[error.context.label] = error.message;
            });

            next({
                detail: msg,
                statusCode: httpResponseCode.BAD_REQUEST,
                message: "Validation failed",
                status: httpResponseStatus.validationFailed,
            });
        }
    };
};
