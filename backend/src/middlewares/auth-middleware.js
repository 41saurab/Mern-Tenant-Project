import jwt from "jsonwebtoken";
import { httpResponseCode, httpResponseStatus } from "../constants/http-response.js";
import { authSvc } from "../modules/auth/auth-service.js";
import dotenv from "dotenv";

dotenv.config();

export const checkLogin = async (req, res, next) => {
    try {
        let token = req.headers["authorization"] || null;
        if (!token) {
            throw {
                statusCode: httpResponseCode.UNAUTHENTICATED,
                message: "Login first",
                status: httpResponseStatus.unauthenticated,
            };
        }

        token = token.split(" ").pop();

        const data = jwt.verify(token, process.env.JWT_SECRET);

        const user = await authSvc.getUserByFilter({ _id: data.sub });

        req.loggedInUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            image: user.image,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
        };

        next();
    } catch (exception) {
        if (exception instanceof jwt.TokenExpiredError) {
            next({
                statusCode: httpResponseCode.UNAUTHENTICATED,
                message: exception.message,
                status: httpResponseStatus.tokenExpired,
            });
        } else if (exception instanceof jwt.JsonWebTokenError) {
            next({
                statusCode: httpResponseCode.UNAUTHENTICATED,
                message: exception.message,
                status: httpResponseStatus.tokenError,
            });
        } else {
            next(exception);
        }
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.headers["refresh"] || null;

        if (!refreshToken) {
            next({
                statusCode: httpResponseCode.UNAUTHENTICATED,
                message: "Token not found",
                status: httpResponseStatus.unauthenticated,
            });
        }

        const data = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const user = await authSvc.getUserByFilter({ _id: data.sub });

        req.loggedInUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            image: user.image,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
        };

        next();
    } catch (exception) {
        next(exception);
    }
};
